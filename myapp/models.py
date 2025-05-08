from django.contrib.auth.hashers import make_password
from django.db import models


class UserManager(models.Manager):
    def create_user(self, username, email, firstName, lastName, password, role, academicLevel, userStatus):
        fullName = f"{firstName} {lastName}"
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
        user.password = make_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, firstName, lastName, password, role, academicLevel, userStatus):
        user = self.create_user(username, email, firstName, lastName, password, role, academicLevel, userStatus)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


class User(models.Model):
    ROLE_CHOICES = [
        ('parent', 'Parent'),
        ('student', 'Student'),
        ('teacher', 'Teacher'),
    ]

    username = models.CharField(max_length=100, unique=True)
    email = models.EmailField()
    firstName = models.CharField(max_length=100)
    lastName = models.CharField(max_length=100)
    fullName = models.CharField(max_length=255, blank=True, null=True)
    password = models.CharField(max_length=100)
    role = models.CharField(max_length=50, choices=ROLE_CHOICES)
    academicLevel = models.TextField()
    userStatus = models.CharField(max_length=50)

    objects = UserManager()

    class Meta:
        db_table = "user"

    def __str__(self):
        return f"{self.username} ({self.role})"


class Question(models.Model):
    question_id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=50)
    category = models.CharField(max_length=50, choices=[
        ('Arithmetic', 'Arithmetic'),
        ('Trigonometry', 'Trigonometry'),
        ('Algebra', 'Algebra'),
        ('Geometry', 'Geometry'),
        ('Calculus', 'Calculus')
    ])
    question_text = models.TextField()
    ansType = models.TextField()
    answers = models.TextField()
    correct_answer = models.CharField(max_length=255)
    difficulty_level = models.CharField(max_length=13, choices=[
        ('kindergartens', 'kindergartens'),
        ('year_1', 'year_1'),
        ('year_2', 'year_2'),
        ('year_3', 'year_3'),
        ('year_4', 'year_4'),
        ('year_5', 'year_5'),
        ('year_6', 'year_6'),
        ('year_7', 'year_7'),
        ('year_8', 'year_8'),
        ('year_9', 'year_9'),
        ('year_10', 'year_10'),
        ('year_11', 'year_11'),
        ('year_12', 'year_12')
    ])
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'questions'
        managed = True


class Quiz(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('archived', 'Archived'),
    ]

    quiz_id = models.AutoField(primary_key=True)
    teacher = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, limit_choices_to={'role': 'teacher'})
    quiz_title = models.CharField(max_length=255)
    quiz_level = models.CharField(max_length=50, default='year_1')
    total_marks = models.IntegerField()
    quiz_status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')  
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'quiz'


class QuizQuestion(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, null=True, blank=True)
    question = models.ForeignKey(Question, on_delete=models.CASCADE, null=True, blank=True)
    score = models.IntegerField(default=1) 

    class Meta:
        db_table = 'quiz_questions'
        unique_together = ('quiz', 'question')


class StudentExam(models.Model):
    student_exam_id = models.AutoField(primary_key=True)
    student = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, limit_choices_to={'role': 'student'})
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, null=True, blank=True)
    score = models.IntegerField(default=0)
    taken_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'Student_Exams'



class Answer(models.Model):
    answer_id = models.AutoField(primary_key=True)
    student_exam = models.ForeignKey(StudentExam, on_delete=models.CASCADE, null=True, blank=True)
    question = models.ForeignKey(Question, on_delete=models.CASCADE, null=True, blank=True)
    student_answer = models.CharField(max_length=255)
    is_correct = models.BooleanField(default=False)

    # ✅ Add these two fields:
    student_mark = models.IntegerField(null=True, blank=True)
    teacher_comment = models.TextField(null=True, blank=True)

    class Meta:
        db_table = 'Answers'



class AIAnalysis(models.Model):
    analysis_id = models.AutoField(primary_key=True)
    student_exam = models.ForeignKey(StudentExam, on_delete=models.CASCADE, null=True, blank=True)
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


class ParentStudentMapping(models.Model):
    parent = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='parent_links', limit_choices_to={'role': 'parent'})
    student = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='student_links', limit_choices_to={'role': 'student'})

    class Meta:
        db_table = 'Parent_Student_Mapping'
        unique_together = ('parent', 'student')


class Doubt(models.Model):
    doubt_id = models.AutoField(primary_key=True)
    student = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, limit_choices_to={'role': 'student'})
    question_text = models.TextField()
    status = models.CharField(max_length=10, default='Pending', choices=[
        ('Pending', 'Pending'),
        ('Answered', 'Answered')
    ])
    ai_response = models.TextField(null=True, blank=True)
    submitted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'Doubts'


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

from django.contrib.postgres.fields import ArrayField

class KnowledgeBase(models.Model):
    category = models.CharField(max_length=100, blank=True, null=True)
    title = models.TextField()
    content = models.TextField()
    embedding = ArrayField(models.FloatField(), blank=True, null=True) # 768-dim vector
    created_at = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
    
    class Meta:
        db_table = 'knowledge_base'

