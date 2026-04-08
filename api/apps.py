from django.apps import AppConfig


class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'

    def ready(self):
        # Register signal handlers when app is ready
        from django.db.models.signals import post_save
        from django.contrib.auth.models import User
        from rest_framework.authtoken.models import Token
        from django.dispatch import receiver

        @receiver(post_save, sender=User)
        def create_auth_token(sender, instance=None, created=False, **kwargs):
            """Auto-create token when a new user is created"""
            if created:
                Token.objects.get_or_create(user=instance)

