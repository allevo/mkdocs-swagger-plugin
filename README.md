# mkdocs-swagger-plugin
[![Open Source Saturday](https://img.shields.io/badge/%E2%9D%A4%EF%B8%8F-open%20source%20saturday-F64060.svg)](https://www.meetup.com/it-IT/Open-Source-Saturday-Milano/)

MkDocs plugin for render swagger into docs

## Installation

```bash
pip install git+https://github.com/allevo/mkdocs-swagger-plugin#egg=SwaggerPlugin
```

Add the plugin into `mkdocs.yml`

```yaml
plugins:
    - swagger
extra:
    swagger_url: 'https://petstore.swagger.io/v2/swagger.json'
```

## Usage

For time being this plugin use double exclamation points to introduce a box for invoking an API.

```markdown
!!GET /pet/{petId}!!
```

## License

MIT License
