from django.shortcuts import render

# Create your views here.

def demopage(request):
    return render(request, 'demopage.html')

def login(request):
    return render(request, 'login.html')