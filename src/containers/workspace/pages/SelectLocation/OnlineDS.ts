import { SMap } from "imobile_for_reactnative"

const tianditu: SMap.DatasourceConnectionInfo = {
  alias: 'tiandituCN',
  server: 'http://t0.tianditu.com/vec_w/wmts?dpi=96&tk=ee1a36d71fda193082a10bea9661c811',
  engineType: 23,
  driver: 'WMTS',
}

export default {
  tianditu
}