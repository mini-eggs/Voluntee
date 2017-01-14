import React from 'react'
import {Image} from 'react-native'
import {Scene,Router,Actions} from 'react-native-router-flux'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

import AccountComp from './comps/account/account'
import BagdeComp from './comps/badges/badges'
import CreateMessageComp from './comps/createMessage/createMessage'
import MessageComp from './comps/message/message'
import SingleMessageComp from './comps/singleMessage/singleMessage'
import SavedComp from './comps/saved/saved'
import EventComp from './comps/event/event'
import ItemComp from './comps/items/items'
import MapComp from './comps/map/map'
import ShareComp from './comps/share/share'
import SingleShareComp from './comps/share/single'
import CreateShareComp from './comps/createShare/createShare'
import ForgotPasswordComp from './comps/forgotPassword/forgotPassword'

import MapIcon from './assets/img/map.png'
import CreateIcon from './assets/img/create.png'
import PlaceMapIcon from './assets/img/place.png'
import InboxIcon from './assets/img/inbox.png'
import BackIcon from './assets/img/back.png'
import CheckIcon from './assets/img/check.png'
import SendIcon from './assets/img/send.png'
import MoreIcon from './assets/img/more.png'
import InfoIcon from './assets/img/info.png'
import {style} from './style'

const logo = 'https://i.imgur.com/f1NfVRM.png'

const headerLogo = <Image resizeMode={'contain'} style={style.titleImage} source={{uri:logo}} />

const leftMap = {
  leftButtonImage: MapIcon,
  leftButtonIconStyle: style.icon,
  onLeft: event => Actions.ViewEventsOnMap()
}

const leftCreate = {
  leftButtonImage: CreateIcon,
  leftButtonIconStyle: style.icon,
  onLeft: event => Actions.CreateShare()
}

const rightInbox = {
  rightButtonImage: InboxIcon,
  rightButtonIconStyle: style.icon,
  onRight: event => Actions.MessageComp()
}

const rightPlaceMap = {
  rightButtonImage: PlaceMapIcon,
  rightButtonIconStyle: style.icon,
  onRight: event => Actions.ViewSingleEventOnMap()
}

const defaultScene = {
  titleStyle: style.title,
  navigationBarStyle: style.navbar,
  // title:headerLogo,
  type: 'reset'
}

const defaultBackScene = {
  titleStyle: style.title,
  navigationBarStyle: style.navbar,
  // title:headerLogo,
  type: 'push',
  leftButtonIconStyle: {
    tintColor: "#fff"
  }
}

const forceRefreshOnBack = {
  onBack: () => Actions.popRefresh()
}

const rightCreateShareButton = {
  rightButtonImage: CheckIcon,
  rightButtonIconStyle: style.icon,
  onRight: () => Actions.submitSharePostRightButton()
}

const rightCreateMessageButton = {
  rightButtonImage: CheckIcon,
  rightButtonIconStyle: style.icon,
  onRight: () => Actions.submitMessageRightButton()
}

const rightMoreOptionsButton = {
  rightButtonImage: InfoIcon,
  rightButtonIconStyle: style.icon,
  onRight: () => Actions.moreOptionsRightButton()
}

const Routes = props => {
  return (
    <Router>
      <Scene key="root">
        <Scene title="Discover" key="Discover" {...leftMap} {...rightInbox} {...defaultScene} component={ItemComp} initial />
        <Scene title="Forgot Password" key="ForgotPassword" {...defaultBackScene} component={ForgotPasswordComp} />
        <Scene title="Saved" key="Saved" {...leftMap} {...rightInbox} {...defaultScene} component={SavedComp} />
        <Scene title="Badges" key="Badges" {...rightInbox} {...defaultScene} component={BagdeComp} />
        <Scene title="Share" key="Share" {...leftCreate} {...rightInbox} {...defaultScene} component={ShareComp} />
        <Scene title="Post" key="CreateShare" {...rightCreateShareButton} {...defaultBackScene} component={CreateShareComp} />
        <Scene title="Title Here" key="SingleShare" {...defaultBackScene} {...rightMoreOptionsButton} component={SingleShareComp} />
        <Scene title="Single Event Title Here"  key="SingleEvent" {...rightPlaceMap} {...defaultBackScene} {...forceRefreshOnBack} component={EventComp} />
        <Scene title="Message" key="CreateMessage" {...rightCreateMessageButton} {...defaultBackScene} {...forceRefreshOnBack} component={CreateMessageComp} />
        <Scene title="Messages" key="MessageComp" {...defaultScene} {...defaultBackScene} {...forceRefreshOnBack} component={MessageComp} />
        <Scene title="SingleMessage" key="SingleMessageComp" {...defaultScene} {...defaultBackScene} {...forceRefreshOnBack} {...rightMoreOptionsButton} component={SingleMessageComp} />
        <Scene title="Map Comp Title Here" key="MapComp" {...defaultBackScene} {...forceRefreshOnBack} component={MapComp} />
        <Scene title="Account" key="Account" {...rightInbox} {...defaultScene} component={AccountComp} />
      </Scene>
    </Router>
  )
}

export default Routes





