# Generated by Django 5.1.6 on 2025-06-01 22:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_user_plan_paymenttransaction'),
    ]

    operations = [
        migrations.AlterField(
            model_name='proposalinnovation',
            name='status',
            field=models.CharField(choices=[('pending', 'Pendente'), ('canceled', 'Cancelado'), ('rejected', 'Rejeitada'), ('accepted', 'Aceita')], default='pending', max_length=50, verbose_name='Status'),
        ),
    ]
