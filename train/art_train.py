#!/usr/bin/env python
# coding: utf-8

# In[2]:


import argparse
import itertools

import torchvision.transforms as transforms
from torch.utils.data import DataLoader
#from torch.autograd import Variable
from PIL import Image
import torch
import torch.nn as nn

from art_models import Generator
from art_models import Discriminator
from utils import ReplayBuffer
from utils import LambdaLR
from utils import Logger
from utils import weights_init_normal
from utils import cat_dataloaders
from art_datasets import ImageDataset
from art_datasets import StrokeDataset

# parser = argparse.ArgumentParser()
# parser.add_argument('--epoch', type=int, default=0, help='starting epoch')
# parser.add_argument('--n_epochs', type=int, default=200, help='number of epochs of training')
# parser.add_argument('--batchSize', type=int, default=6, help='size of the batches')
# parser.add_argument('--dataroot', type=str, default='datasets/horse2zebra/', help='root directory of the dataset')
# parser.add_argument('--lr', type=float, default=0.0002, help='initial learning rate')
# parser.add_argument('--decay_epoch', type=int, default=100, help='epoch to start linearly decaying the learning rate to 0')
# parser.add_argument('--size', type=int, default=128, help='size of the data crop (squared assumed)')
# parser.add_argument('--input_nc', type=int, default=3, help='number of channels of input data')
# parser.add_argument('--output_nc', type=int, default=3, help='number of channels of output data')
# parser.add_argument('--cuda', action='store_true', help='use GPU computation')
# parser.add_argument('--n_cpu', type=int, default=8, help='number of cpu threads to use during batch generation')
# opt = parser.parse_args()
# print(opt)

class opt:
    epoch = 0
    n_epochs = 300
    batchSize = 1
    dataroot = 'art_datasets/simsun2SentyPea_400/'
    g_lr = 0.0002
    d_lr = 0.0001
    decay_epoch = 1
    size = 128
    input_nc = 3
    output_nc = 3
    n_cpu = 8
    cuda = True




if torch.cuda.is_available() and not opt.cuda:
    print("WARNING: You have a CUDA device, so you should probably run with --cuda")

###### Definition of variables ######
# Networks
netG_A2B = Generator(opt.input_nc, opt.output_nc)
netD_B = Discriminator(opt.output_nc)

netG_B2C = Generator(opt.input_nc, opt.output_nc)
netD_C = Discriminator(opt.output_nc)

if opt.cuda:
    netG_A2B.to(torch.device('cuda'))
    netD_B.to(torch.device('cuda'))

    netG_A2B = nn.DataParallel(netG_A2B, device_ids=[0])
    netD_B = nn.DataParallel(netD_B, device_ids=[0])

    netG_B2C.to(torch.device('cuda'))
    netD_C.to(torch.device('cuda'))

    netG_B2C = nn.DataParallel(netG_B2C, device_ids=[0])
    netD_C = nn.DataParallel(netD_C, device_ids=[0])

netG_A2B.apply(weights_init_normal)
netD_B.apply(weights_init_normal)

netG_B2C.apply(weights_init_normal)
netD_C.apply(weights_init_normal)

# Lossess
criterion_GAN = torch.nn.MSELoss()
criterion_identity = torch.nn.L1Loss()


# Optimizers & LR schedulers
optimizer_G_A2B = torch.optim.Adam(netG_A2B.parameters(),
                                lr=opt.g_lr, betas=(0.5, 0.999))
optimizer_G_B2C = torch.optim.Adam(netG_B2C.parameters(),
                                lr=opt.g_lr, betas=(0.5, 0.999))
optimizer_D_B = torch.optim.Adam(netD_B.parameters(), lr=opt.d_lr, betas=(0.5, 0.999))
optimizer_D_C = torch.optim.Adam(netD_C.parameters(), lr=opt.d_lr, betas=(0.5, 0.999))

lr_scheduler_G_A2B = torch.optim.lr_scheduler.LambdaLR(optimizer_G_A2B, lr_lambda=LambdaLR(opt.n_epochs, opt.epoch, opt.decay_epoch).step)
lr_scheduler_D_B = torch.optim.lr_scheduler.LambdaLR(optimizer_D_B, lr_lambda=LambdaLR(opt.n_epochs, opt.epoch, opt.decay_epoch).step)

lr_scheduler_G_B2C = torch.optim.lr_scheduler.LambdaLR(optimizer_G_B2C, lr_lambda=LambdaLR(opt.n_epochs, opt.epoch, opt.decay_epoch).step)
lr_scheduler_D_C = torch.optim.lr_scheduler.LambdaLR(optimizer_D_C, lr_lambda=LambdaLR(opt.n_epochs, opt.epoch, opt.decay_epoch).step)

# Inputs & targets memory allocation
Tensor = torch.cuda.FloatTensor if opt.cuda else torch.Tensor
input_A = Tensor(opt.batchSize, opt.input_nc, opt.size, opt.size)
input_B = Tensor(opt.batchSize, opt.output_nc, opt.size, opt.size)
input_C = Tensor(opt.batchSize, opt.output_nc, opt.size, opt.size)
stroke_A = Tensor(opt.batchSize, 32,32)
stroke_B = Tensor(opt.batchSize, 32,32)
stroke_C = Tensor(opt.batchSize, 32,32)
target_real_B = Tensor(opt.batchSize).fill_(1.0)
target_fake_B = Tensor(opt.batchSize).fill_(0.0)
target_real_C = Tensor(opt.batchSize).fill_(1.0)
target_fake_C = Tensor(opt.batchSize).fill_(0.0)


