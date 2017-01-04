import React from 'react'
import { View, Text, Image, TouchableHighlight } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { screenArea, screenWidth, defaultBackgroundColor } from '../../general/general'
import * as _ from 'lodash'

const margin = 20

const style = {
  background: {
    backgroundColor: defaultBackgroundColor,
    minHeight: screenArea
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  item: {
    height: screenArea/3 - margin * 2,
    width: screenWidth/2 - margin * 2,
    margin: margin
  }
}

const ListComp = props => {

  // @props
  // earnedBadges
  // nonEarnedBadges
  // @

  let badges = []
  props.earnedBadges.forEach( badge => badges.push({ badge: badge, status: 'earned' }))
  // props.nonEarnedBadges.forEach( badge => badges.push({ badge: badge, status: 'nonEarned' }))

  let columns = new Array( Math.ceil( badges.length / 2 ) ).fill(0)
  columns = columns.map( (column, index) => {
    let columnData = []
    if( badges[ index * 2 ] ) {
      columnData.push( badges[ index * 2 ] )
    }
    if( badges[ (index * 2) + 1 ] ) {
      columnData.push( badges[ (index * 2) + 1 ] )
    }

    return columnData
  })

  return (
    <View style={style.background}>
      {
        columns.map( (column, xindex) => {
          return (
            <View key={xindex} style={style.container}>
              {
                column.map( (item, index) => {

                  const earnedAttributes = {
                    onPress: () => { Actions.badgeModal({ badges: [ item.badge ] }) }
                  }

                  const nonEarnedAttributes = {
                    onPress: () => {
                      Actions.modal({
                        header: 'Woah!',
                        message: 'This badge has not been earned yet.'
                      })
                    }
                  }

                  const attributes = item.status === 'earned' ? earnedAttributes : nonEarnedAttributes

                  return (
                    <TouchableHighlight underlayColor={defaultBackgroundColor} {...attributes} key={index}>
                      <Image
                        style={style.item} 
                        resizeMode="contain"
                        source={{uri: item.badge.image}}
                      />
                    </TouchableHighlight>
                  )
                })
              }
            </View>
          )
        })
      }
    </View>
  )
}

export default ListComp