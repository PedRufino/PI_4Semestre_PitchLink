"""
Django settings for backend project.

Generated by 'django-admin startproject' using Django 5.1.5.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/5.1/ref/settings/
"""

from dotenv import load_dotenv
from pathlib import Path
import os

load_dotenv()

BASE_URL_WEB = 'http://localhost:4200'

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-#n_3bbk9m6@hawgs88p6&^vx62$p-#50iya77mwk^9+#t$55$v'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'api',
    'corsheaders',

    'django.contrib.sites',
    'allauth',
    'allauth.account',
    'allauth.socialaccount',

    #providers
    'allauth.socialaccount.providers.google',
    'allauth.socialaccount.providers.openid_connect',

]

AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',
    'allauth.account.auth_backends.AuthenticationBackend',
]
CORS_ALLOWED_ORIGINS = [
    "http://localhost:4200",
    "http://127.0.0.1:8000",
    "http://172.18.0.4:4200",
]

CORS_ALLOW_CREDENTIALS = True

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    "allauth.account.middleware.AccountMiddleware",
    'corsheaders.middleware.CorsMiddleware',
    ]

ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.1/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('NAME'),
        'USER': os.getenv('USER'),
        'PASSWORD': os.getenv('PASSWORD'),
        'HOST': os.getenv('HOST'),
        'PORT': os.getenv('PORT'),
    }
}

SITE_ID = 2

# Password validation
# https://docs.djangoproject.com/en/5.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.1/topics/i18n/

LANGUAGE_CODE = 'pt-br'

TIME_ZONE = 'America/Sao_Paulo'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.1/howto/static-files/

STATIC_URL = 'static/'

# Default primary key field type
# https://docs.djangoproject.com/en/5.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# adicional

SOCIALACCOUNT_AUTO_SIGNUP = False
SOCIALACCOUNT_EMAIL_AUTHENTICATION = True
SOCIALACCOUNT_LOGIN_ON_GET = True
SOCIALACCOUNT_AUTO_SIGNUP = True
ACCOUNT_LOGOUT_ON_GET = True
SOCIALACCOUNT_STORE_TOKENS = True

SOCIALACCOUNT_PROVIDERS = {
    'google': {
        'SCOPE': [
            'profile',
            'email',
        ],
        'AUTH_PARAMS': {
            'access_type': 'online',
        },
        'OAUTH_PKCE_ENABLED': True,
        'APP': {
            'client_id': os.getenv('GOOGLE_CLIENT_ID'),
            'secret': os.getenv('GOOGLE_CLIENT_SECRET'),
            'key': ''
        }
    },
    "openid_connect": {
    "APPS": [
        {
            "provider_id": "linkedin-server",
            "name": "LinkedIn OIDC",
            "client_id": os.environ.get("LINKEDIN_CLIENT_ID"),
            "secret": os.environ.get("LINKEDIN_CLIENT_SECRET"),
            "settings": {
                "issuer": "https://www.linkedin.com",
                "server_url": "https://www.linkedin.com/oauth",
                "authorization_endpoint": "https://www.linkedin.com/oauth/v2/authorization",
                "token_endpoint": "https://www.linkedin.com/oauth/v2/accessToken",
                "userinfo_endpoint": "https://api.linkedin.com/v2/userinfo",
                "jwks_uri": "https://www.linkedin.com/oauth/openid/jwks",
            },
            'SCOPE': ['openid', 'profile', 'email'],  
        }
    ]
},
}

LOGOUT_REDIRECT_URL = BASE_URL_WEB