# Buffers of previously generated samples
fake_A_buffer = ReplayBuffer()
fake_B_buffer = ReplayBuffer()
fake_C_buffer = ReplayBuffer()

# Dataset loader
transforms_ = [ transforms.Resize(int(opt.size*1.12), Image.BICUBIC), 
                transforms.RandomCrop(opt.size), 
                transforms.RandomHorizontalFlip(),
                transforms.ToTensor(),  # 归一化到[0, 1] 维度转换, 例如[128, 128, 1] --> [1, 128, 128]
                transforms.Normalize((0.5,), (0.5,)) ] # 将[0, 1]归一化到[-1, 1]  mean, std
dataloader_i = DataLoader(ImageDataset(opt.dataroot, transforms_=transforms_, unaligned=True, mode = 'train'),
                        batch_size=opt.batchSize, shuffle=False, num_workers=opt.n_cpu)
dataloader_s = DataLoader(StrokeDataset(opt.dataroot, mode = 'train'),
                        batch_size=opt.batchSize, shuffle=False, num_workers=opt.n_cpu)
dataloaders = cat_dataloaders([dataloader_i,dataloader_s])

# Loss plot
logger = Logger(opt.n_epochs, len(dataloader_i))
###################################

###### Training ######
for epoch in range(opt.epoch, opt.n_epochs):
    for i, batch in enumerate(dataloaders):
        # Set model input
        
        real_A = input_A.copy_(batch[0]['A'])
        real_B = input_B.copy_(batch[0]['B'])
        real_C = input_C.copy_(batch[0]['C'])

        stroke_A = stroke_A.copy_(batch[1]['A'])
        stroke_B = stroke_B.copy_(batch[1]['B'])
        stroke_C = stroke_C.copy_(batch[1]['C'])

        ###### Generators A2B  ######
        optimizer_G_A2B.zero_grad()

        # GAN loss
        fake_B = netG_A2B(real_A, stroke_A, opt.batchSize)
        pred_fake_B = netD_B(fake_B)
        loss_GAN_A2B = criterion_GAN(pred_fake_B, target_real_B) # generator让pred_fake接近1

        # Total loss
        loss_G_A2B = loss_GAN_A2B

        loss_G_A2B.backward()
        optimizer_G_A2B.step()

        ###################################

        ###### Generators B2C  ######
        optimizer_G_B2C.zero_grad()

        # GAN loss
        fake_B = netG_A2B(real_A, stroke_A, opt.batchSize)
        fake_C = netG_B2C(fake_B, stroke_B, opt.batchSize)
        pred_fake_C = netD_C(fake_C)
        loss_GAN_B2C = criterion_GAN(pred_fake_C, target_real_C) # generator让pred_fake接近1

        # Total loss
        loss_G_B2C = loss_GAN_B2C

        loss_G_B2C.backward()
        optimizer_G_B2C.step()

        ###################################
        

        ###### Discriminator B ######
        optimizer_D_B.zero_grad()

        # Real loss
        pred_real_B = netD_B(real_B)
        loss_D_B_real = criterion_GAN(pred_real_B, target_real_B)
        
        # Fake loss
        fake_B = fake_B_buffer.push_and_pop(fake_B)
        pred_fake_B = netD_B(fake_B.detach())
        loss_D_B_fake = criterion_GAN(pred_fake_B, target_fake_B)

        # Total loss
        loss_D_B = (loss_D_B_real + loss_D_B_fake)*0.5
        loss_D_B.backward()

        optimizer_D_B.step()
        ###################################

        ###### Discriminator C ######
        optimizer_D_C.zero_grad()

        # Real loss
        pred_real_C = netD_C(real_C)
        loss_D_C_real = criterion_GAN(pred_real_C, target_real_C)
        
        # Fake loss
        fake_C = fake_C_buffer.push_and_pop(fake_C)
        pred_fake_C = netD_C(fake_C.detach())
        loss_D_C_fake = criterion_GAN(pred_fake_C, target_fake_C)

        # Total loss
        loss_D_C = (loss_D_C_real + loss_D_C_fake)*0.5
        loss_D_C.backward()

        optimizer_D_C.step()
        ###################################

        # Progress report (http://localhost:8097)
        logger.log({'loss_G_A2B': loss_G_A2B,  'loss_D_B': (loss_D_B), 'loss_G_B2C': loss_G_B2C,  'loss_D_C': (loss_D_C)},
                    images={'real_A': real_A, 'real_B': real_B,  'real_C': real_C,'fake_B': fake_B ,'fake_C': fake_C})

    # Update learning rates
    lr_scheduler_G_A2B.step()
    lr_scheduler_G_B2C.step()
    lr_scheduler_D_B.step()
    lr_scheduler_D_C.step()

    # Save models checkpoints
    if epoch % 10 == 9:

        torch.save(netG_A2B.state_dict(), 'output/{}_netG_A2B.pth'.format(epoch))
        torch.save(netD_B.state_dict(), 'output/{}_netD_B.pth'.format(epoch))
        torch.save(netG_B2C.state_dict(), 'output/{}_netG_B2C.pth'.format(epoch))
        torch.save(netD_C.state_dict(), 'output/{}_netD_C.pth'.format(epoch))

###################################


