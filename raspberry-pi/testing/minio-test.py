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
destination_file = "my-test-file.txt"


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
