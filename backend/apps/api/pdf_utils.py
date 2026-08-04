from io import BytesIO
from django.template.loader import get_template
from xhtml2pdf import pisa
from .models import IncrementLetter
from django.conf import settings
import os
from decimal import Decimal

def link_callback(uri, rel):
    if uri.startswith(settings.STATIC_URL):
        static_root = (
            settings.STATIC_ROOT
            if settings.STATIC_ROOT
            else settings.STATICFILES_DIRS[0]
        )
        path = os.path.join(
            static_root,
            uri.replace(settings.STATIC_URL, "")
        )
        return path
    return uri

def render_to_pdf(template_src, context):
    template = get_template(template_src)
    html = template.render(context)
    result = BytesIO()
    pisa_status = pisa.CreatePDF(
        html,
        dest=result,
        encoding="UTF-8",
        link_callback=link_callback
    )
    if pisa_status.err:
        return None
    return result.getvalue()

def generate_increment_pdf(letter_id):
    letter = IncrementLetter.objects.get(id=letter_id)
    
    # Convert all numeric fields to float
    gross_a = float(letter.gross_a_revised_salary)
    basic = float(letter.basic_salary)
    hra = float(letter.hra)
    special = float(letter.special_allowance)
    
    # Gross B components
    retention_monthly = float(letter.retention_bonus_annual / 12) if letter.retention_bonus_annual else 0
    retention_annual = float(letter.retention_bonus_annual)
    telephone = float(letter.telephone_allowance)
    pf_employer = float(letter.pf_employer)
    food = float(letter.food_allowance)
    gratuity = float(letter.gratuity_provision)
    
    # Deductions
    pf_employee = float(letter.pf_employee)
    prof_tax = float(letter.professional_tax)
    insurance = float(letter.insurance_premium)
    meal = float(letter.meal_card_deduction)
    
    # Variable Pay
    var2627 = float(letter.variable_pay_fy2026_27)
    var2526 = float(letter.variable_pay_fy2025_26)
    
    # Calculations
    gross_a_monthly = basic + hra + special
    gross_a_annual = gross_a_monthly * 12
    
    gross_b_monthly = retention_monthly + telephone + pf_employer + food + gratuity
    gross_b_annual = gross_b_monthly * 12
    
    deductions_monthly = pf_employee + prof_tax + insurance + meal
    deductions_annual = deductions_monthly * 12
    
    net_pay_monthly = gross_a_monthly - deductions_monthly
    net_pay_annual = net_pay_monthly * 12
    
    total_ctc = gross_a_annual + gross_b_annual
    
    # Annual components
    basic_annual = basic * 12
    hra_annual = hra * 12
    special_annual = special * 12
    telephone_annual = telephone * 12
    pf_employer_annual = pf_employer * 12
    gratuity_annual = gratuity * 12
    food_annual = food * 12
    pf_employee_annual = pf_employee * 12
    prof_tax_annual = prof_tax * 12
    insurance_annual = insurance * 12
    meal_annual = meal * 12
    
    context = {
        'letter': letter,
        
        # Gross A
        'gross_a': gross_a,
        'basic': basic,
        'basic_annual': basic_annual,
        'hra': hra,
        'hra_annual': hra_annual,
        'special': special,
        'special_annual': special_annual,
        'gross_a_monthly': gross_a_monthly,
        'gross_a_annual': gross_a_annual,
        
        # Gross B
        'retention_monthly': retention_monthly,
        'retention_annual': retention_annual,
        'telephone': telephone,
        'telephone_annual': telephone_annual,
        'pf_employer': pf_employer,
        'pf_employer_annual': pf_employer_annual,
        'food': food,
        'food_annual': food_annual,
        'gratuity': gratuity,
        'gratuity_annual': gratuity_annual,
        'gross_b_monthly': gross_b_monthly,
        'gross_b_annual': gross_b_annual,
        
        # Deductions
        'pf_employee': pf_employee,
        'pf_employee_annual': pf_employee_annual,
        'prof_tax': prof_tax,
        'prof_tax_annual': prof_tax_annual,
        'insurance': insurance,
        'insurance_annual': insurance_annual,
        'meal': meal,
        'meal_annual': meal_annual,
        'deductions_monthly': deductions_monthly,
        'deductions_annual': deductions_annual,
        
        # Net Pay
        'net_pay_monthly': net_pay_monthly,
        'net_pay_annual': net_pay_annual,
        
        # Total
        'total_ctc': total_ctc,
        
        # Variable Pay
        'var2627': var2627,
        'var2526': var2526,
    }
    
    return render_to_pdf('increment_letter_pdf.html', context)