from django.db import models
from django.utils.translation import gettext_lazy as _
from django.db.models import JSONField
import uuid
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

# Create your models here.

class User(models.Model):
    
    PLAN_CHOICES = [
        ('no_plan', _('No plan')),
        ('esmerald', _('Esmerald')),
        ('sapphire', _('Sapphire')),
        ('ruby', _('Ruby')),
    ]

    created = models.DateTimeField(_('Criado em'), auto_now_add=True)
    modified = models.DateTimeField(_('Alterado em'), auto_now=True)
    first_name = models.CharField(_('Nome'), max_length=255, blank=True, null=True)
    last_name = models.CharField(_('Sobrenome'), max_length=255, blank=True, null=True)
    email = models.EmailField(_('Email'), unique=True, blank=True, null=True)
    profile_picture = models.FileField(_('Foto Upload'), upload_to='profile_pictures/', blank=True, null=True)
    profile_picture_url = models.URLField(_('Foto URL'), max_length=500, blank=True, null=True)
    data_nasc = models.DateField(_('Data Nasc.'), blank=True, null=True)
    categories = models.JSONField(_('Categorias'), default=list, blank=True, null=True)
    plan = models.CharField(_('Plano'), max_length=20, choices=PLAN_CHOICES, default='no_plan')
    balance = models.DecimalField(_('Saldo'), max_digits=10, decimal_places=2, default=0.00)

    class Meta:
        verbose_name = _('Usuario')
        verbose_name_plural = _('Usuarios')
    
    def __str__(self):
        return self.first_name
    
    @property
    def get_profile_picture(self):
        if self.profile_picture and self.profile_picture.name:
            return self.profile_picture.url
        elif self.profile_picture_url:
            return self.profile_picture_url
        return None

    @property
    def get_plan(self):
        return self.plan
    
    @property
    def get_balance(self):
        return float(self.balance)

