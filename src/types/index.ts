export type ButtonSize = 'large' | 'normal' | 'small'

export interface BaseItem {
  key: string,
  title?: string,
  action?: (data?: any) => any,
  size?: ButtonSize,
  image: any,
}

export interface ListItem extends BaseItem {
  subTitle?: string,
  data?: any,
}

export type ToolbarBottomButton = {
  type: string,
  image: any,
  action: (data?: any) => any,
} | string