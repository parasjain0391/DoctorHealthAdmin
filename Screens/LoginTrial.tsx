/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { NavigationParams } from 'react-navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
export default class LoginTrial extends React.Component<Props,States> {
    constructor(props: Props) {
        super(props);
        this.state = {
                email: '',
                password: '',
                uid: '',
        };
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
    // called when the login button is pressed
    login() {
        if ( this.state.email === '' || this.state.password === '' ){
            Alert.alert('Alert','Email and password field must not be empty!!!');
        } else {
            this.props.navigation.navigate('Loading',{email:this.state.email,password:this.state.password});
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
                            this.login();
                        }}
                    />
                </View>
            </View>
        );
    }
}
