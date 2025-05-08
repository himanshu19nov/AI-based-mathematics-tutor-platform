from rest_framework import serializers
from .models import User, Question, Quiz, QuizQuestion, KnowledgeBase


class UserSignupSerializer(serializers.ModelSerializer):
    firstName = serializers.CharField(write_only=True)
    lastName = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True)

    username = serializers.CharField(write_only=True)
    email = serializers.EmailField(write_only=True)
    academicLevel = serializers.ListField(child=serializers.CharField(), write_only=True)
    userStatus = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'firstName', 'lastName', 'password', 'role', 'academicLevel', 'userStatus']

    def validate_role(self, value):
        """
        Normalize role input to lowercase and validate.
        """
        allowed_roles = ['teacher', 'student', 'parent']
        value = value.lower()
        if value not in allowed_roles:
            raise serializers.ValidationError("Invalid role. Must be 'teacher', 'student', or 'parent'.")
        return value

    def create(self, validated_data):
        # Convert academicLevel list to comma-separated string
        academic_levels = validated_data.pop('academicLevel')
        validated_data['academicLevel'] = ",".join(academic_levels)

        # Use custom create_user method to hash password
        user = User.objects.create_user(**validated_data)
        user.save()
        return user


class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()


class QuestionCreateSerializer(serializers.ModelSerializer):
    ansType = serializers.CharField(required=True)
    answers = serializers.ListField(
        child=serializers.CharField(allow_blank=True),
        required=False,
        allow_empty=True,
    )

    class Meta:
        model = Question
        fields = ['username', 'difficulty_level', 'category', 'question_text', 'ansType', 'answers', 'correct_answer'] 
    def validate_category(self, value):
        valid = ['Arithmetic', 'Trigonometry', 'Algebra', 'Geometry', 'Calculus']
        if value not in valid:
            raise serializers.ValidationError("Invalid category.")
        return value

    def validate_difficulty_level(self, value):
        valid = [
            'kindergartens', 'year_1', 'year_2', 'year_3', 'year_4',
            'year_5', 'year_6', 'year_7', 'year_8', 'year_9', 'year_10',
            'year_11', 'year_12'
        ]
        if value not in valid:
            raise serializers.ValidationError("Invalid difficulty level.")
        return value


class QuestionListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = '__all__'


class QuizQuestionSerializer(serializers.ModelSerializer):
    question = QuestionListSerializer()

    class Meta:
        model = QuizQuestion
        fields = ['question', 'score']

class QuizListSerializer(serializers.ModelSerializer):
    teacher_username = serializers.CharField(source='teacher.username', read_only=True)
    questions = serializers.SerializerMethodField()

    class Meta:
        model = Quiz
        fields = '__all__'

    def get_questions(self, obj):
        quiz_questions = QuizQuestion.objects.filter(quiz=obj).select_related('question')
        return QuizQuestionSerializer(quiz_questions, many=True).data



class KnowledgeBaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = KnowledgeBase
        fields = '__all__'