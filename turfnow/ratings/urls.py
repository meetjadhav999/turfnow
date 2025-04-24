# urls.py
from django.urls import path
from .views import SubmitRatingView, TurfAverageRatingView, TurfAllRatingsView

urlpatterns = [
    path('', SubmitRatingView.as_view(), name='submit-rating'),
    path('<int:turf_id>/average/', TurfAverageRatingView.as_view(), name='average-rating'),
    path('<int:turf_id>/', TurfAllRatingsView.as_view(), name='all-ratings'),
]
