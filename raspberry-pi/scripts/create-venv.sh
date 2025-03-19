#!/bin/bash

# Set the virtual environment name
VENV_NAME="venv"

# Check if Python is installed
if ! command -v python3 &> /dev/null
then
    echo "Python3 is not installed. Please install it first."
    exit 1
fi

# Create the virtual environment
python3 -m venv "$VENV_NAME"

# Activate the virtual environment (for convenience)
echo "To activate the virtual environment, run: source $VENV_NAME/bin/activate"

# Confirm success
echo "Virtual environment '$VENV_NAME' created successfully!"
