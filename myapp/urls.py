from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('user-registration/', views.user_registration, name='user_registration'),
    path('api/user/create/', views.user_signup, name='user_signup'),
    path('api/user/<int:user_id>/update/', views.update_user, name='update_user'),
    path('api/user/<int:user_id>/delete/', views.delete_user, name='delete_user'),
]
