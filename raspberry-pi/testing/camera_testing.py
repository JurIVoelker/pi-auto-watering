import os
from utils import image_width, image_height
from picamera2 import Picamera2
import time
from datetime import datetime
from PIL import Image
import os

# Define the image folder
image_folder = "camera-data"
picam = Picamera2()

# Create the folder if it doesn't exist
if not os.path.exists(image_folder):
    os.makedirs(image_folder)

def capture_image():
    width = image_width
    height = image_height
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"image_{timestamp}.jpg"
    filepath = os.path.join(image_folder, filename)

    if picam.started:
        picam.stop()
    try:
        picam.configure(picam.create_still_configuration(main={"size": (width, height)}))
        picam.set_controls({"AeEnable": True, "AwbEnable": True, "AwbMode": "auto"})
        picam.start()
        time.sleep(1.5)  # Let AE settle
        picam.capture_file(filepath)
    finally:
        # Ensure the camera is always properly stopped
        picam.stop()

    # Rotate image
    with Image.open(filepath) as img:
        rotated_img = img.rotate(-90, expand=True)
        rotated_img.save(filepath)

    return filepath