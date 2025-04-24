# views.py
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import TurfRating, Turf
from .serializers import TurfRatingSerializer
from django.db.models import Avg

class SubmitRatingView(generics.CreateAPIView):
    queryset = TurfRating.objects.all()
    serializer_class = TurfRatingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class TurfAverageRatingView(APIView):
    def get(self, request, turf_id):
        avg_rating = TurfRating.objects.filter(turf_id=turf_id).aggregate(avg=Avg('rating'))['avg']
        return Response({"turf_id": turf_id, "average_rating": round(avg_rating or 0, 2)})

class TurfAllRatingsView(generics.ListAPIView):
    serializer_class = TurfRatingSerializer

    def get_queryset(self):
        turf_id = self.kwargs['turf_id']
        return TurfRating.objects.filter(turf_id=turf_id)
