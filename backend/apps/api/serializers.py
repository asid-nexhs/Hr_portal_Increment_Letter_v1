from rest_framework import serializers
from .models import IncrementLetter

class IncrementLetterSerializer(serializers.ModelSerializer):
    # Read-only fields that are auto-calculated
    basic_salary = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    hra = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    special_allowance = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    gratuity_provision = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    gross_a_monthly = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    gross_a_annual = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    gross_b_monthly = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    gross_b_annual = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    total_deductions_monthly = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    total_deductions_annual = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    net_pay_monthly = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    net_pay_annual = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    total_ctc = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    
    class Meta:
        model = IncrementLetter
        fields = '__all__'
        read_only_fields = [
            'ref_no',  # Auto-generated
            'basic_salary', 
            'hra', 
            'special_allowance', 
            'gratuity_provision',
            'gross_a_monthly', 
            'gross_a_annual', 
            'gross_b_monthly', 
            'gross_b_annual',
            'total_deductions_monthly', 
            'total_deductions_annual',
            'net_pay_monthly', 
            'net_pay_annual', 
            'total_ctc',
            'created_at',
            'updated_at'
        ]