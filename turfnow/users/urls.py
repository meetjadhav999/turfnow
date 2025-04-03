from django.urls import path
from .views import RegisterView,LoginView,LogoutView,UpdateUserView,GetUserView

urlpatterns = [
    path('user',GetUserView.as_view(),name="user"),
    path('register',RegisterView.as_view(),name='register'),
    path('login',LoginView.as_view(),name = "login"),
    path('logout',LogoutView.as_view(),name = "logout"),
    path('update',UpdateUserView.as_view(),name="update")
]
