import BundleUtils from '@/utils/BundleUtils'
import { TourModule } from './src/mapModules'
import Toast from 'react-native-root-toast'

Toast.show('tour loaded')

// 加入redux中,在首页显示
BundleUtils.loadModule(new TourModule())