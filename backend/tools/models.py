from django.db import models
from django.utils import timezone
from django.contrib.auth import get_user_model
import json

User = get_user_model()

class ToolLog(models.Model):
    user = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL)
    ip_address = models.CharField(max_length=100, null=True, blank=True)

    endpoint = models.CharField(max_length=255)
    tool_name = models.CharField(max_length=255, null=True, blank=True)

    request_body = models.TextField(null=True, blank=True)
    response_body = models.TextField(null=True, blank=True)

    status_code = models.IntegerField(default=200)

    created_at = models.DateTimeField(default=timezone.now)
    deleted_at = models.DateTimeField(null=True, blank=True)

    def soft_delete(self):
        self.deleted_at = timezone.now()
        self.save()

    def __str__(self):
        return f"{self.endpoint} by {self.user} at {self.created_at}"
