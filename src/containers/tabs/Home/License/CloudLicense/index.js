import { createSwitchNavigator } from 'react-navigation'
import LoginCloud from './LoginCloud'
import LicenseJoinCloud from './LicenseJoinCloud'

export default createSwitchNavigator(
  {
    LoginCloud: LoginCloud,
    LicenseJoinCloud: LicenseJoinCloud,
  },
  {
    initialRouteName: 'LoginCloud',
  },
)
