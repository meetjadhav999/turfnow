from rest_framework import serializers
from .models import Booking

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ["id", "user", "turf", "date", "start_time", "end_time", "created_at"]
        read_only_fields = ["user", "end_time", "created_at"]
