import React from 'react'
import { color } from '../../../../../styles'
import { scaleSize, setSpText, screen } from '../../../../../utils'
import { ToolbarType } from '../../../../../constants'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import ToolbarTableList from './ToolbarTableList'

export default class ToolbarArMeasure extends React.Component {
    props: {
        type: string,
        containerType: string,
        language: string,
        column?: number,
        row?: number,
        device: Object,
        data: Array,
        secdata: Array,
        getMenuAlertDialogRef: () => {},
        getToolbarModule: () => {},
    }


    renderItems = () => {
        let items = []
        for (let i = 0; i < this.props.secdata.length; i++) {
            items.push(this.renderItem(this.props.secdata[i]))
        }
        return items
    }

    renderItem = (item) => {
        return (
            <View
                style={{
                    width: screen.getScreenWidth(this.props.device.orientation) / 4,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >

                <TouchableOpacity
                    style={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    onPress={item.action}
                >
                    <View
                        style={{
                            borderRadius: scaleSize(35),
                            backgroundColor: '#E5E5E6',
                            height: scaleSize(70),
                            width: scaleSize(70),
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Image
                            resizeMode={'contain'}
                            style={{
                                height: scaleSize(50),
                                width: scaleSize(50)
                            }}
                            source={item.image}
                        />
                    </View>

                    <Text
                        style={[
                            {
                                marginTop: scaleSize(5),
                                color: color.font_color_white,
                                fontSize: setSpText(18),
                                backgroundColor: 'transparent',
                                textAlign: 'center',
                            },
                        ]}
                    >
                        {item.title}
                    </Text>

                </TouchableOpacity>
            </View>
        )
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <View
                    style={{
                        flexDirection: 'row',
                        width: '100%',
                        height: scaleSize(120),
                        backgroundColor: color.white,
                        alignItems: 'center',
                    }}
                >
                    {this.renderItems()}
                </View>

                {/* <View style={{ width: '100%', height: scaleSize(2), backgroundColor: '#E5E5E6' }} /> */}

                <ToolbarTableList
                    data={this.props.data}
                    type={this.props.type}
                    containerType={ToolbarType.table}
                    column={this.props.column}
                    row={this.props.row}
                    device={this.props.device}
                    language={this.props.language}
                    getToolbarModule={this.props.getToolbarModule}
                />
            </View>

        )
    }
}
