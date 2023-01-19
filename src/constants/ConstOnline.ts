// import { TEngineType } from 'imobile_for_reactnative'

import { DatasourceConnectionInfo } from "imobile_for_reactnative/NativeModule/interfaces/data/SDataType"

// import { DatasourceConnectionInfo } from 'imobile_for_reactnative/types/data'
export interface TOnlineData {
  type: 'Datasource' | 'Workspace' | 'Map',
  DSParams: DatasourceConnectionInfo,
  layerIndex: number,
  mapName: string,
}

// const tiandituTokens = [
//   '31e87ef3554f75c1c9e6198ecb89d8eb',
//   '5cf044fdb0e9b5954c9fe936a15a09d3',
//   '241c3cb9c3c9666f822d4f9ab7b3e183',
//   '59071e185f4c7a30305e20b06f919c94',
//   '7d04ae15b6bb9d59d438cf7b2dadc867',
//   '06251553ded6308d9a5fce2b89270327',
//   '1b9a39b63a731de1ae2a328063f55297',
//   'afb813b539bdb93f10d4332bce28ac83',
//   '33757333f15cccf21c5c950de7699ac9',
//   '03dffb412a3f96f6404979826ec3651d',
// ]

const tiandituTokens = [
  '5345b22cb104489b013b6970fe34acc5',
  '5345b22cb104489b013b6970fe34acc5',
  '5345b22cb104489b013b6970fe34acc5',
  '5345b22cb104489b013b6970fe34acc5',
  '5345b22cb104489b013b6970fe34acc5',
  '67ccdbe6cc313cfc77842ebe01756b1a',
  '67ccdbe6cc313cfc77842ebe01756b1a',
  '67ccdbe6cc313cfc77842ebe01756b1a',
  '67ccdbe6cc313cfc77842ebe01756b1a',
  '67ccdbe6cc313cfc77842ebe01756b1a',
]
function _getToken() {
  const rad = Math.ceil(Math.random() * 10) - 1
  const token = tiandituTokens[rad]
  return token
}
function tianditu(): TOnlineData {
  return {
    type: 'Datasource',
    DSParams: {
      server:
      `http://t0.tianditu.com/vec_w/wmts?dpi=96&tk=${_getToken()}`,
      engineType: 23,
      driver: 'WMTS',
      alias: 'tianditu',
    },
    layerIndex: 0,
    mapName: 'tianditu',
  }
}
function tiandituCN(): TOnlineData {
  return {
    type: 'Datasource',
    DSParams: {
      server:
      `http://t0.tianditu.com/cva_w/wmts?dpi=96&tk=${_getToken()}`,
      engineType: 23,
      driver: 'WMTS',
      alias: 'tiandituCN',
    },
    layerIndex: 0,
    mapName: 'tiandituCN',
  }
}
function tiandituEN(): TOnlineData {
  return {
    type: 'Datasource',
    DSParams: {
      server:
      `http://t0.tianditu.com/eva_w/wmts?dpi=96&tk=${_getToken()}`,
      engineType: 23,
      driver: 'WMTS',
      alias: 'tiandituEN',
    },
    layerIndex: 0,
    mapName: 'tiandituEN',
  }
}
function tiandituImg(): TOnlineData {
  return {
    type: 'Datasource',
    DSParams: {
      server:
      `http://t0.tianditu.com/img_w/wmts?dpi=96&tk=${_getToken()}`,
      engineType: 23,
      driver: 'WMTS',
      alias: 'tiandituImg',
    },
    layerIndex: 0,
    mapName: 'tiandituImg',
  }
}
function tiandituImgCN(): TOnlineData {
  return {
    type: 'Datasource',
    DSParams: {
      server:
      `http://t0.tianditu.com/cia_w/wmts?dpi=96&tk=${_getToken()}`,
      engineType: 23,
      driver: 'WMTS',
      alias: 'tiandituImgCN',
    },
    layerIndex: 0,
    mapName: 'tiandituImgCN',
  }
}

function tiandituImgEN(): TOnlineData {
  return {
    type: 'Datasource',
    DSParams: {
      server:
      `http://t0.tianditu.com/eia_w/wmts?dpi=96&tk=${_getToken()}`,
      engineType: 23,
      driver: 'WMTS',
      alias: 'tiandituImgEN',
    },
    layerIndex: 0,
    mapName: 'tiandituImgEN',
  }
}
function tiandituTer(): TOnlineData {
  return {
    type: 'Datasource',
    DSParams: {
      server:
      `http://t0.tianditu.com/ter_w/wmts?dpi=96&tk=${_getToken()}`,
      engineType: 23,
      driver: 'WMTS',
      alias: 'tiandituTer',
    },
    layerIndex: 0,
    mapName: 'tiandituTer',
  }
}
function tiandituTerCN(): TOnlineData {
  return {
    type: 'Datasource',
    DSParams: {
      server:
      `http://t0.tianditu.com/cta_w/wmts?dpi=96&tk=${_getToken()}`,
      engineType: 23,
      driver: 'WMTS',
      alias: 'tiandituTerCN',
    },
    layerIndex: 0,
    mapName: 'tiandituTerCN',
  }
}


