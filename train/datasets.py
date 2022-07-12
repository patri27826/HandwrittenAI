#!/usr/bin/env python
# coding: utf-8

# In[1]:


# %load datasets.py
#!/usr/bin/env python
import glob
# 返回所有披佩路徑
import random
# generate fake random number
import os
# do system command
from torch.utils.data import Dataset
from torch.utils.data import DataLoader
# data loading
from PIL import Image
# cope with image 
import torchvision.transforms as transforms
# common image transformations

import re
import ast

from sklearn import preprocessing
import torch
import numpy as np


class Stroke():
    def __init__(self, root='datasets/fenyun_300',mode = 'train'):
        self.stroke_A = self.read_file('%s/%s/A/stroke.txt' % (root,mode))
    def read_file(self, path):
        fp = open(path, 'r')
        lines = fp.readlines()
        stroke_torch = {}
        count = 0
        stroke_list = []
        for line in lines:
            replaceStr = line.replace(r'\x','')
            stroke_list.append(self.stroke2torch(replaceStr))
            count = count+1
        fp.close()
        # print(torch.as_tensor(stroke_list))
        return torch.as_tensor(stroke_list)
    def stroke2torch(self, line):
        strokes = line[9:] 
        x = [x.strip() for x in eval(strokes)]
        le = preprocessing.LabelEncoder()
        targets = le.fit_transform(x)
        targets[:] = targets[:]+2
        return self.pad_vec(targets,32)
    def pad_vec(self, vec, dim):
        shape = np.shape(vec)
        padded_array = np.ones((dim,dim))
        padded_array[:shape[0],shape[1]] = vec
        return padded_array

class ImageStrokeDataset(Dataset):
    def __init__(self, root='datasets/fenyun_300', transforms_ = None, unaligned = False, mode = 'train'):
        self.transform = transforms.Compose(transforms_)
        self.unaligned = unaligned
        self.files_A = sorted(glob.glob(os.path.join(root, '%s/A' % mode) + '/*.*'))
        self.files_B = sorted(glob.glob(os.path.join(root, '%s/B' % mode) + '/*.*'))
        self.stroke_A = self.read_file('%s/%s/A/stroke.txt' % (root,mode))
        self.stroke_B = self.read_file('%s/%s/B/stroke.txt' % (root,mode))
    def __getitem__(self, index):
        img_A = self.transform(Image.open(self.files_A[index]))
        stroke_A = self.stroke_A
        if self.unaligned:
            random_num = random.randint(0, len(self.files_B) - 1)
            img_B = self.transform(Image.open(self.files_B[random_num]))
            stroke_B = self.stroke_B
        else:
            img_B = self.transform(Image.open(self.files_B[index]))
            stroke_B = self.stroke_B
        return {'A': [img_A[index], stroke_A[index]], 'B': [img_B[index],stroke_B[index]]}

    def __len__(self):
        return max(len(self.files_A), len(self.files_B))    
    


class ImageDataset(Dataset):
    def __init__(self, root, transforms_=None, unaligned=False, mode='train'):
    # align對齊的
        self.transform = transforms.Compose(transforms_)
        self.unaligned = unaligned
        self.files_A = sorted(glob.glob(os.path.join(root, '%s/A' % mode) + '/*.*'))
        # every image's file address
        self.files_B = sorted(glob.glob(os.path.join(root, '%s/B' % mode) + '/*.*'))
    def __getitem__(self, index):
        item_A = self.transform(Image.open(self.files_A[index % len(self.files_A)]))
        # if self.unaligned:
        #     item_B = self.transform(Image.open(self.files_B[random.randint(0, len(self.files_B) - 1)]))
        # else:
        item_B = self.transform(Image.open(self.files_B[index % len(self.files_B)]))
        return {'A': item_A, 'B': item_B}
    def __len__(self):
        return max(len(self.files_A), len(self.files_B))
    

count = 0

class StrokeDataset(Dataset):
    def __init__(self, root='datasets/fenyun_300', mode='test'):
    # align對齊的
        self.mode = mode
        self.stroke_A = self.read_file('%s/%s/stroke.txt' % (root,mode))
        self.stroke_B = self.read_file('%s/%s/stroke.txt' % (root,mode))
    def __getitem__(self, index):
        stroke_A = self.stroke_A[index]
        stroke_B = self.stroke_B[index]
        return {'A': stroke_A, 'B': stroke_B}
    def __len__(self, mode='train'):
        return max(len(self.stroke_A), len(self.stroke_B))
    def read_file(self, path):
        fp = open(path, 'r')
        lines = fp.readlines()
        stroke_torch = {}
        count = 0
        stroke_list = []
        for line in lines:
            replaceStr = line.replace(r'\x','')
            stroke_list.append(self.stroke2torch(replaceStr))
            count = count+1
        fp.close()
        return torch.as_tensor(stroke_list)
    def stroke2torch(self, line):
        strokes = line[9:] 
        x = [x.strip() for x in eval(strokes)]
        le = preprocessing.LabelEncoder()
        targets = le.fit_transform(x)
        targets[:] = targets[:]+2
        return self.pad_vec(targets)
    def pad_vec(self, vec, dim = 100):
        global count
        count = count+1
        shape = np.shape(vec)
        padded_array = np.ones(dim)
        padded_array[:shape[0]] = vec
        padded_array = padded_array.reshape(10,10)
        padded_array = np.pad(padded_array,((11,11),(11,11)),'constant',constant_values = ((1,1),(1,1)))
        return padded_array



# Dataset loader
transforms_ = [ transforms.Resize(int(128*1.12), Image.BICUBIC), 
                # BICUBIC：双立方滤波。在输入图像的4*4矩阵上进行立方插值。
                transforms.RandomCrop(128), 
                # Crop 中心裁剪
                transforms.RandomHorizontalFlip(),
                # 依据概率p对PIL图片进行水平翻转
                transforms.ToTensor(),  # 归一化到[0, 1] 维度转换, 例如[128, 128, 1] --> [1, 128, 128]
                transforms.Normalize((0.5,), (0.5,)) ] # 将[0, 1]归一化到[-1, 1]  mean, std
# TRANSFORM https://zhuanlan.zhihu.com/p/53367135
imgd = ImageDataset('datasets/fenyun_300', transforms_, unaligned=True)
# dataloader = DataLoader(imgd,
#                          batch_size=6, shuffle=True, num_workers=8)
# print(imgd[0])
# print(imgd[1])
# #print(len(dataloader.dataset))




# sd = StrokeDataset()
# print(sd[0])
# print(sd.__len__())








