/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React from 'react';
import { Button, Text, View } from 'react-native';
import { NavigationParams } from 'react-navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
interface Props extends NavigationParams {}
interface States {}

export default class Setting extends React.Component<Props,States> {
    constructor(props:Props) {
        super(props);
    }
    async logout(navigation:any) {
        console.log('Logout');
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
        await AsyncStorage.removeItem('email');
        await AsyncStorage.removeItem('password');
        await AsyncStorage.removeItem('uid');
    }
    render() {
        return (
            <View>
                <Text>Settings Screen</Text>
                <View style={{justifyContent:'flex-end', flexDirection:'column-reverse'}}>
                    <Button
                        onPress={()=>{this.logout(this.props.navigation);}}
                        title="Logout"
                        color="#33ff49"
                        accessibilityLabel="Learn more about this purple button" />
                </View>
            </View>
        );
    }
}
