from django.urls import path
from .views import demopage, login, register,registerTurf,dashboard,turfDetail,payment,mybookings

urlpatterns = [
    path('', demopage),
    path('login',login),
    path('signup',register),
    path('register-turf',registerTurf),
    path('dashboard',dashboard),
    path('turfs',turfDetail),
    path('payment',payment),
    path('my-bookings',mybookings)
]
