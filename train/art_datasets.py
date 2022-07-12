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

class ImageDataset(Dataset):
    def __init__(self, root, transforms_=None, unaligned=False, mode='train'):
    # align對齊的
        self.transform = transforms.Compose(transforms_)
        self.unaligned = unaligned
        self.files_A = sorted(glob.glob(os.path.join(root, '%s/A' % mode) + '/*.*'))
        self.files_B = sorted(glob.glob(os.path.join(root, '%s/B' % mode) + '/*.*'))
        self.files_C = sorted(glob.glob(os.path.join(root, '%s/C' % mode) + '/*.*'))
    def __getitem__(self, index):
        item_A = self.transform(Image.open(self.files_A[index % len(self.files_A)]))
        item_B = self.transform(Image.open(self.files_B[index % len(self.files_B)]))
        item_C = self.transform(Image.open(self.files_C[index % len(self.files_C)]))
        return {'A': item_A, 'B': item_B, 'C': item_C}
    def __len__(self):
        return max(len(self.files_A), len(self.files_B), len(self.files_C))
    
count = 0

class StrokeDataset(Dataset):
    def __init__(self, root='datasets/fenyun_300', mode='test'):
    # align對齊的
        self.mode = mode
        self.stroke_A = self.read_file('%s/%s/stroke.txt' % (root,mode))
        self.stroke_B = self.read_file('%s/%s/stroke.txt' % (root,mode))
        self.stroke_C = self.read_file('%s/%s/stroke.txt' % (root,mode))
    def __getitem__(self, index):
        stroke_A = self.stroke_A[index]
        stroke_B = self.stroke_B[index]
        stroke_C = self.stroke_B[index]
        return {'A': stroke_A, 'B': stroke_B, 'C':stroke_C}
    def __len__(self, mode='train'):
        return max(len(self.stroke_A), len(self.stroke_B), len(self.stroke_C))
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




