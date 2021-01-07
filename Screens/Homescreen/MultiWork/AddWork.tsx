/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { NavigationParams } from 'react-navigation';
import { Input, Button} from 'react-native-elements';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import database from '@react-native-firebase/database';
import moment from 'moment';
// @ts-ignore
import RadioButtonRN from 'radio-buttons-react-native';
// add new patient that is not in the calllog
// not working at the moment
interface Props extends NavigationParams{}
interface States {
    phoneNumber:string;
}
export default class AddWork extends React.Component<Props,States> {
    call:any
    workCategory:any
    constructor(props:Props){
        super(props);
        this.call = {
            'phoneNumber': '',
            'timestamp': new Date().getTime(),
            'rawType': '',
            'type': '',
            'duration': '',
            'name': '',
            'dateTime': moment().format('YYYY-MM-DD'),
        };
        this.state = {
            phoneNumber:'',
        };
        this.workCategory = '';
    }
    addPatient() {
        if (String(this.state.phoneNumber).length < 10)
        {
            Alert.alert('The Phone Number must be 10 digit number');
        } else if (this.workCategory === '') {
            Alert.alert('Please select a work category');
        } else {
            this.call.phoneNumber = this.state.phoneNumber;
            database()
            .ref('/allPatients/' + String(this.call.phoneNumber))
            .once('value')
            .then((snapshot) => {
            if (snapshot.exists())
            {
                Alert.alert(this.call.phoneNumber + ' is already assigned or added');
            }
            else {
                database()
                .ref('/allPatients/' + String(this.call.phoneNumber))
                .set(this.call.phoneNumber)
                .then(()=>{console.log(String(this.call.phoneNumber) + 'is added to allPatient');})
                .catch(err=>{console.log(String(err));});
                database()
                .ref('/work/' + String(this.workCategory) + '/' + String(this.call.phoneNumber))
                .set(this.call)
                .then(()=>{console.log(String(this.call.phoneNumber) + 'is added to ' + String(this.workCategory) + ' List');})
                .catch(err=>{console.log(String(err));});
                this.props.navigation.navigate('ListWork');
            }
            });
        }
    }
    render() {
        const data = [
            {
                label:'Unassigned',
            },
            {
                label:'Photos not done',
            },
            {
                label:'Photos done',
            },
            {
                label:'Facebook leads',
            },
      ];
        return (
            <View style={styles.body}>
            <View style={styles.radioButtonArea}>
                <Input
                        containerStyle= {{ marginVertical: 20}}
                        placeholder="Phone Number"
                        value={this.state.phoneNumber}
                        onChangeText={(text) => this.setState({ phoneNumber : text })} />
            </View>
            <View>
                <RadioButtonRN
                data={data}
                selectedBtn={(value:any) => {this.workCategory = value.label;}}
                animationTypes={['zoomIn']}
                duration={5}
                textStyle={styles.radioText}
                boxStyle={styles.radioText}
                />
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
                onPress={()=>{this.addPatient();}}
                title="Add Work"
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

