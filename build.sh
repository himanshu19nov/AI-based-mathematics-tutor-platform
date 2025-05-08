#!/usr/bin/env bash

# Exit on error
set -o errexit

python manage.py makemigrations
python manage.py migrate

# Start the Gunicorn server with sync worker
gunicorn myproject.wsgi:application \
    --bind 0.0.0.0:$PORT \
    --workers 1 \
    --worker-class sync