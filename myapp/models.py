from django.contrib.auth.hashers import make_password
from django.db import models




class UserManager(models.Manager):
    def create_user(self, username, email, firstName, lastName, password, role, academicLevel, userStatus):
        """
        Creates and returns a user with an email, username, hashed password, and other details.
        """
        # Combine first_name and last_name to create full_name
        fullName = f"{firstName} {lastName}"

        # Create and return a user with a hashed password
        user = self.model(
            username=username,
            email=email,
            firstName=firstName,
            lastName=lastName,
            fullName=fullName,
            role=role,
            academicLevel=academicLevel,
            userStatus=userStatus
        )
        user.password = make_password(password)  # Hashing the password before saving
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, firstName, lastName, password, role, academicLevel, userStatus):
        """
        Creates and returns a superuser with all the necessary flags set.
        """
        user = self.create_user(
            username=username,
            email=email,
            firstName=firstName,
            lastName=lastName,
            password=password,
            role=role,
            academicLevel=academicLevel,
            userStatus=userStatus
        )
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user



# Users Table
# class User(models.Model):
#     ROLE_CHOICES = [
#         ('Teacher', 'Teacher'),
#         ('Student', 'Student'),
#         ('Parent', 'Parent'),
#     ]

#     user_id = models.AutoField(primary_key=True, db_column='user_id')
#     full_name = models.CharField(max_length=255)
#     email = models.EmailField(unique=True, blank=True, null=True)
#     password_hash = models.CharField(max_length=255)
#     role = models.CharField(max_length=20, choices=ROLE_CHOICES)
#     created_at = models.DateTimeField(auto_now_add=True)

#     class Meta:
#         db_table = "users"

#     def __str__(self):
#         return self.full_name



class User(models.Model):
    username = models.CharField(max_length=100, unique=True)
    email = models.EmailField()
    firstName = models.CharField(max_length=100)
    lastName = models.CharField(max_length=100)
    fullName = models.CharField(max_length=255, blank=True, null=True)  # Add full_name field
    password = models.CharField(max_length=100)
    role = models.CharField(max_length=50)
    academicLevel = models.TextField()  # Use TextField to store the academic levels as a string
    userStatus = models.CharField(max_length=50)

    objects = UserManager()  # Use the custom manager

    class Meta:
        db_table = "user"

    def __str__(self):
        return self.username


# Students Table
# -------------------------
# Students Table
# -------------------------
class Student(models.Model):
    student_id = models.IntegerField(primary_key=True)
    parent_id = models.IntegerField(null=True)
    grade_level = models.CharField(max_length=50)

    class Meta:
        db_table = 'Students'
        managed = False


# -------------------------
# Teachers Table
# -------------------------
class Teacher(models.Model):
    teacher_id = models.IntegerField(primary_key=True)
    subject = models.CharField(max_length=100)
    experience = models.IntegerField()

    class Meta:
        db_table = 'Teachers'
        managed = False


# -------------------------
# Questions Table
# -------------------------
class Question(models.Model):
    question_id = models.AutoField(primary_key=True)
    teacher_id = models.IntegerField()
    category = models.CharField(max_length=50, choices=[
        ('Arithmetic', 'Arithmetic'),
        ('Trigonometry', 'Trigonometry'),
        ('Algebra', 'Algebra'),
        ('Geometry', 'Geometry'),
        ('Calculus', 'Calculus')
    ])
    question_text = models.TextField()
    correct_answer = models.CharField(max_length=255)
    difficulty_level = models.CharField(max_length=10, choices=[
        ('Easy', 'Easy'),
        ('Medium', 'Medium'),
        ('Hard', 'Hard')
    ])
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'Questions'
        managed = False


# -------------------------
# Quiz Table
# -------------------------
class Quiz(models.Model):
    quiz_id = models.AutoField(primary_key=True)
    teacher_id = models.IntegerField()
    quiz_title = models.CharField(max_length=255)
    total_marks = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'quiz'
        managed = False


# -------------------------
# Quiz_Questions Table
# -------------------------
class QuizQuestion(models.Model):
    quiz_id = models.IntegerField()
    question_id = models.IntegerField()

    class Meta:
        db_table = 'Quiz_Questions'
        managed = False
        unique_together = ('quiz_id', 'question_id')


# -------------------------
# Student_Exams Table
# -------------------------
class StudentExam(models.Model):
    student_exam_id = models.AutoField(primary_key=True)
    student_id = models.IntegerField()
    quiz_id = models.IntegerField()
    score = models.IntegerField(default=0)
    taken_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'Student_Exams'
        managed = False


# -------------------------
# Answers Table
# -------------------------
class Answer(models.Model):
    answer_id = models.AutoField(primary_key=True)
    student_exam_id = models.IntegerField()
    question_id = models.IntegerField()
    student_answer = models.CharField(max_length=255)
    is_correct = models.BooleanField(default=False)

    class Meta:
        db_table = 'Answers'
        managed = False


# -------------------------
# AI Analysis Table
# -------------------------
class AIAnalysis(models.Model):
    analysis_id = models.AutoField(primary_key=True)
    student_exam_id = models.IntegerField()
    category = models.CharField(max_length=50, choices=[
        ('Arithmetic', 'Arithmetic'),
        ('Trigonometry', 'Trigonometry'),
        ('Algebra', 'Algebra'),
        ('Geometry', 'Geometry'),
        ('Calculus', 'Calculus')
    ])
    score_percentage = models.FloatField(default=0.0)
    improvement_tips = models.TextField(null=True)

    class Meta:
        db_table = 'AI_Analysis'
        managed = False


# -------------------------
# Parent_Student_Mapping Table
# -------------------------
class ParentStudentMapping(models.Model):
    parent_id = models.IntegerField()
    student_id = models.IntegerField()

    class Meta:
        db_table = 'Parent_Student_Mapping'
        managed = False
        unique_together = ('parent_id', 'student_id')


# -------------------------
# Doubts Table
# -------------------------
class Doubt(models.Model):
    doubt_id = models.AutoField(primary_key=True)
    student_id = models.IntegerField()
    question_text = models.TextField()
    status = models.CharField(max_length=10, default='Pending', choices=[
        ('Pending', 'Pending'),
        ('Answered', 'Answered')
    ])
    ai_response = models.TextField(null=True, blank=True)
    submitted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'Doubts'
        managed = False


# -------------------------
# Quizzes Table (AI Generated)
# -------------------------
class AIQuiz(models.Model):
    quiz_id = models.AutoField(primary_key=True)
    category = models.CharField(max_length=50, choices=[
        ('Arithmetic', 'Arithmetic'),
        ('Trigonometry', 'Trigonometry'),
        ('Algebra', 'Algebra'),
        ('Geometry', 'Geometry'),
        ('Calculus', 'Calculus')
    ])
    difficulty = models.CharField(max_length=10, choices=[
        ('Easy', 'Easy'),
        ('Medium', 'Medium'),
        ('Hard', 'Hard')
    ])
    ai_generated = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'Quizzes'
        managed = False
