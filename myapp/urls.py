from django.urls import path
from . import views
from .views import create_question
from .views import create_quiz
from .views import update_question
from .views import delete_question
from .views import ask_ai
from .views import get_all_quizzes
from .views import update_quiz_status


urlpatterns = [
    path('', views.home, name='home'),
    path('user-registration/', views.user_registration, name='user_registration'),
    path('api/user/create/', views.user_signup, name='user_signup'),
    path('api/user/<int:user_id>/update/', views.update_user, name='update_user'),
    path('api/user/<int:user_id>/delete/', views.delete_user, name='delete_user'),
    path('api/login/', views.user_login, name='user_login'),
    path('api/create_question/', create_question, name='create_question'),
    path('api/users/', views.list_all_users, name='list_all_users'),
    path('api/list_questions/', views.list_questions),
    path('api/search_questions/', views.search_questions),
    path('api/create_quiz/', create_quiz, name='create_quiz'),
    path('api/questions/<int:question_id>/', update_question, name='update_question'),
    path('api/questions/<int:question_id>/delete/', delete_question, name='delete_question'),
    path('api/ask', ask_ai, name='ask_ai'),
    path('api/list_quiz/', get_all_quizzes, name='get_all_quiz'),
    path('api/quiz/<int:quiz_id>/status/', update_quiz_status, name='update_quiz_status'),
]