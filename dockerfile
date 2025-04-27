# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Set the working directory inside the container
WORKDIR /app

# Install any dependencies required by your project (like `pip` packages)
COPY requirements.txt /app/

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the current directory contents (your Django app) into the container at /app
COPY . /app/

# Expose the port the app will run on
EXPOSE 8000

# Set environment variables
ENV PYTHONUNBUFFERED 1

# Run Django migrations and start the development server
# CMD ["python", "manage.py", "migrate"]
# CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
CMD ["sh", "-c", "python manage.py migrate && python manage.py runserver 0.0.0.0:8000"]
