from django.urls import path
from .views import BookingCreateView, BookingListView,TurfBookingListView

urlpatterns = [
    path("bookings/", BookingListView.as_view(), name="list_bookings"),
    path("bookings/create/", BookingCreateView.as_view(), name="create_booking"),
    path("bookings/turf/<int:turf_id>/", TurfBookingListView.as_view(), name="turf_bookings"),

]
