# models.py
from django.db import models
from django.conf import settings
from turfs.models import Turf

class TurfRating(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    turf = models.ForeignKey(Turf, on_delete=models.CASCADE, related_name='ratings')
    rating = models.PositiveSmallIntegerField()  # Rating from 1 to 5
    review = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'turf')  # One rating per user per turf

    def __str__(self):
        return f"{self.user.username} rated {self.turf.name} ({self.rating})"
