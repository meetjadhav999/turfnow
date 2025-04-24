from rest_framework import serializers
from .models import TurfRating

class TurfRatingSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()

    class Meta:
        model = TurfRating
        fields = ['id', 'user', 'username', 'turf', 'rating', 'review', 'created_at']
        read_only_fields = ['user', 'created_at']

    def get_username(self, obj):
        return obj.user.username if obj.user else "Anonymous"