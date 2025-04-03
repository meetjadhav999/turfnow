from django.urls import path
from .views import demopage, login, register,registerTurf,dashboard,turfDetail

urlpatterns = [
    path('', demopage),
    path('login',login),
    path('signup',register),
    path('register-turf',registerTurf),
    path('dashboard',dashboard),
    path('turfs',turfDetail)
]
