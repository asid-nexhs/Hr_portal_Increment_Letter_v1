from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from apps.accounts.models import Role

User = get_user_model()

class Command(BaseCommand):
    help = 'Create initial admin user'

    def handle(self, *args, **options):
        # Create admin role if it doesn't exist
        admin_role, created = Role.objects.get_or_create(name='admin')
        
        if created:
            self.stdout.write(self.style.SUCCESS('Admin role created successfully'))
        
        # Check if admin user exists
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser(
                email='admin@example.com',
                username='admin',
                password='admin123',
                first_name='Admin',
                last_name='User',
                role=admin_role
            )
            self.stdout.write(self.style.SUCCESS('Admin user created successfully'))
            self.stdout.write('Email: admin@example.com')
            self.stdout.write('Password: admin123')
        else:
            self.stdout.write(self.style.WARNING('Admin user already exists'))