from django.shortcuts import render

# Create your views here.

def demopage(request):
    return render(request, 'homepage.html')

def login(request):
    return render(request, 'login.html')

def register(request):
    return render(request,'register.html')

def registerTurf(request):
    return render(request,'registerTurf.html')

def dashboard(request):
    return render(request,'dashboard.html')

def turfDetail(request):
    return render(request,'turfDetail.html')