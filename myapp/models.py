from django.db import models

# Users Table
class User(models.Model):
    ROLE_CHOICES = [
        ('Teacher', 'Teacher'),
        ('Student', 'Student'),
        ('Parent', 'Parent'),
    ]

    user_id = models.AutoField(primary_key=True, db_column='user_id')
    full_name = models.CharField(max_length=255)
    email = models.EmailField(unique=True, blank=True, null=True)
    password_hash = models.CharField(max_length=255)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "users"

    def __str__(self):
        return self.full_name


# Students Table
class Student(models.Model):
    student = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True, related_name="student_profile")
    parent = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name="children")
    grade_level = models.CharField(max_length=50)

    class Meta:
        db_table = "students"

    def __str__(self):
        return f"{self.student.full_name if self.student else 'Unknown'} - {self.grade_level}"


# Teachers Table
class Teacher(models.Model):
    teacher = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    subject = models.CharField(max_length=100)
    experience = models.IntegerField()

    class Meta:
        db_table = "teachers"

    def __str__(self):
        return f"{self.teacher.full_name} - {self.subject}"


# Questions Table
class Question(models.Model):
    CATEGORY_CHOICES = [
        ('Arithmetic', 'Arithmetic'),
        ('Trigonometry', 'Trigonometry'),
        ('Algebra', 'Algebra'),
        ('Geometry', 'Geometry'),
        ('Calculus', 'Calculus'),
    ]

    DIFFICULTY_CHOICES = [
        ('Easy', 'Easy'),
        ('Medium', 'Medium'),
        ('Hard', 'Hard'),
    ]
    question_id = models.AutoField(primary_key=True, db_column='question_id')
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    question_text = models.TextField()
    correct_answer = models.CharField(max_length=255)
    difficulty_level = models.CharField(max_length=10, choices=DIFFICULTY_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "questions"

    def __str__(self):
        return f"{self.category} - {self.difficulty_level}"


# Quiz Table
class Quiz(models.Model):
    quiz_id = models.AutoField(primary_key=True, db_column='quiz_id')
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE)
    quiz_title = models.CharField(max_length=255)
    total_marks = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "quiz"

    def __str__(self):
        return self.quiz_title


# Quiz_Questions Table (Mapping Table)



# Student_Exams Table
class StudentExam(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    score = models.IntegerField(default=0)
    taken_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "student_exams"

    def __str__(self):
        return f"{self.student.student.full_name if self.student else 'Unknown'} - {self.quiz.quiz_title}"


# Answers Table
class Answer(models.Model):
    student_exam = models.ForeignKey(StudentExam, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    student_answer = models.CharField(max_length=255)
    is_correct = models.BooleanField(default=False)

    class Meta:
        db_table = "answers"

    def __str__(self):
        return f"{self.student_exam.student.student.full_name if self.student_exam.student else 'Unknown'} - {self.question.category}"


# AI_Analysis Table
class AIAnalysis(models.Model):
    CATEGORY_CHOICES = [
        ('Arithmetic', 'Arithmetic'),
        ('Trigonometry', 'Trigonometry'),
        ('Algebra', 'Algebra'),
        ('Geometry', 'Geometry'),
        ('Calculus', 'Calculus'),
    ]

    student_exam = models.ForeignKey(StudentExam, on_delete=models.CASCADE)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    score_percentage = models.FloatField(default=0.0)
    improvement_tips = models.TextField()

    class Meta:
        db_table = "ai_analysis"

    def __str__(self):
        return f"{self.student_exam.student.student.full_name if self.student_exam.student else 'Unknown'} - {self.category}"


# Parent_Student_Mapping Table
class ParentStudentMapping(models.Model):
    parent = models.ForeignKey(User, on_delete=models.CASCADE, related_name="student_children")
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="parent_mappings")

    class Meta:
        db_table = "parent_student_mapping"
        unique_together = ('parent', 'student')

    def __str__(self):
        return f"{self.parent.full_name} - {self.student.student.full_name if self.student else 'Unknown'}"


# Doubts Table
class Doubt(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Answered', 'Answered'),
    ]

    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    question_text = models.TextField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='Pending')
    ai_response = models.TextField(null=True, blank=True)
    submitted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "doubts"

    def __str__(self):
        return f"{self.student.student.full_name if self.student else 'Unknown'} - {self.status}"


# Quiz System Table
class QuizSystem(models.Model):
    CATEGORY_CHOICES = [
        ('Arithmetic', 'Arithmetic'),
        ('Trigonometry', 'Trigonometry'),
        ('Algebra', 'Algebra'),
        ('Geometry', 'Geometry'),
        ('Calculus', 'Calculus'),
    ]

    DIFFICULTY_CHOICES = [
        ('Easy', 'Easy'),
        ('Medium', 'Medium'),
        ('Hard', 'Hard'),
    ]

    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    difficulty = models.CharField(max_length=10, choices=DIFFICULTY_CHOICES)
    ai_generated = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "quiz_system"

    def __str__(self):
        return f"{self.category} - {self.difficulty}"
