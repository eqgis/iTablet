export type TableItemType = {
  image: any,
  selectedImage?: any,
  title: string,
  action: (data: TableItemType) => void,
}
