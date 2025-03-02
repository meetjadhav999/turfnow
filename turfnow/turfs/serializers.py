from rest_framework import serializers
from .models import Turf

class TurfSerializer(serializers.ModelSerializer):
    class Meta:
        model = Turf
        fields = "__all__"
