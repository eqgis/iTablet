import FunctionModule from '../../../../../../class/FunctionModule'
import { getImage } from '../../../../../../../applets/langchaoDemo/src/assets'
import NavigationService from '@/containers/NavigationService'

class CallModule extends FunctionModule {
  constructor(props) {
    super(props)
  }

  action = () => {
    NavigationService.navigate('ContactsList')
  }
}

export default function() {
  return new CallModule({
    type: "CALL",
    title: "呼叫",
    size: 'large',
    image: getImage().telephone1,
  })
}
