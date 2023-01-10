import {
  EngineType,
  SExhibition,
  SFacilityAnalyst,
} from "imobile_for_reactnative"
import { FlowParam, PipeInfo, ValveInfo } from "imobile_for_reactnative/NativeModule/interfaces/ar/SExhibition"
import { Vector3 } from "imobile_for_reactnative/types/data"

/**
 * 爆管管理，分析
 * 流程：
 * 1. 设置爆管分析数据源，数据集并打开, 设置AR管线图图层名
 * 2. 添加爆管点
 *    1). 根据爆管点管线名查找对应数据集内弧线id
 *    2). 查看是否已有此路径
 *    3). 有则将爆管点加入此路径中，显示爆管点
 *    4). 没有则根据爆管点弧线id查找此处上下游所有弧线id, 节点id
 *    5). 通过上下游节点构造路径并显示
 * 3. 设置路径管线透明
 *    1). 根据弧线id，查找对应模型数据中的模型名称
 *    2). 根据模型名称设置这些模型透明
 * 4. 设置路径流向
 *    1). 根据弧线id，查找每段线的起始点和终点，长度等信息
 *    2). 根据每段线的信息，设置流向
 * 5. 显示路径阀门
 *    1). 在数据集中查找所有阀门id及位置信息
 *    2). 根据查找出的上下游id过滤处此条线路的阀门
 *    3). 显示过滤后的阀门
 * 6. 阀门交互
 *    1). 获取点击后阀门的id及开关状态
 *    2). 更新关闭阀门的id列表
 *    3). 通过所有关闭的阀门id查找共同上游
 *    4). 根据共同上游更新流向显示
 *    5). 根据共同上游更新爆管点显示
 * 7. 移除爆管点
 *    1). 若路径中有多出爆管，则只移除此爆管点的显示
 *    2). 若路径中只有此处爆管，则删除路径，恢复路径原本显示
 * 8. 关闭分析
 *    1). 移除所有爆管点
 *    2). 关闭分析数据源
 */

interface BreakPointInfo {
  pipeName: string
  edgeId: number
  breakPointId: number
  position: Vector3
}

const routes: BreakRoute[] = []

let _datasourceAlias = ''

function startPipeAnalysis(datasourcePath: string, datasourceAlias: string, datasetName: string, arLayerName: string) {
  layer.name = arLayerName
  _datasourceAlias = datasourceAlias
  SExhibition.setPipeAnalystParam({
    datasourceAlias: datasourceAlias,
    datasetName: datasetName
  })
  SFacilityAnalyst.load({
    alias: datasourceAlias,
    server: datasourcePath,
    engineType: EngineType.UDB,
  }, {
    networkDataset: datasetName,
  }).then(async result => {
    // console.log('load', result)
  }).catch(err => {
    console.log(err)
  })
}

function stopPipeAnalysis() {
  routes.map(route => {
    route.clear()
  })
  routes.splice(0)
  // todo close datasource
  // SMap.closeDatasource(_datasourceAlias)
}

async function addBreakPoint(point: BreakPointInfo) {

  //限制为同时显示一个爆管点
  if(routes.length > 0) {
    routes.map(route => {
      route.clear()
    })
    routes.splice(0)
  }

  //是否在已显示的路线中
  let isInExistRoute = false
  for(let i = 0; i < routes.length; i++) {
    if(routes[i].isSameRoute(point)) {
      routes[i].addBreakPoint(point)
      isInExistRoute = true
      break
    }
  }

  //没有则新建路线
  if(!isInExistRoute) {
    const ids = [point.edgeId]
    const upstreams = await SFacilityAnalyst.traceUpFromEdge(ids)
    const downstreams = await SFacilityAnalyst.traceDownFromEdge(ids)

    const pipeIds: number[] = []
    const nodeIds: number[] = []
    if(upstreams.length > 0) {
      upstreams[0].edges.map(id => {
        if(!pipeIds.includes(id)) {
          pipeIds.push(id)
        }
      })
      upstreams[0].nodes.map(id => {
        if(!nodeIds.includes(id)) {
          nodeIds.push(id)
        }
      })
    }
    if(downstreams.length > 0) {
      downstreams[0].edges.map(id => {
        if(!pipeIds.includes(id)) {
          pipeIds.push(id)
        }
      })
      downstreams[0].nodes.map(id => {
        if(!nodeIds.includes(id)) {
          nodeIds.push(id)
        }
      })
    }

    if(!pipeIds.includes(point.edgeId)) {
      pipeIds.push(point.edgeId)
    }


    const route = new BreakRoute({edgeIds: pipeIds, nodeIds, breakPoints: [point]})
    route.show()
    routes.push(route)
  }

}

