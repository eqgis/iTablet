interface DataItem {
  key: string;
  title: string;
  action: (type?: any) => (Promise<boolean | void> | void);
  size: string;
  image: any;
  selectMode?: string,
  disable?: boolean,
}

/**
 * 获取编辑操作
 * @param type
 * @returns {{data: Array, buttons: Array}}
 */
function getData(type: string | number) {
  let data: DataItem[] = []
  let buttons: ToolBarBottomItem[] = []
  let customView = null
  return { data, buttons, customView }
}

export default {
  getData,
}
