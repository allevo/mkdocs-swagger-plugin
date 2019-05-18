function findApiFromSwagger(swagger, method, path) {
  'use strict'
  return swagger.paths[path][method.toLowerCase()]
}

function makeRequestWrapper(apiDefinition, inputsIds, resultBodyId) {
  'use strict'
  return function onClick(ev) {
    const paramsNames = Object.keys(inputsIds)

    const pathParams = {}
    const queryParams = {}
    for (let i  = 0; i < paramsNames.length; i++) {
      const name = paramsNames[i]
      const value = document.getElementById(inputsIds[name]).value
      const type = apiDefinition.parameters.find(p => p.name === name)

      console.log(type)

      if (type.in === 'path') {
        pathParams[name] = value
      } else if (type.in === 'query') {
        queryParams[name] = value
      }
    }

    const path = apiDefinition.path
    const urlPath = path.replace(/\{([^\}]+)\}/, (_, name) => pathParams[name])

    const querystring = []
    const queryParamsNames = Object.keys(queryParams)
    for (let i = 0; i < queryParamsNames.length; i++) {
      const name = queryParamsNames[i];
      const value = queryParams[name]
      querystring.push(`${name}=${value}`)
    }

    let q = (querystring.length > 0 ? '?' : '' ) + querystring.join('&')
    const url = `${apiDefinition.scheme}://${apiDefinition.host}${apiDefinition.basePath}${urlPath}${q}`

    fetch(url)
      .then(response => response.text())
      .then(body => {
        console.log(body, resultBodyId)
        document.getElementById(resultBodyId).innerText = body
      })
  }
}

function createHandler(apiDefinition) {
  'use strict'
  const method = apiDefinition.method
  const path = apiDefinition.path

  return function onClick(ev) {
    const div = ev.currentTarget
    if (div.open) {
      return
    }
    div.open = true

    const paramsDiv = document.createElement('div')

    paramsDiv.innerHTML = '<dl>'
    const ids = {}
    for (let i = 0; i < apiDefinition.parameters.length; i++) {
      const parameter = apiDefinition.parameters[i]

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

    runButton.addEventListener('click', makeRequestWrapper(apiDefinition, ids, resultBodyId))
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

        if (method !== 'GET') {
          console.log('Implement ME!!', method)
          continue
        }

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
