import xml2js from 'react-native-xml2js'
const parser = new xml2js.Parser()
const builder = new xml2js.Builder()
import fs from 'react-native-fs'
import { FileTools } from '../../../native'
import { DatasetType } from 'imobile_for_reactnative'

/**
 * 读取xml文件内容
 * @param path  xml文件目录
 * @param cb    回调函数，返回解析后的对象
 * @returns {Promise.<boolean>}
 */
async function readXML(path, cb = () => {}) {
  try {
    let data = await fs.readFile(path)
    parser.parseString(data, async (err, result) => {
      let feature = result.featureSymbol.template[0].feature

      function getData(arr) {
        let _arr = []
        for (let i = 0; i < arr.length; i++) {
          let _data = arr[i].$

          // 属性
          let fields = []
          if (arr[i].fields[0].field) {
            for (let j = 0; j < arr[i].fields[0].field.length; j++) {
              fields.push(arr[i].fields[0].field[j].$)
            }
          }
          _data.fields = fields

          // 子模板
          if (arr[i].feature && arr[i].feature.length > 0) {
            _data.childGroups = getData(arr[i].feature)
          }

          _arr.push(_data)
        }
        return _arr
      }

      let _data = getData(feature)

      if (cb && typeof cb === 'function') {
        cb(_data)
      }
    })
    return true
  } catch (e) {
    return false
  }
}

/**
 * 写入xml文件
 * @param path   文件绝对路径
 * @param array  被写入的未处理的数据
 * @returns {Promise.<*>}
 */
async function writeXML(path, array) {
  try {
    if (!path) {
      return false
    }
    let fileName = path.slice(path.lastIndexOf('/') + 1, path.lastIndexOf('.'))

    let xmlObj = obj2Xml(fileName, array)

    let xml = builder.buildObject(xmlObj)

    return {
      result: await FileTools.writeFile(path, xml),
      xmlObj,
      xml,
    }
  } catch (e) {
    return false
  }
}

/**
 * 写入xml文件
 * @param path   文件绝对路径
 * @param array  被写入处理过的数据
 * @returns {Promise.<*>}
 */
async function writeXML2(path, xmlObj) {
  try {
    if (!path) {
      return false
    }
    let xml = builder.buildObject(xmlObj)

    return {
      result: await FileTools.writeFile(path, xml),
      xmlObj,
      xml,
    }
  } catch (e) {
    return false
  }
}

function obj2Xml(fileName, array) {
  function getFeature(arr) {
    let _arr = []
    for (let i = 0; i < arr.length; i++) {
      let field = [] // 属性
      let feature = [] // 子元素
      if (arr[i].childGroups && arr[i].childGroups.length > 0) {
        feature = getFeature(arr[i].childGroups)
      }

      for (let j = 0; j < arr[i].fields.length; j++) {
        let _field = arr[i].fields[j]
        let value = ''
        if (_field.value !== undefined) {
          value = _field.value
        } else if (_field.defaultValue !== undefined) {
          value = _field.defaultValue
        }
        let _temp = {
          $: {
            name: _field.name,
            caption: _field.caption,
            value,
            DataType: 'Default',
            KeyField: 'True',
          },
        }
        field.push(_temp)
      }

      let type = arr[i].type
      if (!isNaN(type)) {
        switch (type) {
          case DatasetType.LINE:
            type = 'Line'
            break
          case DatasetType.POINT:
            type = 'Point'
            break
          case DatasetType.REGION:
            type = 'Region'
            break
          case DatasetType.CAD:
            type = 'CAD'
            break
        }
      }

      let _data = {
        $: {
          code: arr[i].code,
          name: arr[i].name,
          type: type,
          datasourceAlias: arr[i].datasourceAlias,
          datasetName: arr[i].datasetName,
        },
        fields: [
          {
            field,
          },
        ],
        feature,
      }

      _arr.push(_data)
    }
    return _arr
  }

  let xmlObj = {
    featureSymbol: {
      $: {
        xmlns: 'http://www.supermap.com.cn/desktop',
      },
      template: [
        {
          $: {
            name: fileName,
          },
          feature: getFeature(array),
        },
      ],
    },
  }
  return xmlObj
}

export default {
  readXML,
  writeXML,
  writeXML2,
  obj2Xml,
}
