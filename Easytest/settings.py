"""
Django settings for Easytest project.

Generated by 'django-admin startproject' using Django 3.0.5.

For more information on this file, see
https://docs.djangoproject.com/en/3.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/3.0/ref/settings/
"""
import os
# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
print(BASE_DIR)


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'lzeg!%=5+l$b!xqm!zmmk$s=z)a$^p@o&f-ndejtycvo=-s-v-'

# SECURITY WARNING: don't run with debug turned on in production!
# Django设置DEBUG为False时，'django.contrib.staticfiles'会关闭，即Django不会自动搜索静态文件
DEBUG = False

ALLOWED_HOSTS = ["*"]


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'easy.apps.EasyConfig',
    #'django_apscheduler',
    'dwebsocket',
    # "drf_yasg",
]

# REST全局配置
REST_FRAMEWORK = {
    # JSONRenderer：以JSON的格式返回、BaseRenderer：数据嵌套到HTML中展示
    "DEFAULT_RENDERER_CLASSES": ["rest_framework.renderers.JSONRenderer"],
    # 全局版本控制
    "DEFAULT_VERSIONING_CLASS": "rest_framework.versioning.URLPathVersioning",
    "ALLOWED_VERSIONS": ["v1", "v2"],  # 允许的版本
    "VERSION_PARAM": "version",  # 版本默认传参
    "DEFAULT_VERSION": "v1",  # 默认版本号为V1,当没有传版本号时
}


MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    # 'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'Easytest.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'easy/templates')],
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

WSGI_APPLICATION = 'Easytest.wsgi.application'


# Database
# https://docs.djangoproject.com/en/3.0/ref/settings/#databases
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'EasyTest',
        'USER': 'root',
        'PASSWORD': '123456',
        'HOST': '47.98.56.102',  # aliyun
        'PORT': '3307',
        "CONN_MAX_AGE": 9,
        # 取消外键检查
        'OPTIONS': {
                "init_command": "SET foreign_key_checks = 0;",
        }
    }
}

CACHES = {
    #连接可使用get_redis_connection("default")
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": "redis://47.98.56.102:6379/1",
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
            "CONNECTION_POOL_KWARGS": {"max_connections": 100}
        },
        #"PASSWORD":"密码"
    }
}

# Password validation
# https://docs.djangoproject.com/en/3.0/ref/settings/#auth-password-validators

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
# https://docs.djangoproject.com/en/3.0/topics/i18n/

# LANGUAGE_CODE = 'en-us'
LANGUAGE_CODE = 'zh-Hans'
# TIME_ZONE = 'UTC'
TIME_ZONE = 'Asia/Shanghai'


USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.0/howto/static-files/
# 静态文件，static 是在Django 具体APP下建立的static目录，用来存放静态资源
STATIC_URL = '/static/'
# 使用 collectstatic后收集的静态文件的存放绝对路径
STATIC_ROOT = "/Users/yons/PycharmProjects/Easytest/static_file"
# STATICFILES_DIRS一般用来设置通用的静态资源，对应的目录不放在APP下，而是放在Project
# STATICFILES_DIRS = [os.path.join(BASE_DIR, 'common_static')]

# 开启该中间件之后，默认会为任何开放的HttpResponse设置X-Frame-Options协议头为DENY,如果你想要设置为SAMEOGIGIN
X_FRAME_OPTIONS = 'SAMEORIGIN'


# 配置日志
LOGGING = {
    'version': 1,
    'disable_existing_loggers': True,
    'formatters': {
        'standard': {
            'format': '%(asctime)s,%(process)d,%(name)s,%(levelname)s,%(filename)s:%(lineno)d,%(message)s'
        },
    },
    'filters': {
    },
    'handlers': {
        'mail_admins': {
            'level': 'ERROR',
            'class': 'django.utils.log.AdminEmailHandler',
            'include_html': True,
            # 'filters': ['special'],
        },
        'default': {
            'level': 'ERROR',
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': os.path.join(os.path.curdir, 'Error.log'),
            'maxBytes': 1024 * 1024 * 50,  # 50 MB
            'backupCount': 5,
            'formatter': 'standard',
        },
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
            'formatter': 'standard'
        },
    },
    'loggers': {
        'django': {
            'handlers': ['default', 'console'] if DEBUG else ["default"],
            'level': 'ERROR',
            'propagate': False
        },
        '': {
            'handlers': ['default', 'console'] if DEBUG else ["default"],
            'level': 'DEBUG',
            'propagate': False
        },
    }
}



#pip install -i https://pypi.doubanio.com/simple/
