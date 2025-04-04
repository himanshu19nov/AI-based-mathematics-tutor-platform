# Generated by Django 5.1.7 on 2025-03-30 14:12

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0002_aiquiz_quizquestion_delete_quizsystem_and_more'),
    ]

    operations = [
        migrations.AlterModelTable(
            name='aianalysis',
            table='AI_Analysis',
        ),
        migrations.AlterModelTable(
            name='answer',
            table='Answers',
        ),
        migrations.AlterModelTable(
            name='doubt',
            table='Doubts',
        ),
        migrations.AlterModelTable(
            name='parentstudentmapping',
            table='Parent_Student_Mapping',
        ),
        migrations.AlterModelTable(
            name='question',
            table='Questions',
        ),
        migrations.AlterModelTable(
            name='student',
            table='Students',
        ),
        migrations.AlterModelTable(
            name='studentexam',
            table='Student_Exams',
        ),
        migrations.AlterModelTable(
            name='teacher',
            table='Teachers',
        ),
    ]
