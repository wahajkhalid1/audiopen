from django.urls import path
from .views import home, file_upload
urlpatterns = [
    path('', home, name='home'),
    path("upload/", file_upload, name="record"),
]