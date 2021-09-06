import { SectionData, SectionItemData } from '../types'

function getData() {
  const buttons: any = []
  let data: SectionData[] | SectionItemData[] | string[] = []
  return {data, buttons}
}

export default {
  getData,
}