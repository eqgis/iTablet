export interface FiltedData {
  /** 不含根目录的路径 */
  path: string,
  name: string,
  mtime: string,
  isDirectory: boolean,
  Type?: number,
}