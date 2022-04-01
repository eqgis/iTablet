import {Component} from 'react'

let TaskProcessref: Component = null

let getTaskProcessComponentRef = () => {
    return TaskProcessref
}

let setTaskProcessComponentRef = (ref:Component) => {
    TaskProcessref = ref
}

export default {
    getTaskProcessComponentRef,
    setTaskProcessComponentRef,
}