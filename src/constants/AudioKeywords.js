/**
 * 搜索关键词
 * @type {{FOOD: string, SCENIC: string, BANK: string, MARKET: string, HOTEL: string, TOILET: string, BUS: string, PARK: string, HOSPITAL: string, GAS_STATION: string, MALL: string, SUBWAY: string}}
 */
const searchKeys = {
  FOOD: '美食,食物,餐厅,food,restaurant,dining room',
  SCENIC: '景点,景区,旅游,观光,attraction,tour,scenic',
  BANK: '银行,bank',
  MARKET: '超市,supermarket,market',
  HOTEL: '酒店,旅店,hotel',
  TOILET: '厕所,卫生间,restroom,toilet,lavatory',
  BUS: '公交,车站,bus station,bus stop,bus',
  PARK: '停车场,park,stopping place',
  HOSPITAL: '医院,HOSPITAL',
  GAS_STATION: '加油站,加油,gas station,gas',
  MALL: '商场,shopping,mall',
  SUBWAY: '地铁,subway',
}

const keywords = {
  Baidu: '百度',
  Google: '谷歌',
  OSM: 'OSM',
  TD: '天地图',
  THEME: '专题',
  LOCATION: '定位,locate,location',
  CLOSE: '关闭,close',
  ZOOM_IN: '放大,zoom in',
  ZOOM_OUT: '缩小,zoom out',
  SEARCH: '搜索,search',
}

const chineseNumber = {
  零: '零',
  一: '一',
  二: '二',
  三: '三',
  四: '四',
  五: '五',
  六: '六',
  七: '七',
  八: '八',
  九: '九',
  十: '十',
  百: '百',
  千: '千',
  万: '万',
  亿: '亿',
}

const themeType = {
  UNIQUE: '单值',
  RANGE: '分段',
  LABEL: '标签',
}

export default {
  keywords,
  chineseNumber,
  themeType,
  searchKeys,
}
