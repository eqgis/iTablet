import { AppEvent } from '@/utils'
import React from 'react'

interface Props {
  arViewDidMount: () => void
}



class ARViewLoadHandler extends React.Component<Props> {

  isInited = false

  constructor(props: Props) {
    super(props)
  }


  componentDidMount(): void {
    AppEvent.addListener('on_ar_mapview_loaded', this.onLoad)
  }

  componentWillUnmount(): void {
    AppEvent.removeListener('on_ar_mapview_loaded', this.onLoad)
  }

  onLoad = () => {
    if(!this.isInited) {
      this.isInited = true
      this.props.arViewDidMount()
    }
  }

  render() {
    return null
  }
}

export default ARViewLoadHandler