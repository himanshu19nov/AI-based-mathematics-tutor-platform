from rest_framework import serializers
from .models import User


class UserSignupSerializer(serializers.ModelSerializer):
    firstName = serializers.CharField(write_only=True)
    lastName = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True)

    username = serializers.CharField(write_only=True)  # Include username field
    email = serializers.EmailField(write_only=True)     # Include email field
    academicLevel = serializers.ListField(child=serializers.CharField(), write_only=True)  # Expect a list of academic levels 
    userStatus = serializers.CharField(write_only=True)    # Add userStatus field

    class Meta:
        model = User
        # fields = ['firstName', 'lastName', 'password', 'role']  # Only accepting necessary fields
        fields = ['username', 'email', 'firstName', 'lastName', 'password', 'role', 'academicLevel', 'userStatus']



    # def create(self, validated_data):
    #     # Combine firstName and lastName to form full_name
    #     full_name = f"{validated_data.pop('firstName')} {validated_data.pop('lastName')}"
    #     validated_data['full_name'] = full_name
    #     validated_data['password_hash'] = validated_data.pop('password')  # Save password as 'password_hash'

    #     # Create user with transformed data
    #     user = User.objects.create(**validated_data)
    #     return user


    def create(self, validated_data):
        # Combine firstName and lastName to form full_name
        # full_name = f"{validated_data.pop('firstName')} {validated_data.pop('lastName')}"
        # validated_data['full_name'] = full_name
        validated_data['password'] = validated_data.pop('password')  # Hash password here

        # Get the academic levels as a list and join them into a comma-separated string
        academic_levels = validated_data.pop('academicLevel')
        validated_data['academicLevel'] = ",".join(academic_levels)  # Convert list to comma-separated string

        # Create the user and save to the database
        user = User.objects.create_user(**validated_data)  # Automatically hashes password
        user.save()

        return user    