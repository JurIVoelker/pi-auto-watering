from rest import post_upload
from utils import get_current_time_string

res = post_upload("./camera-data/test-image.jpg", get_current_time_string())
print(res)