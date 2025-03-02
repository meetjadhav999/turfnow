from django.urls import path
from .views import TurfListCreateAPIView,TurfDetailAPIView

urlpatterns = [
    path('turfs/',TurfListCreateAPIView.as_view(),name='turflist'),
    path('turfs/<int:turf_id>/',TurfDetailAPIView.as_view(),name = "turfdetail"),
    
]
