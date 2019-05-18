import re

regex = '!!([^\s]+) ([^!]+)!!'

def replace_all_occurence(text):
    return re.sub(regex, r'<div data-method="\1" data-path="\2">\1 \2</div>', text)

def test_one_occurence():
    text = '!!GET /foo/bar!!'
    m = replace_all_occurence(text)
    assert m == '<div data-method="GET" data-path="/foo/bar">GET /foo/bar</div>'

def test_three_occurence():
    text = '!!GET /foo/bar!! \n !!POST /foo/bar!! \n !!GET /foo/bar/baz!!'
    m = replace_all_occurence(text)
    assert m == '<div data-method="GET" data-path="/foo/bar">GET /foo/bar</div> \n <div data-method="POST" data-path="/foo/bar">POST /foo/bar</div> \n <div data-method="GET" data-path="/foo/bar/baz">GET /foo/bar/baz</div>'

def test_real():
    text = '''# Welcome to MkDocs

    !!GET /foo/bar!!
'''
    m = replace_all_occurence(text)
    assert m == '# Welcome to MkDocs\n\n    <div data-method="GET" data-path="/foo/bar">GET /foo/bar</div>\n'

if __name__ == "__main__":
    test_one_occurence()
    test_three_occurence()
    test_real()
    print("Everything passed")
