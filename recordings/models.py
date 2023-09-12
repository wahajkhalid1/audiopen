from django.db import models
from django.urls.base import reverse


class Record(models.Model):
    voice_record = models.FileField(upload_to="records")

    class Meta:
        verbose_name = "Record"
        verbose_name_plural = "Records"

    def __str__(self):
        return str(self.id)

    def get_absolute_url(self):
        return reverse("record_detail", kwargs={"id": str(self.id)})