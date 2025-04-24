from rest_framework import serializers
from .models import Booking
from turfs.serializers import TurfSerializer
class BookingSerializer(serializers.ModelSerializer):
    turf = TurfSerializer(read_only = True)
    class Meta:
        model = Booking
        fields = ["id", "user", "turf", "date", "start_time", "end_time", "created_at"]
        read_only_fields = ["user", "end_time", "created_at"]