async function removeBreakPoint(breakPointId: number) {
  for(let i = 0; i < routes.length; i++) {
    if(routes[i].isInRoute(breakPointId)) {
      if(routes[i].props.breakPoints.length > 1) {
        routes[i].removeBreakPoint(breakPointId)
      } else {
        routes[i].clear()
        routes.splice(i, 1)
      }
      break
    }
  }
}

async function onValvePress(id: number, isOpen: boolean) {
  for(let i = 0; i < routes.length; i++) {
    routes[i].onValvePress(id, isOpen)
  }
}

export default {
  startPipeAnalysis,
  stopPipeAnalysis,
  addBreakPoint,
  removeBreakPoint,
  onValvePress,
}

interface RouteProps {
  edgeIds: number[]
  nodeIds: number[]
  breakPoints: BreakPointInfo[]
}

const layer = {name: 'abc'}

class BreakRoute {

  props: RouteProps

  modelNames: string[] | undefined

  pipeInfos: (PipeInfo | undefined)[] | undefined

  valveInfos: ValveInfo[] | undefined

  /** 记录当前关闭的阀门id */
  closeValveIds: number[] = []

  /** 可流通的(上游)弧线 */
  availableEdges: number[] | undefined

  /** 可流通的(上游)节点 */
  availableNodes: number[] | undefined

  constructor(props: RouteProps) {
    this.props = props
  }

  /**
   * 判断爆管点所在路径是包含在本路径中
   */
  isSameRoute = (breakPoint: BreakPointInfo): boolean => {
    return this.props.edgeIds.includes(breakPoint.edgeId)
  }

  /**
   * 判断爆管点是否在本路径中
   */
  isInRoute = (breakPointId: number): boolean => {
    for(let i = 0; i < this.props.breakPoints.length; i++) {
      if(this.props.breakPoints[i].breakPointId === breakPointId) {
        return true
      }
    }

    return false
  }

  //显示爆管点
  //显示透明路径
  //显示流向
  //显示阀门
  show = () => {
    this._showBreakPoint()
    this._makeRouteTransparent()
    this._showFlow()
    this._showValve()
  }

  clear = () => {
    const breakPoints: {name: string}[] = []
    this.props.breakPoints.map(breakPoint => {
      breakPoints.push({name: breakPoint.breakPointId + ''})
    })
    SExhibition.hideBreakPoint(layer.name, breakPoints)

    this._makeRouteTransparent(false)

    SExhibition.hidePipeFlow()

    this._showValve(false)

  }

  //显示爆管点
  //更新流向箭头
  addBreakPoint = async (breakPoint: BreakPointInfo) => {
    this.props.breakPoints.push(breakPoint)
    this._showBreakPoint()
    this._showFlow()
  }

  removeBreakPoint = async (breakPointId: number) => {
    SExhibition.hideBreakPoint(layer.name, [{name:breakPointId + ''}])

    this.props.breakPoints.splice(
      this.props.breakPoints.findIndex(breakPoint => {
        return breakPoint.breakPointId === breakPointId
      }),
      1
    )
    this._showFlow()
  }

