/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-community/picker';
import { Input, Button } from 'react-native-elements';
import { NavigationParams } from 'react-navigation';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

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
    },
});
interface Props extends NavigationParams {}
interface States {
    email:string,
    password:string,
    firstName:string,
    lastName:string,
    role:number;
}
export default class AddDoctor extends React.Component<Props,States> {
    constructor(props:Props) {
        super(props);
        this.state = {
            firstName:'',
            lastName:'',
            password:'',
            email:'',
            role:-1,
        };
    }
    // update the new user information to the database
    updateDatabase(UserCredential:any) {
        const user:any = {};
        user.firstName = this.state.firstName;
        user.lastName = this.state.lastName;
        user.email = this.state.email;
        user.role = this.state.role;
        database()
        .ref('/user/' + UserCredential.user.uid)
        .set(user)
        .catch(err=>{console.log(String(err));});
    }
    // create new user in the firebase and add the information to the database.
    createUser() {
        auth()
        .createUserWithEmailAndPassword(this.state.email.trim(), this.state.password)
        .then(() => {
            console.log('User account created');
            auth().signInWithEmailAndPassword(this.state.email.trim(), this.state.password)
            .then(UserCredential=>this.updateDatabase(UserCredential),(err:any)=>{Alert.alert(String(err));});
            this.props.navigation.navigate('ListDoctor');
        })
        .catch(error => {
            if (error.code === 'auth/email-already-in-use') {
                console.log('That email address is already in use!');
                Alert.alert('That email address is already in use!');
            } else if (error.code === 'auth/invalid-email') {
                console.log('That email address is invalid!');
                Alert.alert('That email address is invalid!');
            } else {
                console.log(String(error));
                Alert.alert(String(error.code));
            }
        });

    }
    render() {
        return (
            <View style={styles.body}>
                <View style={styles.button}>
                    <Input
                        containerStyle= {{ marginVertical: 10}}
                        placeholder="First Name"
                        value={this.state.firstName}
                        onChangeText={(text) => this.setState({ firstName : text })} />
                    <Input
                        containerStyle= {{ marginVertical: 10}}
                        placeholder="Last Name"
                        value={this.state.lastName}
                        onChangeText={(text) => this.setState({ lastName : text })} />
                    <Input
                        containerStyle= {{ marginVertical: 10}}
                        placeholder="E-mail"
                        value={this.state.email}
                        leftIcon={{ type:'font-awesome', name:'envelope'}}
                        onChangeText={(text) => this.setState({ email : text })} />
                    <Input
                        containerStyle= {{ marginVertical: 10}}
                        secureTextEntry={true}
                        placeholder="Password"
                        value={this.state.password}
                        leftIcon={{ type:'font-awesome', name:'key'}}
                        onChangeText={(text) => this.setState({ password : text })} />
                    <Picker
                        selectedValue={this.state.role}
                        style={{ height: 50 }}
                        onValueChange={(itemValue:any) => this.setState({role:itemValue})}
                    >
                        <Picker.Item label="Doctor" value="Doctor" />
                        <Picker.Item label="Admin" value="Admin" />
                        <Picker.Item label="NA Handler" value="NA Handler" />
                        <Picker.Item label="Price Negotiator" value="Price Negotiator" />
                   </Picker>
                </View>
                <View style={styles.button}>
                    <Button
                        title="Create User"
                        buttonStyle={{ backgroundColor:'#33ff49' }}
                        containerStyle={{ margin:10 }}
                        // start the create user process
                        onPress={() => {
                            this.createUser();
                        }}
                    />
                </View>
            </View>
        );
    }
}
