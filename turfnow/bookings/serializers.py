from rest_framework import serializers
from .models import Booking

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ["id", "user", "turf", "date", "start_time", "end_time", "created_at"]
        read_only_fields = ["user","start_time", "end_time","turf"]

    def validate(self, data):
        # Ensure start time is in 1-hour increments
        if data["start_time"].minute != 0:
            raise serializers.ValidationError("Bookings must start at the beginning of an hour (e.g., 10:00, 11:00).")

        # Check if the slot is already booked
        if Booking.objects.filter(
            turf=data["turf"], date=data["date"], start_time=data["start_time"]
        ).exists():
            raise serializers.ValidationError("This slot is already booked.")
        
        return data
