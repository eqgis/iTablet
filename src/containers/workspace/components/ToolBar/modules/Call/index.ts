import FunctionModule from '../../../../../../class/FunctionModule'
import { getImage } from '../../../../../../../applets/langchaoDemo/src/assets'
import NavigationService from '@/containers/NavigationService'
import { getLanguage } from '@/language'

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
    title:  getLanguage(global.language).Prompt.CALL,
    size: 'large',
    image: getImage().telephone1,
  })
}
