import React, { Component } from 'react'
import { Text, Platform } from 'react-native'

const sourceRender = Text.render
Text.render = function render(props, ref) {
  return sourceRender.apply(this, [
    {
      ...props,
      style: [Platform.OS === 'android' && { fontFamily: '' }, props.style],
    },
    ref,
  ])
}
