import BundleUtils from '@/utils/BundleUtils'
import { LangChaoDemoModule } from './src/mapModules'

// 加入redux中,在首页显示
BundleUtils.loadModule(LangChaoDemoModule)