from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='quiz',
            name='quiz_level',
            field=models.CharField(default='year_1', max_length=50),
        ),
    ]
