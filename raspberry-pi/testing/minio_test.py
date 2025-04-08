from minio import Minio
from env import MINIO_URL, MINIO_ACCESS_KEY, MINIO_SECRET_KEY

client = Minio(
    MINIO_URL,
    access_key=MINIO_ACCESS_KEY,
    secret_key=MINIO_SECRET_KEY,
    secure=True,
)

# The destination bucket and filename on the MinIO server
bucket_name = "raspberry-pi-images"

def upload_image(image_path):
    image_name = image_path.split("/")[-1]
    date = image_name.split("_")[0]
    save_path = date + "/" + image_name
    try:
        client.list_buckets()
    except:
        print("Connection refused")
        return
    try:
        # Upload the file, renaming it in the process
        client.fput_object(
            bucket_name,
            save_path,
            image_path,
        )
        print(
            image_path,
            "successfully uploaded as ",
            save_path,
            "to bucket",
            bucket_name,
        )
    except:
        print("Unexpected error occurred.")