// import '../../common/index'
console.log('--------tour 1---------')
// import { Toast } from '@/utils'
import BundleUtils from '@/utils/BundleUtils'
import { TourModule } from './src/mapModules'
import Toast from 'react-native-root-toast'

console.log('--------tour 2---------')

Toast.show('tour loaded')

// 加入redux中,在首页显示
BundleUtils.loadModule(new TourModule())