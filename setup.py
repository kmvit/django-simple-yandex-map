from setuptools import setup
from setuptools import find_packages

setup(
    name='django_ymap',
    version='1.0',

    description='Simple Yandex.Maps integration into admin panel',
    keywords='django, yandex, maps, admin',

    author='xacce, maxvyaznikov',
    url='https://github.com/maxvyaznikov/django-simple-yandex-map',

    packages=find_packages(exclude=['demo']),
    classifiers=[
        'Framework :: Django',
        'Development Status :: 5 - Production/Stable',
        'Environment :: Web Environment',
        'Programming Language :: Python',
        'Intended Audience :: Developers',
        'Operating System :: OS Independent',
        'License :: OSI Approved :: BSD License',
        'Topic :: Software Development :: Libraries :: Python Modules'],

    license='MIT',
    include_package_data=True,
    zip_safe=False,
    install_requires=['django>=1.5']
)