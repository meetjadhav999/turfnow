from django.db import models
from django.conf import settings
from datetime import timedelta,datetime,date

class Booking(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="bookings")
    turf = models.ForeignKey("Turf", on_delete=models.CASCADE, related_name="bookings")
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("turf", "date", "start_time")  # Ensure no duplicate bookings

    def save(self, *args, **kwargs):
        self.end_time = (datetime.combine(date.min, self.start_time) + timedelta(hours=1)).time()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.username} booked {self.turf.name} on {self.date} from {self.start_time} to {self.end_time}"