class Innovation(models.Model):
    created = models.DateTimeField(_('Criado em'), auto_now_add=True)
    modified = models.DateTimeField(_('Alterado em'), auto_now=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owned_innovations')
    partners = models.ManyToManyField(User, blank=True, related_name='partnered_innovations')
    nome = models.CharField(_('Nome'), max_length=255, blank=True, null=True)
    descricao = models.CharField(_('Descrição'), max_length=255, blank=True, null=True)
    investimento_minimo = models.CharField(_('Investimento Mínimo'), max_length=255, blank=True, null=True)
    porcentagem_cedida = models.CharField(_('Porcentagem Cedida'), max_length=255, blank=True, null=True)
    categorias = models.JSONField(_('Categorias'), default=list, blank=True, null=True)
    status = models.CharField(_('Status'), max_length=50, choices=[
        ('active', _('Ativa')),
        ('cancelled', _('Cancelada')),
    ], default='active')

    class Meta:
        verbose_name = _('Ideia')
        verbose_name_plural = _('Ideias')

    def __str__(self):
        return self.nome
    
    def get_all_images(self):
        return [img.imagem.url for img in self.images.all() if img.imagem]


class InnovationImage(models.Model):
    created = models.DateTimeField(_('Criado em'), auto_now_add=True)
    modified = models.DateTimeField(_('Alterado em'), auto_now=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owned_innovationsimages')
    innovation = models.ForeignKey(Innovation, on_delete=models.CASCADE, related_name='images')
    imagem = models.FileField(_('Foto'), upload_to='Innovation/', blank=True, null=True)

    class Meta:
        verbose_name = _('Imagem da Ideia')
        verbose_name_plural = _('Imagens das Ideias')

    def __str__(self):
        return f"Imagem para a ideia: {self.innovation.nome}"
     
class NegotiationRoom(models.Model):
    idRoom = models.UUIDField(_('ID da Sala'), default=uuid.uuid4, editable=False, unique=True)
    created = models.DateTimeField(_('Criado em'), auto_now_add=True)
    modified = models.DateTimeField(_('Alterado em'), auto_now=True)
    participants = models.ManyToManyField('User', related_name='negotiation_rooms', blank=True)
    innovation = models.ForeignKey('Innovation', on_delete=models.CASCADE, related_name='negotiation_rooms')
    status = models.CharField(_('Status'), max_length=50, choices=[
        ('open', _('Aberta')),
        ('closed', _('Fechada')),
        ('in_progress', _('Em Progresso')),
    ], default='open')
    
    class Meta:
        verbose_name = _('Sala de Negociação')
        verbose_name_plural = _('Salas de Negociação')

    def __str__(self):
        return f"Sala de Negociação: {self.idRoom}"
    
    def get_participants(self):
        participants_data = []
        for participant in self.participants.all():
            participants_data.append({
                'id': participant.id,
                'name': f"{participant.first_name} {participant.last_name}".strip(),
                'email': participant.email,
                'profile_picture': participant.get_profile_picture,
            })
        return participants_data
    
    def get_channel_group_name(self):
        return f"negotiation_{self.idRoom}"
    
    def send_message_to_room(self, message_data):
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            self.get_channel_group_name(),
            {
                "type": "negotiation.message",
                "message": message_data
            }
        )

class NegotiationMessage(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created = models.DateTimeField(_('Criado em'), auto_now_add=True)
    modified = models.DateTimeField(_('Alterado em'), auto_now=True)
    sender = models.ForeignKey('User', on_delete=models.CASCADE, related_name='sent_messages')
    receiver = models.ForeignKey('User', on_delete=models.CASCADE, related_name='received_messages')  # Removido null=True, blank=True
    room = models.ForeignKey(NegotiationRoom, on_delete=models.CASCADE, related_name='messages')
    content = models.TextField(_('Conteúdo da Mensagem'))
    is_read = models.BooleanField(_('Lida'), default=False)
    
    class Meta:
        verbose_name = _('Mensagem da Sala de Negociação')
        verbose_name_plural = _('Mensagens das Salas de Negociação')
        ordering = ['created']

    def __str__(self):
        return f"Mensagem de {self.sender.first_name} para {self.receiver.first_name} na sala {self.room.idRoom}"
    
    def save(self, *args, **kwargs):
        is_new = self.pk is None
        super().save(*args, **kwargs)
        

class ProposalInnovation(models.Model):
    created = models.DateTimeField(_('Criado em'), auto_now_add=True)
    modified = models.DateTimeField(_('Alterado em'), auto_now=True)
    investor = models.ForeignKey(User, on_delete=models.CASCADE, related_name="proposalinnovation_investor")
    sponsored = models.ForeignKey(User, on_delete=models.CASCADE, related_name="Proposalinnovation_sponsored")
    innovation = models.ForeignKey(Innovation, on_delete=models.CASCADE, related_name='proposalinnovation_innovation')
    descricao = models.CharField(_('Descrição'), max_length=255, blank=True, null=True)
    investimento_minimo = models.CharField(_('Investimento Mínimo'), max_length=255, blank=True, null=True)
    porcentagem_cedida = models.CharField(_('Porcentagem Cedida'), max_length=255, blank=True, null=True)
    accepted = models.BooleanField('Aceito', default=False)
    paid = models.BooleanField('Pago', default=False)
    status = models.CharField(_('Status'), max_length=50, choices=[
        ('pending', _('Pendente')),
        ('canceled', _('Cancelado')),
        ('rejected', _('Rejeitada')),
        ('accepted', _('Aceita')),
    ], default='pending')    
    
    class Meta:
        verbose_name = _('Proposta de Inovação')
        verbose_name_plural = _('Propostas de Inovação')
        ordering = ['created']

    def __str__(self):
            return f"Proposta de {self.investor.first_name} para {self.innovation.nome}"

class PaymentTransaction(models.Model):
    
    PLAN_PRICES = {
        'esmerald': 29.90,
        'sapphire': 59.90,
        'ruby': 99.90,
    }
    
    STATUS_CHOICES = [
        ('pending', _('Pendente')),
        ('processing', _('Processando')),
        ('succeeded', _('Sucesso')),
        ('failed', _('Falhou')),
        ('cancelled', _('Cancelado')),
        ('requires_action', _('Requer Ação')),
    ]

    created = models.DateTimeField(_('Criado em'), auto_now_add=True)
    modified = models.DateTimeField(_('Alterado em'), auto_now=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='payment_transactions')
    plan = models.CharField(_('Plano'), max_length=20, choices=User.PLAN_CHOICES)
    amount = models.DecimalField(_('Valor'), max_digits=10, decimal_places=2)
    status = models.CharField(_('Status'), max_length=20, choices=STATUS_CHOICES, default='pending')
    stripe_payment_intent_id = models.CharField(_('Stripe Payment Intent ID'), max_length=100, unique=True)
    stripe_client_secret = models.CharField(_('Stripe Client Secret'), max_length=200, blank=True, null=True)
    payment_method_id = models.CharField(_('Payment Method ID'), max_length=100, blank=True, null=True)
    
    class Meta:
        verbose_name = _('Transação de Pagamento')
        verbose_name_plural = _('Transações de Pagamento')
        ordering = ['-created']

    def __str__(self):
        return f"Pagamento {self.plan} - {self.user.first_name} - {self.status}"
    
    @classmethod
    def get_plan_prices(cls):
        return cls.PLAN_PRICES
    
    def get_amount_in_cents(self):
        return int(self.amount * 100)
    
class CreditTransactions(models.Model):
    STATUS_CHOICES = [
        ('pending', _('Pendente')),
        ('processing', _('Processando')),
        ('succeeded', _('Sucesso')),
        ('failed', _('Falhou')),
        ('cancelled', _('Cancelado')),
        ('requires_action', _('Requer Ação')),
    ]
    
    created = models.DateTimeField(_('Criado em'), auto_now_add=True)
    modified = models.DateTimeField(_('Alterado em'), auto_now=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='credit_transactions')
    amount = models.DecimalField(_('Valor'), max_digits=10, decimal_places=2)
    status = models.CharField(_('Status'), max_length=20, choices=STATUS_CHOICES, default='pending')
    stripe_payment_intent_id = models.CharField(_('Stripe Payment Intent ID'), max_length=100, unique=True)
    stripe_client_secret = models.CharField(_('Stripe Client Secret'), max_length=200, blank=True, null=True)
    payment_method_id = models.CharField(_('Payment Method ID'), max_length=100, blank=True, null=True)
    
    class Meta:
        verbose_name = _('Transação de Crédito')
        verbose_name_plural = _('Transações de Crédito')
        ordering = ['-created']

    def __str__(self):
        return f"Crédito R$ {self.amount} - {self.user.first_name} - {self.status}"
    
    def get_amount_in_cents(self):
        return int(self.amount * 100)

class ProposalPayment(models.Model):
    STATUS_CHOICES = [
        ('pending', _('Pendente')),
        ('processing', _('Processando')),
        ('succeeded', _('Sucesso')),
        ('failed', _('Falhou')),
        ('cancelled', _('Cancelado')),
    ]
    
    created = models.DateTimeField(_('Criado em'), auto_now_add=True)
    modified = models.DateTimeField(_('Alterado em'), auto_now=True)
    proposal = models.OneToOneField('ProposalInnovation', on_delete=models.CASCADE, related_name='payment')
    investor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='proposal_payments')
    amount = models.DecimalField(_('Valor do Investimento'), max_digits=15, decimal_places=2)
    status = models.CharField(_('Status'), max_length=20, choices=STATUS_CHOICES, default='pending')
    
    class Meta:
        verbose_name = _('Pagamento de Proposta')
        verbose_name_plural = _('Pagamentos de Propostas')
        ordering = ['-created']

    def __str__(self):
        return f"Pagamento R$ {self.amount} - {self.investor.first_name} - {self.proposal.innovation.nome}"
    
    def get_amount_in_cents(self):
        return int(self.amount * 100)
    
    def process_payment(self):
        if self.status != 'pending':
            return False, "Pagamento já foi processado"
        
        if self.investor.balance < self.amount:
            self.status = 'failed'
            self.save()
            return False, "Saldo insuficiente"
        
        self.investor.balance -= self.amount
        self.investor.save()
        
        self.status = 'succeeded'
        self.save()
        
        self.proposal.paid = True
        self.proposal.save()
        
        return True, "Pagamento processado com sucesso"

