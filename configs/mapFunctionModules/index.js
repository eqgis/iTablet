import functionExample from './FunctionExample'
// import Tour from './Tour'

const CustomModules = {
  functionExample,
}

function getModule (type) {
  let module = {}
  for (let key in CustomModules) {
    let item = CustomModules[key]()
    // 严格按照命名规范，type名称SM_yyy_zzz（SM_ 为系统字段，自定义不可使用）
    if (type.indexOf(item.type) === 0) {
      module = item
    }
  }
  return module
}

export default {
  getModule,
}

export {
  functionExample,
}