from rest_framework import serializers
from .models import Turf

class TurfSerializer(serializers.ModelSerializer):
    class Meta:
        model = Turf
        fields = "__all__"
    def create(self, validated_data):
        request = self.context["request"]
        user = request.user
        validated_data["owner"] = user

        # Update user role to "turf_owner"
        if user.role != "turf_owner":
            user.role = "turf_owner"
            user.save()

        return super().create(validated_data)