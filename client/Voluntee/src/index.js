import React from 'react'
import {StatusBar,AsyncStorage} from 'react-native'
import {COLOR,ThemeProvider} from 'react-native-material-ui'
import * as firebase from 'firebase'
import Storage from 'react-native-storage'
import {Actions} from 'react-native-router-flux'
import codePush from 'react-native-code-push'

import {lightGreen, darkGreen} from './general/general'
import {startLocalStorage,getLoginStatusFromLocalStorage,saveLoginStateToLocalStorage} from './general/localStorage'
import {initializeFirebase,login} from './general/firebase'
import {style} from './style'
import Routes from './routes'

const checkLoginStatusThenLogin = props => {
    Actions.user = null
    getLoginStatusFromLocalStorage()
        .then( user => 
            login(user)
                .then( firebaseUser => {
                    Actions.user = user
                    saveLoginStateToLocalStorage(user)
                    if(typeof Actions.changeUser == 'function')
                        Actions.changeUser()
                })
        )
        .catch( err => console.log('No user is signed in.'))
}

/* INITIALIZE FUTURE FUNCTIONS */
// Actions.changeUser - account.js
// Actions.changeModal - modal.js
// Actions.showModal - modal.js
// Actions.hideModal - modal.js
// Actions.reloadShareComponent -  share.js
// Actions.submitSharePostRightButton - form.js
// Actions.ViewSingleEventOnMap -  event.js
// Actions.ViewEventsOnMap - items.js + saved.js
// Actions.ActionSheet - actionSheet.js
// Actions.firebaseDatabase - firebase.js
// Actions.moreOptionsRightButton - singleMessage.js
// Actions.badgeModal - badgeModal.js

/* ENABLE POP AND REFRESH */
Actions.popRefresh = event => Actions.pop({refresh:{time:new Date().getTime()}})

/* DISABLE WARNINGS */
console.disableYellowBox = true

/* INITIALIZE STATUS BAR */
StatusBar.setBarStyle( 'light-content', true )
StatusBar.setBackgroundColor( lightGreen )

/* INITIALIZE FIREBASE WITH ACTIONS */
initializeFirebase()
 
/* INITIALIZE LOCAL STORAGE WITH ACTIONS */
startLocalStorage()

/* INITIALIZE USER STATE WITH LOCAL STORAGE THEN LOGIN VIA FIREBASE */
checkLoginStatusThenLogin()

/* INITIALIZE THEME */
const uiTheme = {
    palette: {
        primaryColor: lightGreen
    }
};

const Voluntee = props => {
    return (
        <ThemeProvider uiTheme={uiTheme}>
            <Routes />
        </ThemeProvider>
    )
}

/* CODEPUSH COMPONENT */

const codePushOptions = {checkFrequency: codePush.CheckFrequency.ON_APP_RESUME}

class CodePush extends React.Component {

  async componentDidMount() {
    codePush.sync({
            updateDialog: true,
            installMode: codePush.InstallMode.IMMEDIATE
        })
  }

  render() {
    return (
      <Voluntee/>
    )
  }
}

const appBundle = codePush(codePushOptions)(CodePush)

export default appBundle






