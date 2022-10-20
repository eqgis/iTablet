
import { dp } from '@/utils'
import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: dp(300),
    left: dp(22),
    bottom: dp(22),
    backgroundColor: 'rgba(255, 255, 255, 0.60)',
    flexDirection: 'column',
    paddingVertical: dp(10),
    paddingHorizontal: dp(10),
    borderRadius: dp(10),
  },
  title: {
    width: dp(30),
    color: '#3A3A3A',
    fontSize: dp(12),
    textAlign: "left",
    justifyContent: 'center',
    marginLeft: dp(10),
  },
  title2: {
    color: '#3A3A3A',
    fontSize: dp(12),
    textAlign: "center",
    justifyContent: 'center',
  },
  valueText: {
    marginLeft: dp(10),
    flex: 1,
    color: '#000',
    fontSize: dp(16),
    fontWeight: 'bold',
    textAlign: "left",
    justifyContent: 'center',
  },
  valueText2: {
    color: '#000',
    fontSize: dp(16),
    fontWeight: 'bold',
    textAlign: "center",
    justifyContent: 'center',
  },
  row: {
    height: dp(30),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  row2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  column: {
    height: dp(70),
    width: dp(70),
    borderRadius: dp(10),
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  close: {
    position: 'absolute',
    width: dp(30),
    height: dp(30),
    top: dp(-40),
    right: dp(0),
    flexDirection: 'column',
    paddingVertical: dp(10),
    paddingHorizontal: dp(10),
    borderRadius: dp(15),
    backgroundColor: '#FAFAFA',
  },
})

export default styles
