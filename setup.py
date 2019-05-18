from setuptools import setup

setup(
    name='SwaggerPlugin',
    version='0.0.1',
    packages=['swagger'],
    url='https://github.com/allevo/mkdocs-swagger-plugin',
    license='MIT',
    author='Tommaso Allevi',
    author_email='tomallevi@gmail.com',
    description='Fire http request described in a swagger file',
    install_requires=['mkdocs'],

    # The following rows are important to register your plugin.
    # The format is "(plugin name) = (plugin folder):(class name)"
    # Without them, mkdocs will not be able to recognize it.
    entry_points={
        'mkdocs.plugins': [
            'swagger = swagger:Swagger',
        ]
    },
)
