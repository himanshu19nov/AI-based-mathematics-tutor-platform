

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
# import openai
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
# from transformers import pipeline
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import os

from .serializers import QuizListSerializer

# # Load model globally once
# qa_pipeline = pipeline("question-answering", model="distilbert-base-uncased-distilled-squad")


# Optional: You can change this to a custom passage or context
default_context = """
Mathematics is the study of numbers, shapes, and patterns. It is used in everything from engineering and architecture to economics and data science.
The Pythagorean theorem states that in a right-angled triangle, a² + b² = c².
The derivative of sin(x) is cos(x). The area of a circle is πr².
Mean is the average of a data set.
Median is the middle value of a data set when it is arranged in order.
Mode is the value that appears most frequently in a data set.
"""

from django.http import JsonResponse

# Optimize Initial Load 
def health_check(request):
    return JsonResponse({'status': 'ok'})


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
            # access_token = str(refresh.access_token)
            access_token = refresh.access_token
            access_token['username'] = user.username
            access_token['fullName'] = user.fullName
            access_token['role'] = user.role



            return Response({
                'message': 'Login successful',
                'username': user.username,
                'role': user.role,
                'status': user.userStatus,
                # 'token': access_token
                'token': str(access_token)
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
    # Log the validation errors for debugging
    print(serializer.errors)
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

    # serializer = QuestionCreateSerializer(questions, many=True)
    serializer = QuestionListSerializer(questions, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
def create_quiz(request):
        data = request.data
        username = data.get("username")
        quiz_title = data.get("quizName")
        quiz_level = data.get("quizLevel")
        quiz_status = data.get("quizStatus", "draft")
        selected_questions = data.get("selectedQuestions", [])

        # Log received input for debugging
        print("Received selected_questions:", selected_questions)

        if not username or not quiz_title or not selected_questions:
            return Response({"error": "Missing required fields"}, status=400)

        # Validate each selected question has 'score' and 'questionId'
        for q in selected_questions:
            if "score" not in q or "questionId" not in q:
                return Response({"error": "Each selected question must include 'score' and 'questionId'."}, status=400)

        try:
            user = User.objects.get(username=username)
            teacher_id = user.id

            # total_marks = sum(q.get("score", 0) for q in selected_questions)
            total_marks = sum(int(q.get("score", 0)) for q in selected_questions)

            with connection.cursor() as cursor:
                print(f"Teacher ID: {teacher_id}, Quiz Title: {quiz_title}, Quiz Level: {quiz_level}, Quiz Status: {quiz_status}, Total Score: {total_marks}")
                cursor.execute(
                    # "INSERT INTO quiz (teacher_id, quiz_title, total_marks, created_at) VALUES (%s, %s, %s, NOW()) RETURNING quiz_id",
                    # [teacher_id, quiz_title, total_marks]
                    "INSERT INTO quiz (teacher_id, quiz_title, quiz_level, quiz_status, total_marks, created_at) VALUES (%s, %s, %s, %s, %s, NOW()) RETURNING quiz_id",
                    [teacher_id, quiz_title, quiz_level, quiz_status, total_marks]
                )
                quiz_id = cursor.fetchone()[0]
                # print(f"Inserted quiz, got quiz_id: {quiz_id}")

                for q in selected_questions:
                    question_id = q["questionId"]
                    score = int(q["score"])
                    # print(f"Quiz ID: {quiz_id}, Question ID: {question_id}, Score: {score}")
                    cursor.execute(
                        # "INSERT INTO Quiz_Questions (quiz_id, question_id) VALUES (%s, %s)",
                        # [quiz_id, question_id]
                        "INSERT INTO quiz_questions (quiz_id, question_id, score) VALUES (%s, %s, %s)",
                        [quiz_id, question_id, score]
                    )

            return Response({"message": "Quiz created successfully!", "quiz_id": quiz_id}, status=201)

        except User.DoesNotExist:
            return Response({"error": "Invalid username"}, status=404)
        except Exception as e:
            print(f"Error: {str(e)}")
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


# Configure OpenAI with your API key
# openai.api_key = settings.OPENAI_API_KEY


# import openai
# from openai import OpenAI

# client = OpenAI(api_key=settings.OPENAI_API_KEY)

# @api_view(['POST'])
# def ask_ai(request):
#     question = request.data.get("question")

#     if not question:
#         return Response({'error': 'No question provided'}, status=status.HTTP_400_BAD_REQUEST)

#     try:
#         result = qa_pipeline({
#             'context': default_context,
#             'question': question
#         })

#         return Response({'answer': result['answer']})
#     except Exception as e:
#         return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

import traceback
import requests

@csrf_exempt
@api_view(['POST'])
def ask_ai(request):
    TOGETHER_API_KEY = os.getenv("TOGETHER_API_KEY")
    if not TOGETHER_API_KEY:
        return Response({'error': 'Together API key not set'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    question = request.data.get("question")
    if not question:
        return Response({'error': 'No question provided'}, status=status.HTTP_400_BAD_REQUEST)

    print("Question:", question)

    try:
        headers = {
            "Authorization": f"Bearer {TOGETHER_API_KEY}",
            "Content-Type": "application/json"
        }

        # Inject default context into the user prompt (simple RAG)
        user_prompt = f"{default_context}\n\nQuestion: {question}"

        payload = {
            # "model": "togethercomputer/llama-2-7b-chat",
            "model": "mistralai/Mixtral-8x7B-Instruct-v0.1",
            "messages": [
                {"role": "system", "content": "You are a helpful math tutor. Use the provided context to assist the student."},
                {"role": "user", "content": user_prompt}
            ],
            "temperature": 0.7,
            "max_tokens": 512,
            "top_p": 0.95,
        }

        response = requests.post(
            "https://api.together.xyz/v1/chat/completions",
            headers=headers,
            json=payload,
            timeout=20
        )

        response.raise_for_status()
        result = response.json()
        answer = result["choices"][0]["message"]["content"]
        return Response({'answer': answer})

    except requests.exceptions.HTTPError as e:
        print("HTTP ERROR:", e.response.text)
        return Response({'error': 'HTTP Error from Together.ai'}, status=status.HTTP_502_BAD_GATEWAY)
    except Exception as e:
        print("EXCEPTION:", str(e))
        traceback.print_exc()
        return Response({'error': 'Internal Server Error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

@api_view(['GET'])
def get_all_quizzes(request):
    quizzes = Quiz.objects.select_related('teacher').all().order_by('-created_at')
    serializer = QuizListSerializer(quizzes, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['PUT'])
def update_quiz_status(request, quiz_id):
    quiz_status = request.data.get("quiz_status")

    if not quiz_status:
        return Response({"error": "quiz_status is required."}, status=400)

    try:
        quiz = Quiz.objects.get(pk=quiz_id)
        quiz.quiz_status = quiz_status
        quiz.save()
        return Response({"message": "Quiz status updated successfully!"})
    except Quiz.DoesNotExist:
        return Response({"error": "Quiz not found."}, status=404)