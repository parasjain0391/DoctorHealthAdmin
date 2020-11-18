/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { NavigationParams } from 'react-navigation';
import { Input, Button} from 'react-native-elements';
import {Colors} from 'react-native/Libraries/NewAppScreen';
// add new patient that is not in the calllog
// not working at the moment
interface Props extends NavigationParams{}
interface States {
    phoneNumber:string;
}
export default class AddWork extends React.Component<Props,States> {
    call:any
    constructor(props:Props){
        super(props);
        this.call = {
            'phoneNumber': '',
            'timestamp': '',
            'rawType': '',
            'type': '',
            'duration': '',
            'name': '',
            'dateTime': '',
        };
        this.state = {
            phoneNumber:'',
        };
    }
    assignAddedPatient() {
        if (String(this.state.phoneNumber).length < 10)
        {
            Alert.alert('The Phone Number must be 10 digit number');
        } else {
        this.call.phoneNumber = this.state.phoneNumber;
        this.props.navigation.navigate('AssignWork',{call:this.call});
        }
    }
    render() {
        return (
            <View style={styles.body}>
            <View style={styles.radioButtonArea}>
                <Input
                        containerStyle= {{ marginVertical: 10}}
                        placeholder="Phone Number"
                        value={this.state.phoneNumber}
                        onChangeText={(text) => this.setState({ phoneNumber : text })} />
            </View>
            <View style={styles.buttonarea}>
            <Button
                onPress={()=>{this.props.navigation.navigate('ListWork');}}
                title="Cancel"
                type="outline"
                buttonStyle={styles.button}
                titleStyle={styles.buttontitle}
            />
            <Button
                onPress={()=>{this.assignAddedPatient();}}
                title="Assign"
                type="outline"
                buttonStyle={styles.button}
                titleStyle={styles.buttontitle}
            />
            </View>
        </View>
        );
    }
}
const styles = StyleSheet.create({
    body: {
      backgroundColor: Colors.white,
      justifyContent:'space-around',
      flex:1,
    },
    buttonarea: {
        flex:1,
        flexDirection:'row',
        justifyContent:'space-around',
        alignContent:'center',
        alignItems:'center',
    },
    radioButtonArea: {
      fontSize: 24,
      fontWeight: '600',
      color: Colors.black,
      justifyContent:'center',
      alignContent:'center',
    },
    radioText: {
        fontSize:18,
        fontWeight: '600',
        marginVertical:10,
    },
    radioBox: {
        marginHorizontal:20,
    },
    button: {
        marginVertical:10,
        marginHorizontal:20,
        paddingVertical:10,
        paddingHorizontal:20,
    },
    buttontitle: {
        fontSize:20,
    },
  });

