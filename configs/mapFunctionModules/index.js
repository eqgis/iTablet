import functionExample from './FunctionExample'

// eslint-disable-next-line
function getModule (type, params = {}) {
  let module = {}
  if (type === 'FunctionExample') {
    module = functionExample()
  }
  return module
}

export default {
  getModule,
}

export {
  functionExample,
}