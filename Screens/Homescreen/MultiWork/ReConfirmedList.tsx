/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
// @ts-ignore
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
import { ListItem, Button, Icon } from  'react-native-elements';
import database from '@react-native-firebase/database';
// All information from the server database is read, write and updated in this file


interface Props {
    navigation:any,
}
interface States {
    // Patient information in the server
    patients:any [],
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
      padding: 10,
    },
    button: {
        flex: 1,
        backgroundColor: 'white',
        paddingVertical: 0,
        paddingHorizontal: 17,
    },
    titleText: {
      fontSize: 22,
      textAlign: 'center',
      fontWeight: 'bold',
    },
    textStyle: {
      fontSize: 16,
      marginVertical: 10,
      color: '#33ff49',
    },
  });

export default class ReConfirmedList extends React.Component<Props,States> {
    uid:any
    _isMounted:boolean
    constructor(props: Props) {
        super(props);
        this.state = {
            patients: [],
        };
        this._isMounted = false;
    }
    async componentDidMount() {
        this._isMounted = true;
        this.loadOrders();
    }
    // get the work detail if changes are made in the database
    componentDidUpdate() {
        this._isMounted && this.loadOrders();
    }
    componentWillUnmount() {
        this._isMounted = false;
    }
    loadOrders(){
        database()
        .ref('/work/Order Confirmed/')
        .once('value')
        .then((snapshot) => {
            const patients:any = [];
            snapshot.forEach((doctor:any)=>{
                doctor.forEach((patient:any)=>{
                    var p = patient.val();
                    p.phoneNumber = patient.key;
                    patients.push(p);
                });
            });
            this.setState({ patients: patients });
          })
        .catch(err => {console.log(String(err));});
    }
    //UI element of the patient
    renderPatients() {
        return this.state.patients.map(patient =>{
            return <ListItem key={patient.phoneNumber}
                    onPress={() => {console.log(patient);}}
                    bottomDivider>
                    <ListItem.Content>
                        <ListItem.Title>{patient.phoneNumber}</ListItem.Title>
                    </ListItem.Content>
                    <Button
                        icon={
                            <Icon
                            name="ellipsis-v"
                            type="font-awesome"
                            size={22}
                        />}
                        buttonStyle={styles.button}
                        type="clear"
                        // Go to StatusUpdate page
                        onPress={()=> this.props.navigation.navigate('ReConfirmed Update',{patient})}
                    />
                    <Button
                        icon={
                            <Icon
                            name="call"
                            size={22}
                        />}
                        type="clear"
                        // Make direct call to the number
                        onPress={() => {RNImmediatePhoneCall.immediatePhoneCall(patient.phoneNumber);}}
                    />
                </ListItem>;
        });
    }
    render() {
        return (
            <View style={styles.container}>
                <ScrollView>
                    <View style={{flex:1, backgroundColor:'white'}}>{this.renderPatients()}</View>
                </ScrollView>
            </View>
        );
    }
}
