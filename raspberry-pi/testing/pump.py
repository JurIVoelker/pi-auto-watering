import RPi.GPIO as GPIO
import time

# Set GPIO mode to BCM
GPIO.setmode(GPIO.BCM)

pin = 14

GPIO.setup(pin, GPIO.OUT)

GPIO.output(pin, GPIO.HIGH)
print("Pump is ON")
time.sleep(5)

GPIO.output(pin, GPIO.LOW)
print("Pump is OFF")

GPIO.cleanup()
