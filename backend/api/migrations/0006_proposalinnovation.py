# Generated by Django 5.1.6 on 2025-05-18 00:12

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_negotiationmessage_receiver'),
    ]

    operations = [
        migrations.CreateModel(
            name='ProposalInnovation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True, verbose_name='Criado em')),
                ('modified', models.DateTimeField(auto_now=True, verbose_name='Alterado em')),
                ('descricao', models.CharField(blank=True, max_length=255, null=True, verbose_name='Descrição')),
                ('investimento_minimo', models.CharField(blank=True, max_length=255, null=True, verbose_name='Investimento Mínimo')),
                ('porcentagem_cedida', models.CharField(blank=True, max_length=255, null=True, verbose_name='Porcentagem Cedida')),
                ('accepted', models.BooleanField(default=False, verbose_name='Aceito')),
                ('status', models.CharField(choices=[('pending', 'Pendente'), ('accepted', 'Aceita'), ('rejected', 'Rejeitada'), ('negotiating', 'Em negociação')], default='pending', max_length=50, verbose_name='Status')),
                ('innovation', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='proposalinnovation_innovation', to='api.innovation')),
                ('investor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='proposalinnovation_investor', to='api.user')),
                ('sponsored', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='Proposalinnovation_sponsored', to='api.user')),
            ],
            options={
                'verbose_name': 'Proposta de Inovação',
                'verbose_name_plural': 'Propostas de Inovação',
                'ordering': ['created'],
            },
        ),
    ]
