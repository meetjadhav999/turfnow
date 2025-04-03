from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('player', 'Player'),
        ('turf_owner', 'Turf Owner'),
        ('admin', 'Admin'),
    )
    phone = models.CharField(max_length=12,default="0")
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='player')

    def __str__(self):
        return self.username