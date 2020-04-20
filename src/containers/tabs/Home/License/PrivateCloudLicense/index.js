import { createSwitchNavigator } from 'react-navigation'
import ConnectServer from './ConnectServer'
import LicenseJoinPrivateCloud from './LicenseJoinPrivateCloud'

export default createSwitchNavigator(
  {
    ConnectServer: ConnectServer,
    LicenseJoinPrivateCloud: LicenseJoinPrivateCloud,
  },
  {
    initialRouteName: 'ConnectServer',
  },
)
