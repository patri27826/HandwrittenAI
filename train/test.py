#!/usr/bin/python3

import argparse
from random import shuffle
import sys
import os
import subprocess
import shutil
import torchvision.transforms as transforms
from torchvision.utils import save_image
from torch.utils.data import DataLoader
#from torch.autograd import Variable
import torch
import torch.nn as nn

from train.pytorch_ssim import SSIM
from train.attn_model import Generator
from train.attn_model import Discriminator
from train.utils import ReplayBuffer
from train.utils import LambdaLR
from train.utils import Logger
from train.utils import weights_init_normal
from train.utils import cat_dataloaders
from train.datasets import ImageDataset
from train.datasets import StrokeDataset

# parser = argparse.ArgumentParser()
# parser.add_argument('--batchSize', type=int, default=1, help='size of the batches')
# parser.add_argument('--dataroot', type=str, default='datasets/horse2zebra/', help='root directory of the dataset')
# parser.add_argument('--input_nc', type=int, default=3, help='number of channels of input data')
# parser.add_argument('--output_nc', type=int, default=3, help='number of channels of output data')
# parser.add_argument('--size', type=int, default=128, help='size of the data (squared assumed)')
# parser.add_argument('--cuda', action='store_true', help='use GPU computation')
# parser.add_argument('--n_cpu', type=int, default=8, help='number of cpu threads to use during batch generation')
# parser.add_argument('--generator_A2B', type=str, default='output/199_netG_A2B.pth', help='A2B generator checkpoint file')
# parser.add_argument('--generator_B2A', type=str, default='output/199_netG_B2A.pth', help='B2A generator checkpoint file')
# optt = parser.parse_args()
# print(optt)
def test(username):
    print("Start Generating")
    class optt:
            epoch = 0
            n_epochs = 200
            batchSize = 1
            dataroot = 'train/datasets/simsun2sentypea_400/'
            lr = 0.0002
            decay_epoch = 100
            size = 128
            input_nc = 3
            output_nc = 3
            n_cpu = 8
            cuda = True
            generator_A2B = 'train/output/0_netG_A2B.pth'

    if torch.cuda.is_available() and not optt.cuda:
        print("WARNING: You have a CUDA device, so you should probably run with --cuda")

    ###### Definition of variables ######
    # Networks
    netG_A2B = Generator(optt.input_nc, optt.output_nc)

    if optt.cuda:
        #netG_A2B.cuda() #old
        netG_A2B.to(torch.device('cuda')) #new

    # print(torch.load(optt.generator_A2B))
    checkpoint_G = torch.load(optt.generator_A2B)
    if optt.cuda:
        netG_A2B = nn.DataParallel(netG_A2B).cuda()
        netG_A2B.load_state_dict(checkpoint_G['state_dict'])
        # netG_A2B.load_state_dict(checkpoint_G)
    else:
        netG_A2B.load_state_dict({k.replace('module.', ''): v for k, v in torch.load(optt.generator_A2B['state_dict'], map_location=torch.device('cpu')).items()})


    '''
    # Load state dicts
    if optt.cuda:
        netG_A2B.load_state_dict({k.replace('module.',''):v for k,v in torch.load(optt.generator_A2B[1]).items()})
        #netG_B2A.load_state_dict({k.replace('module.',''):v for k,v in torch.load(optt.generator_B2A).items()})
    else:
        netG_A2B.load_state_dict({k.replace('module.', ''): v for k, v in torch.load(optt.generator_A2B[1], map_location=torch.device('cpu')).items()})
        #netG_B2A.load_state_dict({k.replace('module.', ''): v for k, v in torch.load(optt.generator_B2A, map_location=torch.device('cpu')).items()})
    '''
    # Set model's test mode e.x.  set dropout and batch normalization layers to evaluation mode
    netG_A2B.eval()

    # Inputs & targets memory allocation
    Tensor = torch.cuda.FloatTensor if optt.cuda else torch.Tensor
    input_A = Tensor(optt.batchSize, optt.input_nc, optt.size, optt.size)
    # stroke_A = Tensor(optt.batchSize, 32,32)

    # Dataset loader
    transforms_i = [ transforms.ToTensor(),
                    transforms.Normalize((0.5,), (0.5,)) ]
    dataloader_i = DataLoader(ImageDataset(optt.dataroot, transforms_=transforms_i, mode='test'), 
                            batch_size=optt.batchSize, shuffle=False, num_workers=0)
    # dataloader_s = DataLoader(StrokeDataset(optt.dataroot, mode='test'),
    #                         batch_size=optt.batchSize, shuffle=False, num_workers=0)
    # dataloaders = cat_dataloaders([dataloader_i,dataloader_s])
    ###################################

    ###### Testing######

    # Create output dirs if they don't exist
    shutil.rmtree('train/B')
    if not os.path.exists('train/B'):
        os.makedirs('train/B')

    for i, batch in enumerate(dataloader_i):
        # Set model input
        real_A = input_A.copy_(batch['A'])
        # stroke_A = stroke_A.copy_(batch[1]['A'])

        # Generate output
        # print(netG_A2B(real_A, stroke_A))
        fake_B = 0.5*(netG_A2B(real_A)[0] + 1.0)

        # Save image files
        save_image(fake_B, 'train/B/%04d.png' % (i+1))

        sys.stdout.write('\rGenerated images %04d of %04d' % (i+1, len(dataloader_i)))

    sys.stdout.write('\n')
    ###################################
    subprocess.call("bash ./train/png2svg.sh", shell=True)  
    subprocess.call("fontforge -lang=py -script ./train/svg2ttf.py", shell=True)
    if os.path.isfile('train/'+username+'.ttf'):
        os.remove('train/'+username+'.ttf')
    os.rename("train/testfont.ttf", 'train/'+username+".ttf")
    if os.path.isfile('train/font/'+username+'.ttf'):
        os.remove('train/font/'+username+'.ttf')
    shutil.move('train/'+username+'.ttf', './train/font')


    
