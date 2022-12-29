import CustomFunctionModule from '@/class/CustomFunctionModule'
import Tour from './Tour'

const CustomModules: {
  [name: string]: (type?: string) => CustomFunctionModule,
} = {
  Tour,
}

function getModule (type: string, params?: any) {
  let module = {}
  if (typeof type !== 'string') return null
  for (const key in CustomModules) {
    const item = CustomModules[key]()
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
  Tour,
}