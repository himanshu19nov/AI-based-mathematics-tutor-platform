#!/usr/bin/env bash

# Exit on error
set -o errexit

# Run migrations
python manage.py migrate --noinput

# Collect static files (optional if you're using Django's static hosting)
python manage.py collectstatic --noinput

# Start the Gunicorn server
gunicorn myproject.wsgi:application --bind 0.0.0.0:$PORT
