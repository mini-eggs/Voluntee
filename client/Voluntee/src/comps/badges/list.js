import React from 'react'
import { View, Text } from 'react-native'
import { Actions } from 'react-native-router-flux'

const ListComp = props => {

  // @props
  // earnedBadges
  // nonEarnedBadges
  // @

  const earned = props.earnedBadges
  const nonEarned = props.nonEarnedBadges

  return (
    <View>
      <Text>Earned</Text>
      {
        earned.map( (badge, index) => {
          return (
            <View key={index}>
              <Text>{badge.title}</Text>
            </View>
          )
        })
      }
      <Text>Not Earned</Text>
      {
        nonEarned.map( (badge, index) => {
          return (
            <View key={index}>
              <Text>{badge.title}</Text>
            </View>
          )
        })
      }
    </View>
  )
}

export default ListComp