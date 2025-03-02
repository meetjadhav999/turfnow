from django.db import models
from django.conf import settings

class Turf(models.Model):
    SPORTS_CHOICES = [
        ("football", "Football"),
        ("cricket", "Cricket"),
        ("badminton", "Badminton"),
        ("tennis", "Tennis"),
        ("basketball", "Basketball"),
    ]

    name = models.CharField(max_length=255, unique=True)
    location = models.CharField(max_length=255)
    sport_type = models.CharField(max_length=20, choices=SPORTS_CHOICES)
    price_per_hour = models.DecimalField(max_digits=10, decimal_places=2)
    rating = models.FloatField(default=0.0)
    image = models.ImageField(upload_to="turfs/", blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="turfs")

    def __str__(self):
        return f"{self.name} - {self.location} ({self.sport_type})"
