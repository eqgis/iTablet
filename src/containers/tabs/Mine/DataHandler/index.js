import DataExternal from './DataExternal'
import DataLocal from './DataLocal'
import DataImport from './DataImport'
import DataExport from './DataExport'
import ARMapData from './ARMapData'
import DataExample from './DataExample'

const DataHandler = {
  ...DataExternal,
  ...DataLocal,
  ...DataImport,
  ...DataExport,
  ...ARMapData,
  ...DataExample,
}
export default DataHandler
