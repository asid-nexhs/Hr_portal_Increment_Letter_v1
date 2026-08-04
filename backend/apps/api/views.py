from django.http import HttpResponse
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import IncrementLetter
from .serializers import IncrementLetterSerializer
from .pdf_utils import generate_increment_pdf
from apps.accounts.permissions import IsAdminUser
import pandas as pd
import io
import logging

logger = logging.getLogger(__name__)

class IncrementLetterViewSet(viewsets.ModelViewSet):
    queryset = IncrementLetter.objects.all().order_by('-created_at')
    serializer_class = IncrementLetterSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]
    
    @action(detail=False, methods=['post'])
    def import_csv(self, request):

        if not request.user.is_admin:
            return Response(
                {'error': 'Only admin users can import data.'},
                status=status.HTTP_403_FORBIDDEN
            )
         
        file = request.FILES.get('file')
        if not file:
            return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            if file.name.endswith('.csv'):
                df = pd.read_csv(io.StringIO(file.read().decode('utf-8')))
            else:
                df = pd.read_excel(file)
            
            created_count = 0
            errors = []
            
            for index, row in df.iterrows():
                try:
                    data = {
                        'employee_type': row.get('employee_type', 'office'),
                        'employee_name': row.get('employee_name'),
                        'employee_id': row.get('employee_id'),
                        'designation': row.get('designation'),
                        'promotion_designation': row.get('promotion_designation', ''),
                        'letter_date': pd.to_datetime(row.get('letter_date')).date(),
                        'effective_date': pd.to_datetime(row.get('effective_date')).date(),
                        'ref_no': row.get('ref_no', ''),
                        
                        # User Input Fields
                        'gross_a_revised_salary': float(row.get('gross_a_revised_salary', 0)),
                        'retention_bonus_annual': float(row.get('retention_bonus_annual', 0)),
                        'telephone_allowance': float(row.get('telephone_allowance', 0)),
                        'pf_employer': float(row.get('pf_employer', 0)),
                        'food_allowance': float(row.get('food_allowance', 0)),
                        'pf_employee': float(row.get('pf_employee', 0)),
                        'professional_tax': float(row.get('professional_tax', 0)),
                        'insurance_premium': float(row.get('insurance_premium', 0)),
                        'meal_card_deduction': float(row.get('meal_card_deduction', 0)),

                        # Variable Pay
                        'variable_pay_fy2026_27': float(row.get('variable_pay_fy2026_27', 0)),
                        'variable_pay_fy2025_26': float(row.get('variable_pay_fy2025_26', 0)),

                        'created_by': request.user.id,
                    }
                    
                    # Save will auto-calculate basic, hra, special, and gratuity
                    serializer = IncrementLetterSerializer(data=data)
                    if serializer.is_valid():
                        serializer.save()
                        created_count += 1
                    else:
                        errors.append(f"Row {index}: {serializer.errors}")
                except Exception as e:
                    errors.append(f"Row {index}: {str(e)}")
                    logger.error(f"Error importing row {index}: {str(e)}")
            
            return Response({
                'message': f'Successfully imported {created_count} records',
                'errors': errors,
                'total_rows': len(df),
                'created_count': created_count
            }, status=status.HTTP_201_CREATED)

        except pd.errors.EmptyDataError:
            return Response(
                {'error': 'File is empty'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        except Exception as e:
            logger.error(f"Import error: {str(e)}")
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['get'], url_path='download_pdf')
    def download_pdf(self, request, pk=None):
        letter = self.get_object()
        pdf_content = generate_increment_pdf(pk)
        if pdf_content:
            response = HttpResponse(pdf_content, content_type='application/pdf')
            response['Content-Disposition'] = f'attachment; filename="Increment_Letter_{letter.employee_id}_{letter.employee_name}.pdf"'
            return response
        return Response({'error': 'PDF generation failed'}, status=500)