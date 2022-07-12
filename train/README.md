# ChineseCalligraphy
Chinese Calligraphy of dissertation

### Version
python
```
3.6.3
```

pytorch
```
1.7.0
```

cuda version
```
11.1
```

### training process

in terminal (you can see the training process on the localhost)
```
$ python -m visdom.server
```

in ChineseCalligraphy folder (you have to check the opt class)
```
class opt:
    epoch = 0 (不用改)
    n_epochs = 500 （這個建議train 450個epoch）
    batchSize = 1 (不用改)
    dataroot = 'datasets/simsun2sentypea_400/' （datasets的位置）
    g_lr = 0.0002 (不用改)
    d_lr = 0.0001 (不用改)
    decay_epoch = 1 (不用改)
    size = 128 (不用改)
    input_nc = 3 (不用改)
    output_nc = 3 (不用改)
    n_cpu = 8 (確定一下核心數)
    cuda = True （要用！！）
    pretrained = False (不用改)
    generator_A2B = 'output/229_netG_A2B.pth' (不用改)
    discriminater_B = 'output/229_netD_B.pth' (不用改)
    weight_clipping_limit = 0.025 (不用改)
```
```
python train.py
```
if you start to train, you can use command to check the gpu is working or not.
```
watch nvidia-smi
```

### testing process (you have to check the opt class)

```
python test.py
```
