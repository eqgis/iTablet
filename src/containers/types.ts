import { NavigationParams, NavigationScreenProp } from 'react-navigation'

export interface PageBase extends NavigationParams {
  title?: string,
  type?: string,
}

export interface StackNavigationParams extends NavigationScreenProp<PageBase> {
  state: PageBase,
}

