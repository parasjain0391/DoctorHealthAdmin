/* eslint-disable prettier/prettier */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationParams } from 'react-navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FAB } from 'react-native-paper';
// screen that is only used to logout for now
interface Props extends NavigationParams {}
interface States {}

export default class Options extends React.Component<Props,States> {
    call:any;
    constructor(props:Props) {
        super(props);
    }
    // delete the email, password and uid from the phone storage
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
            <View style={styles.container}>
                <FAB
                style={styles.fab}
                label="Overall Report"
                icon="clipboard-text"
                onPress={()=>{this.props.navigation.navigate('Overall Report');}}
                />
                <FAB
                style={styles.fab}
                label="Reconfirm Order"
                icon="clipboard-text"
                onPress={() => {this.props.navigation.navigate('ReConfirmed List');}}
                />
                <FAB
                style={styles.fab}
                label="Import numbers from CSV file"
                icon="clipboard-text"
                onPress={()=>{this.props.navigation.navigate('SelectImportList');}}
                />
                <FAB
                style={styles.fab}
                label="Logout"
                icon="clipboard-text"
                onPress={()=>{this.logout(this.props.navigation);}}
                />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    try: {
        alignSelf:'center',
        backgroundColor:'#33ff49',
    },
    fab: {
        alignSelf:'center',
        backgroundColor:'#33ff49',
        marginVertical:20,
    },
    fab2: {
        alignSelf:'flex-end',
        position:'absolute',
        bottom:110,
        right:80,
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 10,
    },
});
