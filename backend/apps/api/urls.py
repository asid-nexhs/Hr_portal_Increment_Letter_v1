from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import IncrementLetterViewSet

router = DefaultRouter()
router.register(r'letters', IncrementLetterViewSet)

urlpatterns = [
    path('', include(router.urls)),
]