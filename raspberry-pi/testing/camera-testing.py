import os
from picamera2 import Picamera2
from utils import image_width, image_height

# Define the image folder
image_folder = "camera-data"

# Create the folder if it doesn't exist
if not os.path.exists(image_folder):
    os.makedirs(image_folder)

width = image_width
height = image_height

picam = Picamera2()
picam.configure(picam.create_still_configuration(main={"size": (width, height)}))
picam.start()

for i in range(1, 10):
    picam.capture_file(os.path.join(image_folder, f"ts{i}.jpg"))
    print(f"Captured image {i}")

picam.stop()
