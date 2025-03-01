from django.urls import path
from .views import demopage, login

urlpatterns = [
    path('', demopage),
    path('login',login)
]
