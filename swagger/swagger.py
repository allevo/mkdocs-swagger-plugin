from mkdocs import plugins
import re
import os

regex = '!!([^\s]+) ([^!]+)!!'
def replace_all_occurence(text):
    return re.sub(regex, r'<div data-method="\1" data-path="\2">\1 \2</div>', text)

class Swagger(plugins.BasePlugin):
    def on_config(self, config):
        # Add javascript to every pages
        config[u'extra_javascript'].append('javascript_swagger/swagger_plugin.js')
        config[u'theme'].dirs.append(os.path.dirname(__file__))
        return config

    def on_page_markdown(self, markdown, config, **kwargs):

        markdown = replace_all_occurence(markdown)

        return markdown
