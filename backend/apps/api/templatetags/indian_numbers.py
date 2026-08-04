# api/templatetags/indian_numbers.py
from django import template
from decimal import Decimal

register = template.Library()

def indian_number_format(num):
    """
    Convert number to Indian number format (e.g., 100000 -> 1,00,000)
    """
    if num is None:
        return "0"
    
    try:
        if isinstance(num, (int, float, Decimal)):
            num = float(num)
        else:
            num = float(str(num).replace(',', ''))
    except (ValueError, TypeError):
        return str(num)
    
    # Handle negative numbers
    sign = ''
    if num < 0:
        sign = '-'
        num = abs(num)
    
    # Split into integer and decimal parts
    num_str = f"{num:.2f}"
    if '.' in num_str:
        integer_part, decimal_part = num_str.split('.')
    else:
        integer_part, decimal_part = num_str, '00'
    
    # Format integer part in Indian style
    if len(integer_part) <= 3:
        formatted_integer = integer_part
    else:
        last_three = integer_part[-3:]
        remaining = integer_part[:-3]
        remaining_formatted = ''
        for i, digit in enumerate(reversed(remaining)):
            if i > 0 and i % 2 == 0:
                remaining_formatted = ',' + remaining_formatted
            remaining_formatted = digit + remaining_formatted
        formatted_integer = remaining_formatted + ',' + last_three
    
    return f"{sign}{formatted_integer}.{decimal_part}"

@register.filter
def indian_number(value):
    return indian_number_format(value)