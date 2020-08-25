import functionExample from './FunctionExample'

function getModule (type) {
  let module = {}
  switch (type) {
    case 'FunctionExample':
      module = functionExample()
      break
  }
  return module
}

export default {
  getModule,
}

export {
  functionExample,
  // Tour,
}