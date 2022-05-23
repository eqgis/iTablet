
import React from "react"
import ToolBarContainer, { ToolbarProps } from "./ToolbarContainer"
import ToolbarModule, { ModuleProps } from "./ToolbarModule"

interface TypedToolBar<ParamList> {
  Container: React.ComponentType<ToolbarProps<ParamList>>
  Module: React.ComponentType<ModuleProps<ParamList>>
}

export default function createToolbar<ParamList>():TypedToolBar<ParamList> {

  return {
    Container: ToolBarContainer,
    Module: ToolbarModule
  }
}
