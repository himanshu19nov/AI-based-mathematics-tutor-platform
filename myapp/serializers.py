from rest_framework import serializers
from .models import User


class UserSignupSerializer(serializers.ModelSerializer):
    firstName = serializers.CharField(write_only=True)
    lastName = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['firstName', 'lastName', 'password', 'role']  # Only accepting necessary fields

    def create(self, validated_data):
        # Combine firstName and lastName to form full_name
        full_name = f"{validated_data.pop('firstName')} {validated_data.pop('lastName')}"
        validated_data['full_name'] = full_name
        validated_data['password_hash'] = validated_data.pop('password')  # Save password as 'password_hash'

        # Create user with transformed data
        user = User.objects.create(**validated_data)
        return user