  onValvePress = async (id: number, isOpen: boolean) => {
    if(this.valveInfos === undefined || this.valveInfos.findIndex(item => item.id === id) < 0) return


    let valveChange = false
    if(isOpen) {
      if(this.closeValveIds.includes(id)) {
        valveChange = true
        this.closeValveIds.splice(this.closeValveIds.indexOf(id), 1)
      }
    } else {
      if(!this.closeValveIds.includes(id)) {
        valveChange = true
        this.closeValveIds.push(id)
      }
    }

    if(this.closeValveIds.length === 0) {
      this.availableEdges = undefined
      this.availableNodes = undefined

      this._showBreakPoint()
      this._showFlow()
    } else if(valveChange && this._isAvailableNode(id)) {
      this.availableEdges = []
      this.availableNodes = []

      const results = await SFacilityAnalyst.traceUpFromNode([...this.closeValveIds])

      if(results.length > 0) {
        //所有结果取交集
        this.availableEdges = [...results[0].edges]
        this.availableNodes = [...results[0].nodes]
        for(let i = 1; i < results.length; i++) {
          this.availableEdges = this.availableEdges?.filter(item => new Set(results[i].edges).has(item))
          this.availableNodes = this.availableNodes?.filter(item => new Set(results[i].nodes).has(item))
        }
      }

      this._showBreakPoint()
      this._showFlow()
    }
  }




  _showBreakPoint = () => {
    this.props.breakPoints.map(breakPoint => {
      if(this._isAvailableEdge(breakPoint.edgeId)) {
        SExhibition.showBreakPoint(layer.name, [{name: breakPoint.breakPointId + '', position: breakPoint.position}])
      } else {
        SExhibition.hideBreakPoint(layer.name, [{name: breakPoint.breakPointId + ''}])
      }
    })
  }

  _makeRouteTransparent = async (isTransparent = true) => {
    if(this.modelNames === undefined) {
      this.modelNames = await SExhibition.getPipeNameByEdgeId(this.props.edgeIds)
    }
    const seperateNames: string[] = []
    this.modelNames.map(name => {
      if(name.includes(',')) {
        const arr = name.split(',')
        seperateNames.push(...arr)
      } else {
        seperateNames.push(name)
      }
    })

    if(isTransparent) {
      SExhibition.makePipeMaterialTransparent(layer.name, seperateNames)
    } else {
      SExhibition.restorePipeMaterial(layer.name, seperateNames)
    }
  }

  _showFlow = async () => {
    if(this.pipeInfos === undefined) {
      this.pipeInfos = await SExhibition.getPipeInfoById(this.props.edgeIds)
    }
    await SExhibition.hidePipeFlow()

    const flowParam: FlowParam[] = []
    this.pipeInfos.map((info, index) => {
      const edgeId = this.props.edgeIds[index]
      if(info && this._isAvailableEdge(edgeId)) {
        flowParam.push({
          start: info.start,
          end: info.end,
          segment: parseInt(info.length + ''),
          speed: 0.5,
          runRange: 1,
          pose: info.isGround ? 0 : 1,
          arrow: this._isBreakPipe(edgeId) ? 4 : 3
        })
      }
    })

    SExhibition.showPipeFlow(layer.name, flowParam)
  }


  _showValve = async (isShow = true) => {
    if(this.valveInfos === undefined) {
      const valves = await SExhibition.getValveInfo()
      this.valveInfos = valves.filter(valve => {
        return this.props.nodeIds.includes(valve.id)
      })
    }

    const valveParams:{
      name: string,
      position: Vector3,
      rotation?: Vector3,
      scale: number,
      isOpen: boolean}[] = []

    this.valveInfos.map(valve => {
      valveParams.push({
        name: valve.id + '',
        position: valve.position,
        rotation: {
          x: 90,
          y: 0,
          z: 0,
        },
        scale: 1,
        isOpen: true
      })
    })

    if(isShow) {
      SExhibition.showValve(layer.name, valveParams)
    } else {
      SExhibition.hideValve(layer.name, valveParams)
    }

  }




  _isBreakPipe = (edgeId: number): boolean => {
    for(let i = 0; i < this.props.breakPoints.length; i++) {
      if(this.props.breakPoints[i].edgeId === edgeId) {
        return true
      }
    }

    return false
  }

  _isAvailableEdge = (edgeId: number): boolean => {
    if(this.availableEdges === undefined) return true

    for(let i = 0; i < this.availableEdges.length; i++) {
      if(this.availableEdges[i] === edgeId) {
        return true
      }
    }

    return false
  }

  _isAvailableNode = (nodeId: number): boolean => {
    if(this.availableNodes === undefined) return true

    for(let i = 0; i < this.availableNodes.length; i++) {
      if(this.availableNodes[i] === nodeId) {
        return true
      }
    }

    return false
  }
}


