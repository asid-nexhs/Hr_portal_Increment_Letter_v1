from django.db import models
from datetime import datetime
from decimal import Decimal
from django.core.exceptions import ValidationError

class IncrementLetter(models.Model):
    EMPLOYEE_TYPES = [
        ('office', 'Office Staff'),
        ('site', 'Site Employee'),
    ]
    
    employee_type = models.CharField(max_length=10, choices=EMPLOYEE_TYPES, default='office')
    employee_name = models.CharField(max_length=200)
    employee_id = models.CharField(max_length=50)
    designation = models.CharField(max_length=200)
    promotion_designation = models.CharField(max_length=200, blank=True)
    letter_date = models.DateField()
    effective_date = models.DateField()
    ref_no = models.CharField(max_length=100, blank=True, unique=True)
    
    # User Input Fields
    gross_a_revised_salary = models.DecimalField(max_digits=12, decimal_places=2, default=0, help_text="Gross A / Revised Salary")
    
    # These are auto-calculated from gross_a_revised_salary
    basic_salary = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    hra = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    special_allowance = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    
    # User Input Fields for Gross B
    retention_bonus_annual = models.DecimalField(max_digits=12, decimal_places=2, default=0, help_text="Retention Bonus (Annual)")
    telephone_allowance = models.DecimalField(max_digits=12, decimal_places=2, default=0, help_text="Telephone Allowance (Monthly)")
    pf_employer = models.DecimalField(max_digits=12, decimal_places=2, default=0, help_text="Provident Fund Employer (Monthly)")
    food_allowance = models.DecimalField(max_digits=12, decimal_places=2, default=0, help_text="Food Allowance (Monthly)")
    
    # User Input Fields for Deductions
    pf_employee = models.DecimalField(max_digits=12, decimal_places=2, default=0, help_text="Provident Fund Employee (Monthly)")
    professional_tax = models.DecimalField(max_digits=12, decimal_places=2, default=0, help_text="Professional Tax (Monthly)")
    insurance_premium = models.DecimalField(max_digits=12, decimal_places=2, default=0, help_text="Insurance Premium (Monthly)")
    meal_card_deduction = models.DecimalField(max_digits=12, decimal_places=2, default=0, help_text="Meal Card Deduction (Monthly)")
    
    # Other fields
    variable_pay_fy2026_27 = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    variable_pay_fy2025_26 = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    created_by = models.ForeignKey(
        'accounts.CustomUser',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='increment_letters'
    )
    
    class Meta:
        ordering = ['-created_at']
    
    def generate_ref_no(self):
        """Generate reference number in format: NEXHS/HRD/YYYY/XXXX"""
        year = datetime.now().year
        
        # Get the latest letter for the current year
        latest = IncrementLetter.objects.filter(
            ref_no__startswith=f'NEXHS/HRD/{year}/'
        ).order_by('-ref_no').first()
        
        if latest:
            # Extract the number from the last reference
            last_number = int(latest.ref_no.split('/')[-1])
            new_number = last_number + 1
        else:
            new_number = 1
        
        # Format with leading zeros (4 digits)
        return f'NEXHS/HRD/{year}/{new_number:04d}'

    def clean(self):
        if self.gross_a_revised_salary <= 0:
            raise ValidationError('Gross A Revised Salary must be greater than 0')
        if self.effective_date < self.letter_date:
            raise ValidationError('Effective date must be after letter date')
    
    def save(self, *args, **kwargs):
        self.full_clean()
        # Auto-calculate Basic, HRA, Special Allowance from Gross A
        if self.gross_a_revised_salary:
            # Use Decimal for precise calculations
            gross_a = Decimal(str(self.gross_a_revised_salary))
            self.basic_salary = gross_a * Decimal('0.4')  # 40% of Gross A
            self.hra = self.basic_salary / Decimal('2')  # 50% of Basic
            self.special_allowance = self.basic_salary  # Equal to Basic
        
        # Auto-generate reference number if not provided
        if not self.ref_no:
            self.ref_no = self.generate_ref_no()
        
        super().save(*args, **kwargs)
    
    @property
    def gratuity_provision(self):
        """Gratuity = (Basic * 15/26) / 12 (monthly)"""
        if self.basic_salary:
            basic = Decimal(str(self.basic_salary))
            return (basic * Decimal('15') / Decimal('26')) / Decimal('12')
        return Decimal('0')
    
    @property
    def gross_a_monthly(self):
        """Gross A = Basic + HRA + Special Allowance"""
        return self.basic_salary + self.hra + self.special_allowance
    
    @property
    def gross_a_annual(self):
        return self.gross_a_monthly * Decimal('12')
    
    @property
    def gross_b_monthly(self):
        """Gross B = Retention Bonus + Telephone + PF Employer + Food + Gratuity"""
        return (self.retention_bonus_annual / Decimal('12')) + self.telephone_allowance + self.pf_employer + self.food_allowance + self.gratuity_provision
    
    @property
    def gross_b_annual(self):
        return self.gross_b_monthly * Decimal('12')
    
    @property
    def total_deductions_monthly(self):
        """Deductions C = PF Employee + Professional Tax + Insurance + Meal Card"""
        return self.pf_employee + self.professional_tax + self.insurance_premium + self.meal_card_deduction
    
    @property
    def total_deductions_annual(self):
        return self.total_deductions_monthly * Decimal('12')
    
    @property
    def net_pay_monthly(self):
        """Net Pay = Gross A - Deductions C"""
        return self.gross_a_monthly - self.total_deductions_monthly
    
    @property
    def net_pay_annual(self):
        return self.net_pay_monthly * Decimal('12')
    
    @property
    def total_ctc(self):
        """Total CTC = Gross A + Gross B (Annual)"""
        return self.gross_a_annual + self.gross_b_annual
    
    def __str__(self):
        return f"{self.employee_name} - {self.employee_id}"