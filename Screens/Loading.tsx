/* eslint-disable prettier/prettier */

import React from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import { NavigationParams } from 'react-navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import database from '@react-native-firebase/database';
import { ActivityIndicator } from 'react-native-paper';
// the screen that handles the login

interface Props extends NavigationParams{
}
interface States {
        email:string,
        password:string,
        uid:string,
}

const styles = StyleSheet.create({
    body: {
        flex:1,
        justifyContent:'center',
        backgroundColor: '#f5fcff',
    },
    input: {
        flex:1,
        justifyContent:'center',
        alignContent:'center',
    },
    button: {
        flex:1,
    },
});
export default class Loading extends React.Component<Props,States> {
    constructor(props: Props) {
        super(props);
        this.state = {
                email: '',
                password: '',
                uid: '',
        };
        this.loginCheck();
    }
    // Store the email for presist login
    async setEmail(email:any) {
        await AsyncStorage.setItem('email',email);
        console.log('Set Email ' + email);
    }
    // Store the password for the persist login
    async setPassword(password:any) {
        await AsyncStorage.setItem('password',password);
        console.log('Password Set');
    }
    // Store the uid for further usage in the app by the other screens
    async setuid(uid:any) {
        await AsyncStorage.setItem('uid',uid);
        console.log('Set uid ' + uid);
    }
    // this check whether the user is already logged in
    async loginCheck() {
        const e:any = await AsyncStorage.getItem('email');
        const p:any = await AsyncStorage.getItem('password');
        const u:any = await AsyncStorage.getItem('uid');
        if (e === null) {
            console.log('No Login Found');
            if (this.props.route.params === undefined){
                console.log('Route Parameters are undefined');
                this.props.navigation.reset({
                    index: 0,
                    routes: [{ name: 'LoginTrial' }],
                });
            } else {
                const {email,password} = this.props.route.params;
                this.setState({ email:String(email.trim()), password : String(password)});
                this.loginHandler();
            }
        }
        else {
            // code runs if the
            this.setState({ email:String(e), password : String(p), uid : String(u) });
            this.loginHandler();
        }
    }
    //For any error in auhemtication this method is called to go back to the login page
    goToLogin(){
        this.props.navigation.reset({
            index: 0,
            routes: [{ name: 'LoginTrial' }],
        });
    }
    // When authorization is successful the following code is run to check the role of the user and navigate to Homescreen
    loginSuccess(UserCredential: any) {
        console.log(UserCredential);
        this.setState({uid:UserCredential.user.uid});
        database()
        .ref('/user/' + UserCredential.user.uid)
        .once('value')
        .then(snapshot => {
            const userdata = snapshot.val();
            if (userdata.role === 'Admin') {
                this.props.navigation.reset({
                    index: 0,
                    routes: [{ name: 'Homescreen' }],
                });
                this.setEmail(this.state.email.trim());
                this.setPassword(this.state.password);
                this.setuid(UserCredential.user.uid);
            } else {
                Alert.alert('Alert','User is not an admin',[{ text: 'OK', onPress: () => this.goToLogin() }]);
            }
        }).catch(err => {Alert.alert(String(err));});
    }
    // Called after login button is pressed and authenticate the user with the firebase and call the loginsuccess to handle after authorization
    loginHandler() {
        try {
            auth().signInWithEmailAndPassword(this.state.email.trim(), this.state.password)
            .then(UserCredential=>this.loginSuccess(UserCredential),(error:any)=>{
                if (error.code === 'auth/wrong-password') {
                    console.log('Password is incorrect!!!');
                    Alert.alert('Alert','Password is incorrect!!!',[{ text: 'OK', onPress: () => this.goToLogin() }]);
                } else if (error.code === 'auth/invalid-email') {
                    console.log('Email is incorrect!!!');
                    Alert.alert('Alert','Email is incorrect!!!',[{ text: 'OK', onPress: () => this.goToLogin() }]);
                } else if (error.code === 'auth/user-not-found'){
                    console.log('Email is incorrect!!!');
                    Alert.alert('Alert','Email is incorrect!!!',[{ text: 'OK', onPress: () => this.goToLogin() }]);
                } else {
                    console.log(String(error));
                    Alert.alert('Alert',String(error.code),[{ text: 'OK', onPress: () => this.goToLogin() }]);
                }
            });
        } catch (e:any) {
            console.log(e);
            Alert.alert('Alert','Login Problem!!!',[{ text: 'OK', onPress: () => this.goToLogin() }]);
        }
    }
    render() {
        return (
            <View style={styles.body}>
                <ActivityIndicator size="large" color="#00ff00" />
            </View>
        );
    }
}
