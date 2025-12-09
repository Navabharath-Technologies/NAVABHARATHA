from PIL import Image
from collections import Counter

def get_dominant_color(image_path):
    try:
        img = Image.open(image_path)
        img = img.convert("RGB")
        width, height = img.size
        # Sample pixels from the border to get background color
        pixels = []
        for x in range(width):
            pixels.append(img.getpixel((x, 0)))
            pixels.append(img.getpixel((x, height - 1)))
        for y in range(height):
            pixels.append(img.getpixel((0, y)))
            pixels.append(img.getpixel((width - 1, y)))
            
        most_common = Counter(pixels).most_common(1)[0][0]
        return '#{:02x}{:02x}{:02x}'.format(most_common[0], most_common[1], most_common[2])
    except Exception as e:
        return str(e)

print(get_dominant_color(r"d:\ZED\assets\navabharatha_logo.png"))
