from rest_framework import status, permissions, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Booking
from turfs.models import Turf
from .serializers import BookingSerializer
from datetime import datetime, timedelta
from rest_framework.permissions import IsAuthenticated


class CreateBookingAPI(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Extract data from request
        turf_id = request.data.get("turf")
        date_str = request.data.get("date")
        start_time_str = request.data.get("start_time")

        # Validate required fields
        if not turf_id or not date_str or not start_time_str:
            return Response({"error": "Turf, date, and start_time are required."},
                            status=status.HTTP_400_BAD_REQUEST)

        # Convert date string to a date object
        try:
            date_obj = datetime.strptime(date_str, "%Y-%m-%d").date()
        except ValueError:
            return Response({"error": "Invalid date format. Use YYYY-MM-DD."},
                            status=status.HTTP_400_BAD_REQUEST)

        # Convert start time string to a time object.
        # Try 12-hour format first, then fallback to 24-hour format.
        try:
            start_time_obj = datetime.strptime(start_time_str, "%I %p").time()
        except ValueError:
            try:
                start_time_obj = datetime.strptime(start_time_str, "%H:%M").time()
            except ValueError:
                return Response({"error": "Invalid start_time format. Use HH:MM (24-hour) or h AM/PM."},
                                status=status.HTTP_400_BAD_REQUEST)

        # Calculate end_time as start_time + 1 hour
        start_datetime = datetime.combine(date_obj, start_time_obj)
        end_datetime = start_datetime + timedelta(hours=1)
        end_time_obj = end_datetime.time()

        # Check if the turf exists
        try:
            turf = Turf.objects.get(id=turf_id)
        except Turf.DoesNotExist:
            return Response({"error": "Turf not found."}, status=status.HTTP_404_NOT_FOUND)

        # Ensure the slot is not already booked
        if Booking.objects.filter(turf=turf, date=date_obj, start_time=start_time_obj).exists():
            return Response({"error": "This time slot is already booked."},
                            status=status.HTTP_400_BAD_REQUEST)

        # Create the booking
        booking = Booking.objects.create(
            user=request.user,
            turf=turf,
            date=date_obj,
            start_time=start_time_obj,
            end_time=end_time_obj
        )

        serializer = BookingSerializer(booking)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
class BookingListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        bookings = Booking.objects.filter(user=request.user).order_by("-date")
        serializer = BookingSerializer(bookings, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class TurfBookingByDateView(generics.ListAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.AllowAny]  # Change to IsAuthenticated if needed

    def get_queryset(self):
        turf_id = self.kwargs["turf_id"]
        date_param = self.request.query_params.get("date")

        # Validate date format
        try:
            date_obj = datetime.strptime(date_param, "%Y-%m-%d").date()
        except (ValueError, TypeError):
            return Booking.objects.none()

        return Booking.objects.filter(turf_id=turf_id, date=date_obj).order_by("start_time")

    def get(self, request, *args, **kwargs):
        turf_id = kwargs.get("turf_id")
        date_param = request.query_params.get("date")

        # Check if turf exists
        if not Turf.objects.filter(id=turf_id).exists():
            return Response({"error": "Turf not found"}, status=status.HTTP_404_NOT_FOUND)

        # Validate date
        if not date_param:
            return Response({"error": "Date query parameter is required (YYYY-MM-DD)"}, status=status.HTTP_400_BAD_REQUEST)

        return super().get(request, *args, **kwargs)