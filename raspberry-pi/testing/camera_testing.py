import os
from picamera2 import Picamera2
from utils import image_width, image_height
from datetime import datetime
from PIL import Image

# Define the image folder
image_folder = "camera-data"

# Create the folder if it doesn't exist
if not os.path.exists(image_folder):
    os.makedirs(image_folder)

width = image_width
height = image_height

def capture_image():
    picam = Picamera2()
    picam.configure(picam.create_still_configuration(main={"size": (width, height)}))
    picam.start()
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"image_{timestamp}.jpg"
    filepath = os.path.join(image_folder, filename)
    picam.capture_file(filepath)
    picam.stop()

    # Rotate the image to the right (90 degrees clockwise)
    with Image.open(filepath) as img:
        rotated_img = img.rotate(-90, expand=True)
        rotated_img.save(filepath)
