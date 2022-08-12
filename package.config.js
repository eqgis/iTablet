const pathSep = require('path').sep

// function postProcessModulesFilter(module) {
//   if (module['path'].indexOf(__dirname + pathSep + 'applets' + pathSep) == 0) {
//     return false
//   }
//   return true
// }

function createModuleIdFactory() {
  const projectRootPath = __dirname
  return path => {
    // console.log('buz createModuleIdFactory path : '+ path)
    let name = ''
    if (
      path.indexOf(
        'node_modules' +
          pathSep +
          'react-native' +
          pathSep +
          'Libraries' +
          pathSep,
      ) > 0
    ) {
      name = path.substr(path.lastIndexOf(pathSep) + 1)
    } else if (path.indexOf(projectRootPath) == 0) {
      name = path.substr(projectRootPath.length + 1)
    }
    name = name.replace('.js', '')
    name = name.replace('.ts', '')
    name = name.replace('.tsx', '')
    name = name.replace('.html', '')
    name = name.replace('.png', '')
    const regExp =
      pathSep == '\\' ? new RegExp('\\\\', 'gm') : new RegExp(pathSep, 'gm')
    name = name.replace(regExp, '_') //把path中的/换成下划线
    // console.log('buz createModuleIdFactory : ' + name)
    return name
  }
}

module.exports = {
  serializer: {
    createModuleIdFactory: createModuleIdFactory,
    // processModuleFilter: postProcessModulesFilter,
    /* serializer options */
  },
}
