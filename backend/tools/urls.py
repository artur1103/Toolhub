from django.urls import path
from .views import HashGenerator

urlpatterns = [
    path('hash/', HashGenerator.as_view(), name='hash-generator'),
]
