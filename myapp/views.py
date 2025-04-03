

# Create your views here.
from django.http import HttpResponse
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import UserSignupSerializer
from .models import User
from django.shortcuts import render
import json
import hashlib  # Only for demo hashing (not recommended for production)
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import User  # assuming custom User model maps to `Users` table
from .serializers import UserLoginSerializer
from .serializers import QuestionCreateSerializer
from .serializers import QuestionListSerializer
from .models import Question
from django.contrib.auth.hashers import check_password
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import User, Quiz, QuizQuestion
from django.db import connection
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Question


def user_registration(request):
    return render(request, 'pages/user_registration.html')  # Updated path


def home(request):
    return HttpResponse("Hello, Django is working!")




@api_view(['POST'])
def user_signup(request):
    if request.method == 'POST':
        serializer = UserSignupSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User registered successfully!"}, status=status.HTTP_201_CREATED)
        else:
            # Log the validation errors for debugging
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) 
        # return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
def delete_user(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        user.delete()
        return Response({'message': 'User deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)


from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import make_password
from .models import User

@api_view(['PUT'])
def update_user(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        data = request.data

        # Update fields if present in the request
        user.username = data.get('username', user.username)
        user.email = data.get('email', user.email)
        user.firstName = data.get('firstName', user.firstName)
        user.lastName = data.get('lastName', user.lastName)

        # Update fullName automatically if first/last changed
        user.fullName = f"{user.firstName} {user.lastName}"

        if 'password' in data and data['password']:
            user.password = make_password(data['password'])

        user.role = data.get('role', user.role)
        user.academicLevel = data.get('academicLevel', user.academicLevel)
        user.userStatus = data.get('userStatus', user.userStatus)

        user.save()

        return Response({'message': 'User updated successfully'}, status=status.HTTP_200_OK)

    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)



@api_view(['POST'])
def user_login(request):
    # email = request.data.get('email')
    username = request.data.get('username')
    password = request.data.get('password')
    #hashed_pw = hashlib.sha256(password.encode()).hexdigest()
    try:
        # user = User.objects.get(email=email)
        user = User.objects.get(username=username)
        if check_password(password, user.password):
            
            # Generate JWT token on successful login
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            
            return Response({
                'message': 'Login successful',
                'username': user.username,
                'role': user.role,
                'status': user.userStatus,
                'token': access_token
            }, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)



@api_view(['POST'])
def create_question(request):
    serializer = QuestionCreateSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'Question created successfully!'}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def list_all_users(request):
    users = User.objects.all()
    user_list = []

    for user in users:
        user_list.append({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "firstName": user.firstName,
            "lastName": user.lastName,
            "fullName": user.fullName,
            "role": user.role,
            "academicLevel": user.academicLevel,
            "userStatus": user.userStatus
        })

    return Response(user_list)

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

@api_view(['GET'])
def list_questions(request):
    questions = Question.objects.all()
    serializer = QuestionListSerializer(questions, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
def search_questions(request):
    questions = Question.objects.all()

    category = request.GET.get('category')
    difficulty = request.GET.get('difficulty_level')

    if category:
        questions = questions.filter(category__iexact=category)
    if difficulty:
        questions = questions.filter(difficulty_level__iexact=difficulty)

    serializer = QuestionCreateSerializer(questions, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
@api_view(['POST'])
def create_quiz(request):
    data = request.data
    username = data.get("username")
    quiz_title = data.get("quizName")
    selected_questions = data.get("selectedQuestions", [])

    if not username or not quiz_title or not selected_questions:
        return Response({"error": "Missing required fields"}, status=400)

    try:
        user = User.objects.get(username=username)
        teacher_id = user.id  # Grab teacher's user ID

        total_marks = sum(q["score"] for q in selected_questions)

        # Manually insert into quiz table (managed = False)
        with connection.cursor() as cursor:
            cursor.execute(
                "INSERT INTO quiz (teacher_id, quiz_title, total_marks, created_at) VALUES (%s, %s, %s, NOW()) RETURNING quiz_id",
                [teacher_id, quiz_title, total_marks]
            )
            quiz_id = cursor.fetchone()[0]

            for q in selected_questions:
                question_id = q["questionId"]
                cursor.execute(
                    "INSERT INTO Quiz_Questions (quiz_id, question_id) VALUES (%s, %s)",
                    [quiz_id, question_id]
                )

        return Response({"message": "Quiz created successfully!", "quiz_id": quiz_id}, status=201)

    except User.DoesNotExist:
        return Response({"error": "Invalid username"}, status=404)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['PUT'])
def update_question(request, question_id):
    try:
        question = Question.objects.get(question_id=question_id)
    except Question.DoesNotExist:
        return Response({'error': 'Question not found'}, status=status.HTTP_404_NOT_FOUND)

    data = request.data
    question.question_text = data.get('text', question.question_text)
    question.difficulty_level = data.get('level', question.difficulty_level)
    question.category = data.get('category', question.category)
    question.correct_answer = data.get('correctAnswer', question.correct_answer)

    try:
        question.save()
        return Response({'message': 'Question updated successfully'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['DELETE'])
def delete_question(request, question_id):
    try:
        question = Question.objects.get(question_id=question_id)
        question.delete()
        return Response({'message': 'Question deleted successfully'}, status=status.HTTP_200_OK)
    except Question.DoesNotExist:
        return Response({'error': 'Question not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)