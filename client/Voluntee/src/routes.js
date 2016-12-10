
import React from 'react'
import {Image} from 'react-native'
import {Scene,Router,Actions} from 'react-native-router-flux'

import AccountComp from './comps/account/account'
import BagdeComp from './comps/badges/badges'
import SavedComp from './comps/saved/saved'
import EventComp from './comps/event/event'
import ItemComp from './comps/items/items'
import MapComp from './comps/map/map'
import ShareComp from './comps/share/share'
import SingleShareComp from './comps/share/single'
import CreateShareComp from './comps/createShare/createShare'
import MapIcon from './assets/img/map.png'
import CreateIcon from './assets/img/create.png'
import PlaceMapIcon from './assets/img/place.png'
import InboxIcon from './assets/img/inbox.png'
import BackIcon from './assets/img/back.png'
import CheckIcon from './assets/img/check.png'
import {style} from './style'

/* INITIALIZE BRANDING */
const logo = 'https://i.imgur.com/f1NfVRM.png'
const headerLogo = <Image resizeMode={'contain'} style={style.titleImage} source={{uri:logo}} />

/* INITIALIZE DEFAULT FOR ACTION BAR */
const leftMap = {
    leftButtonImage:MapIcon,
    leftButtonIconStyle:style.icon,
    onLeft: event => Actions.ViewEventsOnMap()
}

const leftCreate = {
    leftButtonImage:CreateIcon,
    leftButtonIconStyle:style.icon,
    onLeft: event => Actions.CreateShare()
}

const rightInbox = {
    rightButtonImage:InboxIcon,
    rightButtonIconStyle:style.icon,
    onRight: event => {
        Actions.changeModal({
            header: 'Development',
            message: 'This feature has not yet been implemented'
        })
        Actions.showModal()
    }
}

const rightPlaceMap = {
    rightButtonImage:PlaceMapIcon,
    rightButtonIconStyle:style.icon,
    onRight: event => Actions.ViewSingleEventOnMap()
}

const defaultScene = {
    titleStyle:style.title,
    navigationBarStyle:style.navbar,
    // title:headerLogo,
    type:'reset'
}

const defaultBackScene = {
    titleStyle:style.title,
    navigationBarStyle:style.navbar,
    // title:headerLogo,
    type:'push',
    leftButtonIconStyle:{tintColor:"#fff"}
}

const forceRefreshOnBack = {
    onBack: () => { Actions.pop({refresh:{time:new Date().getTime()}}) }
}

const rightCreateShareButton = {
    rightButtonImage:CheckIcon,
    rightButtonIconStyle:style.icon,
    onRight: event => { Actions.submitSharePostRightButton(event) }
}

const Routes = props => <Router>
		<Scene key="root">
			<Scene title="Discover" key="Discover" {...leftMap} {...rightInbox} {...defaultScene} component={ItemComp} initial />
			<Scene title="Saved" key="Saved" {...leftMap} {...rightInbox} {...defaultScene} component={SavedComp} />
			<Scene title="Badges" key="Badges" {...rightInbox} {...defaultScene} component={BagdeComp} />
            <Scene title="Share" key="Share" {...leftCreate} {...rightInbox} {...defaultScene} component={ShareComp} />
            <Scene title="Post" key="CreateShare" {...rightCreateShareButton} {...defaultBackScene} component={CreateShareComp} />
            <Scene title="Title Here" key="SingleShare" {...defaultBackScene} component={SingleShareComp} />
            <Scene title="Single Event Title Here" key="SingleEvent" {...rightPlaceMap} {...defaultBackScene} {...forceRefreshOnBack} component={EventComp} />
            <Scene title="Map Comp Title Here" key="MapComp" {...defaultBackScene} {...forceRefreshOnBack} component={MapComp} />
			<Scene title="Account" key="Account" {...rightInbox} {...defaultScene} component={AccountComp} />
		</Scene>
	</Router>
export default Routes