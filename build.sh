#!/usr/bin/env bash

# Exit on error
set -o errexit

# Skip migrations to avoid memory crash
# python manage.py migrate --noinput

# Collect static files
# python manage.py collectstatic --noinput

# Start the Gunicorn server
gunicorn myproject.wsgi:application --bind 0.0.0.0:$PORT

