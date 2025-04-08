from minio import Minio
from env import MINIO_URL, MINIO_ACCESS_KEY, MINIO_SECRET_KEY
import os

client = Minio(
    MINIO_URL,
    access_key=MINIO_ACCESS_KEY,
    secret_key=MINIO_SECRET_KEY,
    secure=True,
)

# The destination bucket and filename on the MinIO server
bucket_name = "raspberry-pi-images"

def upload_image(image_path):
    file_name = image_path.split("/")[-1]
    try:
        client.list_buckets()
    except:
        print("Connection refused")
        return
    try:
        # Upload the file, renaming it in the process
        client.fput_object(
            bucket_name,
            file_name,
            image_path,
        )
        print(
            image_path,
            "successfully uploaded as object",
            file_name,
            "to bucket",
            bucket_name,
        )
    except:
        print("Unexpected error occurred.")

# Directory containing the images
image_directory = "./camera-data"
# Get the list of files in the directory
files = os.listdir(image_directory)

# Check if there are any files in the directory
if files:
    # Get the first file
    first_file = os.path.join(image_directory, files[0])
    # Upload the first file
    upload_image(first_file)
else:
    print("No files found in the directory.")