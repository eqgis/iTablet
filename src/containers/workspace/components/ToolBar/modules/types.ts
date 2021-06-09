export interface DATA_ITEM {
  key: string,
  title?: string,
  action: () => void,
  size?: 'large' | 'small',
  image: any,
}