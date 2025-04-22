#!/usr/bin/env bash

# Exit on error
set -o errexit

# Skip migrations to avoid memory crash
# python manage.py migrate --noinput

# Collect static files
# python manage.py collectstatic --noinput

# gunicorn --workers 1 --threads 2 --bind 0.0.0.0:$PORT
gunicorn myproject.wsgi:application --workers=1 --threads=2 --bind 0.0.0.0:$PORT
