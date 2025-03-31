from django.contrib import admin
from .models import User, Student, Teacher, Question, Quiz, StudentExam, Answer, AIAnalysis, ParentStudentMapping, Doubt

admin.site.register(User)
admin.site.register(Student)
admin.site.register(Teacher)
admin.site.register(Question)
admin.site.register(Quiz)
admin.site.register(StudentExam)
admin.site.register(Answer)
admin.site.register(AIAnalysis)
admin.site.register(ParentStudentMapping)
admin.site.register(Doubt)

