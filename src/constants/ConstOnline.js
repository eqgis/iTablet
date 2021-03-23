export default {
  TD: [
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
  ],
  TDJWD: [
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
  ],
  TDYX: {
    type: 'Datasource',
    DSParams: {
      server: 'http://t0.tianditu.com/img_c/wmts?DPI=96',
      engineType: 23,
      driver: 'WMTS',
      alias: 'TDYX',
    },
    layerIndex: 0,
    mapName: '影像经纬度',
  },
  TDYXM: {
    type: 'Datasource',
    DSParams: {
      server: 'http://t0.tianditu.com/img_w/wmts?DPI=96',
      engineType: 23,
      driver: 'WMTS',
      alias: 'TDYXM',
    },
    layerIndex: 0,
    mapName: '影像墨卡托',
  },
  TDQ: {
    type: 'Datasource',
    DSParams: {
      server: 'http://t0.tianditu.com/ter_c/wmts?DPI=96',
      engineType: 23,
      driver: 'WMTS',
      alias: 'TDQ',
    },
    layerIndex: 0,
    mapName: '全球地形',
  },
  Baidu: {
    type: 'Datasource',
    DSParams: {
      server: 'http://www.baidu.com',
      engineType: 227,
      alias: 'BaiduMap',
    },
    layerIndex: 0,
    mapName: '百度地图',
  },
  Google: {
    type: 'Datasource',
    DSParams: {
      server: 'http://www.google.cn/maps?scale=2',
      engineType: 223,
      alias: 'GoogleMaps',
    },
    layerIndex: 3,
    mapName: 'GOOGLE地图',
  },
  BingMap: {
    type: 'Datasource',
    DSParams: {
      server: 'http://cn.bing.com/ditu',
      engineType: 230,
      alias: 'bingMap',
    },
    layerIndex: 0,
    mapName: 'BingMap',
  },
  OSM: {
    type: 'Datasource',
    DSParams: {
      server: 'http://openstreetmap.org',
      engineType: 228,
      alias: 'OpenStreetMaps',
    },
    layerIndex: 0,
    mapName: 'OSM',
  },
  SuperMapCloud: {
    type: 'Datasource',
    DSParams: {
      server: 'http://t2.supermapcloud.com',
      engineType: 224,
      alias: 'SuperMapCloud',
    },
    layerIndex: 0,
    mapName: 'SuperMapCloud',
  },
  TrafficMap: {
    type: 'Datasource',
    DSParams: {
      server:
        'https://www.supermapol.com/iserver/services/traffic/rest/maps/tencent',
      engineType: 225,
      alias: 'TrafficMap',
    },
    layerIndex: 0,
    mapName: 'TrafficMap',
  },
  tianditu: {
    type: 'Datasource',
    DSParams: {
      server:
        'http://t0.tianditu.com/vec_w/wmts?dpi=96&tk=ee1a36d71fda193082a10bea9661c811',
      engineType: 23,
      driver: 'WMTS',
      alias: 'tianditu',
    },
    layerIndex: 0,
    mapName: 'tianditu',
  },
  tiandituCN: {
    type: 'Datasource',
    DSParams: {
      server:
        'http://t0.tianditu.com/cva_w/wmts?dpi=96&tk=ee1a36d71fda193082a10bea9661c811',
      engineType: 23,
      driver: 'WMTS',
      alias: 'tiandituCN',
    },
    layerIndex: 0,
    mapName: 'tiandituCN',
  },
  tiandituEN: {
    type: 'Datasource',
    DSParams: {
      server:
        'http://t0.tianditu.com/eva_w/wmts?dpi=96&tk=ee1a36d71fda193082a10bea9661c811',
      engineType: 23,
      driver: 'WMTS',
      alias: 'tiandituEN',
    },
    layerIndex: 0,
    mapName: 'tiandituEN',
  },
  tiandituImg: {
    type: 'Datasource',
    DSParams: {
      server:
        'http://t0.tianditu.com/img_w/wmts?dpi=96&tk=ee1a36d71fda193082a10bea9661c811',
      engineType: 23,
      driver: 'WMTS',
      alias: 'tiandituImg',
    },
    layerIndex: 0,
    mapName: 'tiandituImg',
  },
  tiandituImgCN: {
    type: 'Datasource',
    DSParams: {
      server:
        'http://t0.tianditu.com/cia_w/wmts?dpi=96&tk=ee1a36d71fda193082a10bea9661c811',
      engineType: 23,
      driver: 'WMTS',
      alias: 'tiandituImgCN',
    },
    layerIndex: 0,
    mapName: 'tiandituImgCN',
  },
  tiandituImgEN: {
    type: 'Datasource',
    DSParams: {
      server:
        'http://t0.tianditu.com/eia_w/wmts?dpi=96&tk=ee1a36d71fda193082a10bea9661c811',
      engineType: 23,
      driver: 'WMTS',
      alias: 'tiandituImgEN',
    },
    layerIndex: 0,
    mapName: 'tiandituImgEN',
  },
  tiandituTer: {
    type: 'Datasource',
    DSParams: {
      server:
        'http://t0.tianditu.com/ter_w/wmts?dpi=96&tk=ee1a36d71fda193082a10bea9661c811',
      engineType: 23,
      driver: 'WMTS',
      alias: 'tiandituTer',
    },
    layerIndex: 0,
    mapName: 'tiandituTer',
  },
  tiandituTerCN: {
    type: 'Datasource',
    DSParams: {
      server:
        'http://t0.tianditu.com/cta_w/wmts?dpi=96&tk=ee1a36d71fda193082a10bea9661c811',
      engineType: 23,
      driver: 'WMTS',
      alias: 'tiandituTerCN',
    },
    layerIndex: 0,
    mapName: 'tiandituTerCN',
  },
}
