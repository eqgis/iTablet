import functionExample from './FunctionExample'
import Tour from './Tour'

function getModule (type) {
  let module = {}
  switch (type) {
    case 'FunctionExample':
      module = functionExample()
      break
    case 'TourCreate': // 右侧FunctionToolbar入口
      module = Tour()
  }
  return module
}

export default {
  getModule,
}

export {
  functionExample,
  Tour,
}