/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { Input, Button } from 'react-native-elements';
import auth from '@react-native-firebase/auth';
import { NavigationParams } from 'react-navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import database from '@react-native-firebase/database';
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
export default class Login extends React.Component<Props,States> {
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
    // thsi check whether the user is already logged in
    async loginCheck() {
        const e:any = await AsyncStorage.getItem('email');
        const p:any = await AsyncStorage.getItem('password');
        const u:any = await AsyncStorage.getItem('uid');
        if (e === null) {
            console.log('No Login Found');
            return;
        }
        else {
            this.setState({ email:String(e), password : String(p), uid : String(u) });
            this.loginHandler();
        }
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
                Alert.alert('User is not an admin');
            }
        }).catch(err => {Alert.alert(String(err));});
    }
    // Called after login button is pressed and authenticate the user with the firebase and call the loginsuccess to handle after authorization
    loginHandler() {
        try {
            console.log('Login Button pressed');
            auth().signInWithEmailAndPassword(this.state.email.trim(), this.state.password)
            .then(UserCredential=>this.loginSuccess(UserCredential),(error:any)=>{
                if (error.code === 'auth/wrong-password') {
                    console.log('Password is incorrect!!!');
                    Alert.alert('Password is incorrect!!!');
                }
                if (error.code === 'auth/invalid-email') {
                    console.log('Email is incorrect!!!');
                    Alert.alert('Email is incorrect!!!');
                }
            });
        } catch (e:any) {
            console.log(e);
            Alert.alert('Login Problem!!!');
        }
    }
    render() {
        return (
            <View style={styles.body}>
                <View style={styles.button}>
                    <Input
                        containerStyle= {{ marginVertical: 10}}
                        placeholder="E-mail"
                        value={this.state.email}
                        leftIcon={{ type:'font-awesome', name:'envelope'}}
                        onChangeText={(text) => this.setState({ email : text })} />
                    <Input
                        secureTextEntry={true}
                        placeholder="Password"
                        value={this.state.password}
                        leftIcon={{ type:'font-awesome', name:'key'}}
                        onChangeText={(text) => this.setState({ password : text })} />
                </View>
                <View style={styles.button}>
                    <Button
                        title="Login"
                        buttonStyle={{ backgroundColor:'#33ff49' }}
                        containerStyle={{ margin:10 }}
                        onPress={() => {
                            this.loginHandler();
                        }}
                    />
                </View>
            </View>
        );
    }
}
