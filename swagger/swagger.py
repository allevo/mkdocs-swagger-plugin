from mkdocs import plugins
import re
import os

regex = '!!([^\s]+) ([^!]+)!!'
def replace_all_occurence(text):
    return re.sub(regex, r'<div data-method="\1" data-path="\2">\1 \2</div>', text)

class Swagger(plugins.BasePlugin):
    def on_config(self, config):
        swagger_url = config[u'extra'].data.get(u'swagger_url', 'https://petstore.swagger.io/v2/swagger.json')

        js_relative_path = 'javascript_swagger/swagger_plugin.js'
        dirname = os.path.dirname(__file__)
        js_filepath = os.path.join(dirname, js_relative_path)

        data = ''
        with open(js_filepath, 'r') as file:
            data = file.read()
        data = re.sub('\{\{swagger_url\}\}', swagger_url, data)
        with open(js_filepath, 'w') as file:
            file.write(data)

        # Add javascript to every pages
        config[u'extra_javascript'].append(js_relative_path)
        config[u'theme'].dirs.append(dirname)
        return config

    def on_page_markdown(self, markdown, config, **kwargs):

        markdown = replace_all_occurence(markdown)

        return markdown
