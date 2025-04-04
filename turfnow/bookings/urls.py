from django.urls import path
from .views import CreateBookingAPI, BookingListView,TurfBookingByDateView

urlpatterns = [
    path("list", BookingListView.as_view(), name="list_bookings"),
    path("create", CreateBookingAPI.as_view(), name="create_booking"),
    path("turf/<int:turf_id>", TurfBookingByDateView.as_view(), name="turf_bookings"),

]
