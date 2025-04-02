from rest_framework import serializers
from .models import User
from .models import Question
from rest_framework import serializers


class UserSignupSerializer(serializers.ModelSerializer):
    firstName = serializers.CharField(write_only=True)
    lastName = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True)

    username = serializers.CharField(write_only=True)  # Include username field
    email = serializers.EmailField(write_only=True)     # Include email field
    academicLevel = serializers.ListField(child=serializers.CharField(), write_only=True)  # Expect a list of academic levels 
    userStatus = serializers.CharField(write_only=True)    # Add userStatus field
    from .models import Question

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


class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

class QuestionCreateSerializer(serializers.ModelSerializer):


    ansType = serializers.CharField(required=True)  # Assuming ansType is a string; adjust if necessary
    answers = serializers.ListField(
        child=serializers.CharField(allow_blank=True), 
        required=False,
        allow_empty=True, 
    )
    class Meta:
        model = Question
        # fields = ['teacher_id', 'category', 'question_text', 'correct_answer', 'difficulty_level']
        fields = ['username', 'difficulty_level', 'category', 'question_text', 'ansType', 'answers', 'correct_answer']

        
    def validate_category(self, value):
        valid = ['Arithmetic', 'Trigonometry', 'Algebra', 'Geometry', 'Calculus']
        if value not in valid:
            raise serializers.ValidationError("Invalid category.")
        return value

    def validate_difficulty_level(self, value):
        valid = ['kindergartens', 'year_1', 'year_2','year_3', 'year_4',
                 'year_5', 'year_6','year_7', 'year_8','year_9', 'year_10',
                 'year_11', 'year_12']
        if value not in valid:
            raise serializers.ValidationError("Invalid difficulty level.")
        return value

class QuestionListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = '__all__'  # or list only specific fields
