import torch
import torch.nn as nn
import torch.nn.functional as F
import torchvision.models as models
from torch.nn import MultiheadAttention


# In[3]:
class SelfAttention(nn.Module):
    def __init__(self, in_dim):
        super(SelfAttention, self).__init__()
        self.channel_in = in_dim

        self.query_conv = nn.Conv2d(in_channels = in_dim, out_channels = in_dim // 8, kernel_size = 1)
        self.key_conv = nn.Conv2d(in_channels = in_dim, out_channels = in_dim//8, kernel_size = 1)
        self.value_conv = nn.Conv2d(in_channels = in_dim, out_channels = in_dim, kernel_size = 1)
        self.gamma = nn.Parameter(torch.zeros(1))
        
        self.softmax = nn.Softmax(dim = -1)
    def forward(self, x):
        batch, C, width, height = x.size()
        proj_query = self.query_conv(x).view(batch, -1, width*height).permute(0,2,1)
        proj_key = self.key_conv(x).view(batch, -1, width*height)
        energy = torch.bmm(proj_query, proj_key)
        attention = self.softmax(energy)
        proj_value  = self.value_conv(x).view(batch, -1, width*height)
        
        out = torch.bmm(proj_value, attention.permute(0,2,1))
        out = out.view(batch, C,width, height)
        
        out = self.gamma*out + x

        return out

class ResidualBlock(nn.Module):
    def __init__(self, in_features):
        super(ResidualBlock, self).__init__()

        conv_block = [  nn.ReflectionPad2d(1), # N, C, H, W  H, W 上下左右各填充1个像素
                        nn.Conv2d(in_features, in_features, 3),
                        nn.InstanceNorm2d(in_features),
                        nn.ReLU(inplace=True),
                        nn.ReflectionPad2d(1),
                        nn.Conv2d(in_features, in_features, 3),
                        nn.InstanceNorm2d(in_features)  ]

        self.conv_block = nn.Sequential(*conv_block)
        self.se_block = SEBlock(in_features)

    def forward(self, x):
        return x + self.se_block(self.conv_block(x))
        #return x + self.conv_block(x) 

# In[34]:


class SEBlock(nn.Module):
    def __init__(self, channel, r=16):
        super(SEBlock, self).__init__()
        self.avg_pool = nn.AdaptiveAvgPool2d(1)
        self.fc = nn.Sequential(
            nn.Linear(channel, channel//r, bias=False),
            nn.ReLU(inplace=True),
            nn.Linear(channel//r, channel, bias=False),
            nn.Sigmoid(),
        )

    def forward(self, x):
        b, c , _, _ = x.size()
        # Squeeze
        y = self.avg_pool(x).view(b, c)
        # Excitation
        y = self.fc(y).view(b, c, 1, 1)
        # Fscale
        y = torch.mul(x, y)
        return y


class Generator(nn.Module):
    def __init__(self, input_nc, output_nc, n_residual_blocks=6):
        super(Generator, self).__init__()

        model_encoder, in_features, out_features = self.encoder(input_nc)
        
        # Residual blocks
        model_resnet = []
        model_resnet += [nn.Conv2d(256,256,3,1,1)]

        model_resnet += [ResidualBlock(in_features)]
        model_resnet += [ResidualBlock(in_features)]
        model_resnet += [ResidualBlock(in_features)]
        model_resnet += [ResidualBlock(in_features)]
        model_resnet += [ResidualBlock(in_features)]
        model_resnet += [ResidualBlock(in_features)]
            
        model_decoder = []
        model_decoder = self.decoder(model_decoder, output_nc, in_features, out_features) 

         # Output layer
        model_output = [  nn.ReflectionPad2d(3),
                     nn.Conv2d(64, output_nc, 7),
                     nn.Tanh() ]
        self.model_encoder = nn.Sequential(*model_encoder)
        self.model_resnet = nn.Sequential(*model_resnet)
        self.model_decoder = nn.Sequential(*model_decoder)
        self.model_output = nn.Sequential(*model_output)

    def encoder(self, input_nc):
        # Initial convolution block       
        model = [   nn.ReflectionPad2d(3),
                    nn.Conv2d(input_nc, 64, 7),
                    nn.InstanceNorm2d(64),
                    nn.ReLU(inplace=True) ]

        #model += [SelfAttention(64)]

        # Downsampling
        in_features = 64
        out_features = in_features*2

        for _ in range(2):
            model += [  nn.Conv2d(in_features, out_features, 3, stride=2, padding=1),
                        nn.InstanceNorm2d(out_features),
                        nn.ReLU(inplace=True) ]
            model += [SelfAttention(out_features)]
            in_features = out_features
            out_features = in_features*2
        
        return model, in_features, out_features
            
    def decoder(self, model, output_nc, in_features, out_features):
         # Upsampling
        out_features = in_features//2
        for _ in range(2):
            model += [  nn.ConvTranspose2d(in_features, out_features, 3, stride=2, padding=1, output_padding=1),
                        nn.InstanceNorm2d(out_features),
                        nn.ReLU(inplace=True) ]
            in_features = out_features
            out_features = in_features//2
        return model
    
    def forward(self, x, batchSize=1):
        x = self.model_encoder(x)
        encode = x
        # embedd = torch.reshape(embedd, (1, batchSize, 32, 32))
        # x = torch.cat((x,embedd),batchSize)
        # print(x.shape)
        x = self.model_resnet(x)
        x = self.model_decoder(x)
        x = self.model_output(x)
#         print(x.shape)
        return x, encode



class Discriminator(nn.Module):
    def __init__(self, input_nc):
        super(Discriminator, self).__init__()

        # A bunch of convolutions one after another
        model_block1 = [   nn.Conv2d(input_nc, 64, 4, stride=2, padding=1),
                    nn.LeakyReLU(0.2, inplace=True) ]
        model_block1 += [  nn.Conv2d(64, 128, 4, stride=2, padding=1),
                    nn.InstanceNorm2d(128), 
                    nn.LeakyReLU(0.2, inplace=True) ]
        model_block1 += [  nn.Conv2d(128, 256, 4, stride=2, padding=1),
                    nn.InstanceNorm2d(256), 
                    nn.LeakyReLU(0.2, inplace=True) ]
        model_attn = SelfAttention(256)
        model_block2 = [  nn.Conv2d(256, 512, 4, padding=1),
                    nn.InstanceNorm2d(512), 
                    nn.LeakyReLU(0.2, inplace=True) ]

        # FCN classification layer
        model_block2 += [nn.Conv2d(512, 1, 4, padding=1)]
        self.model_block1 = nn.Sequential(*model_block1)
        self.model_attn = model_attn
        self.model_block2 = nn.Sequential(*model_block2)
    def forward(self, x):
        x =  self.model_block1(x)
        x =  self.model_attn(x)
        x =  self.model_block2(x)
        # Average pooling and flatten
        return F.avg_pool2d(x, x.size()[2:]).view(x.size()[0], -1)

#get_ipython().system('ipython nbconvert --to script models.ipynb')


