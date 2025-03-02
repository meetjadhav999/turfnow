from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django.shortcuts import get_object_or_404
from .models import Turf
from .serializers import TurfSerializer

class TurfListCreateAPIView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request):
        turfs = Turf.objects.all()
    
        sport_type = request.GET.get("sport_type")
        location = request.GET.get("location")
        
        if sport_type:
            turfs = turfs.filter(sport_type=sport_type)
        if location:
            turfs = turfs.filter(location__icontains=location)

        serializer = TurfSerializer(turfs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = TurfSerializer(data=request.data)
        if serializer.is_valid():
            user = self.request.user
            serializer.save(owner=user)

            if user.role != "turf_owner":
                user.role = "turf_owner"
                user.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TurfDetailAPIView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_object(self, turf_id):
        return get_object_or_404(Turf, id=turf_id)

    def get(self, request, turf_id):
        turf = self.get_object(turf_id)
        serializer = TurfSerializer(turf)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, turf_id):
        turf = self.get_object(turf_id)
        if request.user != turf.owner:
            return Response({"error": "You can only edit your own turfs"}, status=status.HTTP_403_FORBIDDEN)

        serializer = TurfSerializer(turf, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, turf_id):
        turf = self.get_object(turf_id)
        if request.user != turf.owner:
            return Response({"error": "You can only delete your own turfs"}, status=status.HTTP_403_FORBIDDEN)

        turf.delete()
        return Response({"message": "Turf deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
