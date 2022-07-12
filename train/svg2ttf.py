import fontforge
import os
import glob

def read_svgfile(path):
    files = sorted(glob.glob(os.path.join(path)+'/*.*'))
    return files

def read_chars(path):
    fp = open(path,"r",encoding="utf-8")
    chars = fp.readlines()
    fp.close()

    converted_chars = []
    for i in range(len(chars)):
        converted_chars.append(chars[i].strip())
    return converted_chars

def createFont(fontname, fullname,  em, encoding):
    font = fontforge.font()
    font.fontname = fontname
    font.fullname = fullname
    font.em = em
    font.encoding = encoding
    return font 

def addGlyph(font, img, char):
    result = char
    if result == "space":
        result = 32
    else:
        result = ord(result)
    glyph = font.createMappedChar(result)
    glyph.importOutlines(img)
    return font

print("Start Transforming ttf")
imgs = read_svgfile('./train/B')
chars = read_chars('./train/char/char.txt')
imgs2 = read_svgfile('./train/char/Chinese_token')
chars2 = read_chars('./train/char/c_token.txt')
imgs3 = read_svgfile('./train/char/English_svg')
chars3 = read_chars('./train/char/e_char.txt')
imgs4 = read_svgfile('./train/char/stroke')
chars4 = read_chars('./train/char/stroke.txt')

font = createFont('test','testfont', 128, 'UnicodeFull')

for i in range(len(imgs)):
    font = addGlyph(font,imgs[i],chars[i])
for i in range(len(imgs2)):
    font = addGlyph(font,imgs2[i],chars2[i])
for i in range(len(imgs3)):
    font = addGlyph(font,imgs3[i],chars3[i])
for i in range(len(imgs4)):
    font = addGlyph(font,imgs4[i],chars4[i])

# other = fontforge.open("chinsun.ttf")
# other.selection.select(32)
# other.copy()
# font.paste
font.generate('train/testfont.ttf')