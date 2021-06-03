import DataExternal from './DataExternal'
import DataLocal from './DataLocal'
import DataImport from './DataImport'
import DataExport from './DataExport'
import ARMapData from './ARMapData'

const DataHandler = {
  ...DataExternal,
  ...DataLocal,
  ...DataImport,
  ...DataExport,
  ...ARMapData,
}
export default DataHandler
