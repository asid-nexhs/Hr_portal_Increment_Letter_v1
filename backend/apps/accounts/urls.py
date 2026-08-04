from django.urls import path
from .views import (
    PublicRegisterView,
    RegisterView,
    CustomTokenObtainPairView,
    ProfileView,
    LogoutView,
    UserListView,
)
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    # Public endpoints
    path('register/', PublicRegisterView.as_view(), name='public-register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Protected endpoints
    path('profile/', ProfileView.as_view(), name='profile'),
    path('logout/', LogoutView.as_view(), name='logout'),
    
    # Admin endpoints
    path('users/', UserListView.as_view(), name='user-list'),
    path('users/create/', RegisterView.as_view(), name='create-user'),
]