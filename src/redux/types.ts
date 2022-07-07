import { FieldInfo2 } from 'imobile_for_reactnative'
import { reducer } from './store'

export type RootState = ReturnType<typeof reducer>

export interface FilterParams {
  filter: string,
  cursorType: 2 | 3, // 2: DYNAMIC, 3: STATIC
}

export interface LayerHistory {
  layerPath: string,
  currentIndex: number,
  history: {
    fieldInfo: FieldInfo2[],
    params: FilterParams,
  }[],
}

export interface AttributeHistory {
  mapName: string,
  currentIndex: number,
  layers: LayerHistory[],
}