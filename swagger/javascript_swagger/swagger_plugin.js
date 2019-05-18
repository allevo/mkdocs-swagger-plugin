function findApiFromSwagger(swagger, method, path) {
  return swagger.paths[path][method.toLowerCase()]
}

function makeRequestWrapper(apiDefinition, inputsIds, resultBodyId) {
  return function onClick(ev) {
    const params = {}
    const paramsNames = Object.keys(inputsIds)
    for (let i  = 0; i < paramsNames.length; i++) {
      const name = paramsNames[i]
      params[name] = document.getElementById(inputsIds[name]).value
    }

    const path = apiDefinition.path
    const urlPath = path.replace(/\{([^\}]+)\}/, function (_, name) {
      const v = params[name]
      delete params[name]
      return v
    })

    const url = `${apiDefinition.scheme}://${apiDefinition.host}${apiDefinition.basePath}${urlPath}`

    fetch(url)
      .then(response => response.text())
      .then(body => {
        console.log(body, resultBodyId)
        document.getElementById(resultBodyId).innerText = body
      })
  }
}

function createHandler(apiDefintion) {
  const method = apiDefintion.method
  const path = apiDefintion.path

  return function onClick(ev) {
    const button = ev.currentTarget
    if (button.open) {
      return
    }
    button.open = true
    const div = button.parentNode

    const paramsDiv = document.createElement('div')

    paramsDiv.innerHTML = '<dl>'
    const ids = {}
    for (let i = 0; i < apiDefintion.parameters.length; i++) {
      const parameter = apiDefintion.parameters[i]
      if (parameter.in !== 'path') continue

      let id = `${method}_${path}_param_${parameter.name}`
      paramsDiv.innerHTML += '<dt>' + parameter.name + ': ' + parameter.description + '</dt>'
      paramsDiv.innerHTML += `<dd><input id=${id} name="${parameter.name}" /></dd>`
      ids[parameter.name] = id
    }
    paramsDiv.innerHTML += '</dl>'
    div.appendChild(paramsDiv)

    const runButton = document.createElement('button')
    runButton.innerText = 'fire'
    div.appendChild(runButton)

    const resultBodyId = `${method}_${path}_result`
    const resultBox = document.createElement('div')
    resultBox.innerHTML = `<textarea id="${resultBodyId}"></textarea>`
    div.appendChild(resultBox)

    runButton.addEventListener('click', makeRequestWrapper(apiDefintion, ids, resultBodyId))
  }
}

window.addEventListener('load', function () {
  'use strict'

  const allNodes = document.querySelectorAll('div[data-method][data-path]')
  const SWAGGER_URL = 'https://petstore.swagger.io/v2/swagger.json'

  fetch(SWAGGER_URL)
    .then(response => response.json())
    .then(swagger => {
      for (let i = 0; i < allNodes.length; i++) {
        const node = allNodes[i]

        const method = node.getAttribute('data-method')
        const path = node.getAttribute('data-path')

        const api = findApiFromSwagger(swagger, method, path)
        api.method = method
        api.path = path
        api.host = swagger.host
        api.basePath = swagger.basePath
        api.scheme = 'https'

        const summary = api.summary || `${method} - ${path}`

        node.innerHTML = `<button>${summary}</button>`
        node.addEventListener('click', createHandler(api))
      }
    })
})
