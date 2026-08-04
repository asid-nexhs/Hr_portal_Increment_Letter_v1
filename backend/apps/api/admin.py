from django.contrib import admin
from .models import IncrementLetter

@admin.register(IncrementLetter)
class IncrementLetterAdmin(admin.ModelAdmin):
    list_display = ['employee_name', 'employee_id', 'employee_type', 'effective_date']
    search_fields = ['employee_name', 'employee_id']