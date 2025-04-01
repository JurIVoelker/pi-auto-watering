from datetime import datetime
import pytz

def get_current_time_string():
  german_timezone = pytz.timezone("Europe/Berlin")
  current_time_german = datetime.now(german_timezone)
  iso_string = current_time_german.isoformat()
  return iso_string

def get_current_time():
  german_timezone = pytz.timezone("Europe/Berlin")
  current_time_german = datetime.now(german_timezone)
  return current_time_german

image_width = 2592
image_height = 1944