from rest_framework import status, permissions, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Booking
from turfs.models import Turf
from .serializers import BookingSerializer

class BookingCreateView(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def post(self, request):
        data = request.data.copy()
        data["user"] = request.user.id  # Assign the logged-in user
        
        serializer = BookingSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Booking successful!", "booking": serializer.data}, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class BookingListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        bookings = Booking.objects.filter(user=request.user).order_by("-date")
        serializer = BookingSerializer(bookings, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class TurfBookingListView(generics.ListAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.AllowAny]  # Change to IsAuthenticated if needed

    def get_queryset(self):
        turf_id = self.kwargs["turf_id"]
        return Booking.objects.filter(turf_id=turf_id).order_by("date", "start_time")

    def get(self, request, *args, **kwargs):
        turf_id = kwargs.get("turf_id")
        if not Turf.objects.filter(id=turf_id).exists():
            return Response({"error": "Turf not found"}, status=status.HTTP_404_NOT_FOUND)

        return super().get(request, *args, **kwargs)
