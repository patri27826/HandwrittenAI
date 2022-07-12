# -*- coding: utf-8 -*-
from PIL import Image, ImageDraw, ImageFont


# Settings
W, H = (128, 128)

# Font
font = ImageFont.truetype(r"C:\Users\USER\pingProjects\Research\FontStrokeDataset-master\fonts\SimSun.ttf", 110, encoding='utf-8')
file = open('a.txt',"r",encoding="utf-8")
word_list = file.readlines();
# Image
for count,word in enumerate(word_list):
    image = Image.new("RGB", (W, H), "white")
    draw = ImageDraw.Draw(image)
    offset_w, offset_h = font.getoffset(word)
    w, h = draw.textsize(word, font=font)
    pos = ((W-w-offset_w)/2, -(H-h-offset_h)/10)
    # Draw
    draw.text(pos, word, "black", font=font)
    # Save png file
    temp = "%04d" % (count+4808)
    image.save("train/"+str(temp)+".png")