const TD: TOnlineData[] = [
  {
    type: 'Datasource',
    DSParams: {
      server: 'http://t0.tianditu.com/vec_w/wmts?DPI=96',
      engineType: 23,
      driver: 'WMTS',
      alias: 'TD',
    },
    layerIndex: 0,
    mapName: '墨卡托',
  },
  {
    type: 'Datasource',
    DSParams: {
      server: 'http://t0.tianditu.com/cva_w/wmts?DPI=96',
      engineType: 23,
      driver: 'WMTS',
      alias: 'TDWZ',
    },
    layerIndex: 0,
    mapName: '墨卡托文字标注',
  },
]
const TDJWD: TOnlineData[] = [
  {
    type: 'Datasource',
    DSParams: {
      server: 'http://t0.tianditu.com/vec_c/wmts?DPI=96',
      engineType: 23,
      driver: 'WMTS',
      alias: 'TDJWD',
    },
    layerIndex: 0,
    mapName: '经纬度',
  },
  {
    type: 'Datasource',
    DSParams: {
      server: 'http://t0.tianditu.com/cva_c/wmts?DPI=96',
      engineType: 23,
      driver: 'WMTS',
      alias: 'TDJWDWZ',
    },
    layerIndex: 0,
    mapName: '经纬度文字标注',
  },
]
const TDYX: TOnlineData = {
  type: 'Datasource',
  DSParams: {
    server: 'http://t0.tianditu.com/img_c/wmts?DPI=96',
    engineType: 23,
    driver: 'WMTS',
    alias: 'TDYX',
  },
  layerIndex: 0,
  mapName: '影像经纬度',
}
const TDYXM: TOnlineData = {
  type: 'Datasource',
  DSParams: {
    server: 'http://t0.tianditu.com/img_w/wmts?DPI=96',
    engineType: 23,
    driver: 'WMTS',
    alias: 'TDYXM',
  },
  layerIndex: 0,
  mapName: '影像墨卡托',
}
const TDQ: TOnlineData = {
  type: 'Datasource',
  DSParams: {
    server: 'http://t0.tianditu.com/ter_c/wmts?DPI=96',
    engineType: 23,
    driver: 'WMTS',
    alias: 'TDQ',
  },
  layerIndex: 0,
  mapName: '全球地形',
}
const Baidu: TOnlineData = {
  type: 'Datasource',
  DSParams: {
    server: 'http://www.baidu.com',
    engineType: 227,
    alias: 'BaiduMap',
  },
  layerIndex: 0,
  mapName: '百度地图',
}
const Google: TOnlineData = {
  type: 'Datasource',
  DSParams: {
    server: 'http://www.google.cn/maps?scale=2',
    engineType: 223,
    alias: 'GoogleMaps',
  },
  layerIndex: 3,
  mapName: 'GOOGLE地图',
}
const BingMap: TOnlineData = {
  type: 'Datasource',
  DSParams: {
    server: 'http://cn.bing.com/ditu',
    engineType: 230,
    alias: 'bingMap',
  },
  layerIndex: 0,
  mapName: 'BingMap',
}
const OSM: TOnlineData = {
  type: 'Datasource',
  DSParams: {
    server: 'http://openstreetmap.org',
    engineType: 228,
    alias: 'OpenStreetMaps',
  },
  layerIndex: 0,
  mapName: 'OSM',
}
const GAODE: TOnlineData = {
  type: 'Datasource',
  DSParams: {
    server: 'https://www.amap.com',
    engineType: 232,
    alias: 'GaoDeMaps',
  },
  layerIndex: 0,
  mapName: 'GaoDe',
}
const SuperMapCloud: TOnlineData = {
  type: 'Datasource',
  DSParams: {
    server: 'http://t2.supermapcloud.com',
    engineType: 224,
    alias: 'SuperMapCloud',
  },
  layerIndex: 0,
  mapName: 'SuperMapCloud',
}
const TrafficMap: TOnlineData = {
  type: 'Datasource',
  DSParams: {
    server:
      'https://www.supermapol.com/iserver/services/traffic/rest/maps/tencent',
    engineType: 225,
    alias: 'TrafficMap',
  },
  layerIndex: 0,
  mapName: 'TrafficMap',
}

export default {
  TD,
  TDJWD,
  TDYX,
  TDYXM,
  TDQ,
  Baidu,
  Google,
  BingMap,
  OSM,
  GAODE,
  SuperMapCloud,
  TrafficMap,
  tianditu,
  tiandituCN,
  tiandituEN,
  tiandituImg,
  tiandituImgCN,
  tiandituImgEN,
  tiandituTer,
  tiandituTerCN,
}
