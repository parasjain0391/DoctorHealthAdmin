/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { ScrollView, View, StyleSheet, Text, Alert } from 'react-native';
import { NavigationParams } from 'react-navigation';
import { ListItem, Button } from 'react-native-elements';
import database from '@react-native-firebase/database';
// assign the patient to a doctor through this screen
const styles = StyleSheet.create({
    body: {
      backgroundColor: 'white',
      flex:1,
      justifyContent:'flex-end',
      fontSize:18,
    },
    buttonarea: {
        flexDirection:'row',
        justifyContent:'space-around',
        marginVertical:4,
        paddingHorizontal:10,

    },
    radioButtonArea: {
      fontSize: 24,
      fontWeight: '600',
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
        marginHorizontal:10,
        justifyContent:'center',
        alignSelf:'stretch',
    },
    buttontitle: {
        fontSize:20,
    },
  });



interface Props extends NavigationParams{}
interface States {
    doctors:any [];
}
export default class AssignWork extends React.Component<Props,States> {
    selectedDoctor:any;
    time:any;
    constructor(props:Props) {
        super(props);
        this.state = {
            doctors: [
                {'uid':'1','name':'Paras1'},
            ],
        };
        this.time = {'date':'','year':'','month':'','hours':'','min':'','sec':'' };
        this.selectedDoctor = {'name':'Not Selected','uid':''};
    }
    // Select the doctor is assigned to the variable and reflect it on the screen
    selectDoctor(doctor:any) {
        this.selectedDoctor = doctor;
        console.log(this.selectedDoctor.firstName + ' ' + this.selectedDoctor.lastName + ' is selected');
        this.forceUpdate();
    }
    // loaad the doctor information fromm the database and push it to local variable doctors
    componentDidMount() {
        database()
        .ref('/user')
        .once('value')
        .then((snapshot) => {
            const doctors:any = [];
            snapshot.forEach((item:any)=>{
                var i = item.val();
                i.uid = item.key;
                if (i.role === 0){
                    doctors.push(i);
                }
                console.log(i);
            });
            this.setState({ doctors: doctors });
            console.log(this.state.doctors);
          })
        .catch(err => {console.log(err);});
    }
    // the patient is assigned to the doctor and the databse is updated
    // After the assignment the sreen goes back to list work
    assignWork() {
        // Code for work Assignment
        console.log('Work Assigned');
        if (this.selectDoctor.name === 'Not Selected'){
            Alert.alert('Please select a doctor');
            return;
        } else {
            const {call} = this.props.route.params;
            this.time.date = new Date().getDate(); //Current Date
            this.time.month = new Date().getMonth() + 1; //Current Month
            this.time.year = new Date().getFullYear(); //Current Year
            this.time.hours = new Date().getHours(); //Current Hours
            this.time.min = new Date().getMinutes(); //Current Minutes
            this.time.sec = new Date().getSeconds(); //Current Seconds
            const assign = {
                'phoneNumber': call.phoneNumber,
                'timestamp': call.timestamp,
                'rawType': call.rawType,
                'type': call.type,
                'duration': call.duration,
                'name':call.name,
                'dateTime':call.dateTime,
                'assignTo': this.selectedDoctor.firstName + ' ' + this.selectedDoctor.lastName,
                'uid': this.selectedDoctor.uid,
                'status':'Pending',
                'assignedTime':this.time,
                'statusUpdateTime':null,
                'turnAroundTime':null,
            };
            console.log(assign);
            database()
            .ref('/work/' + assign.uid)
            .child(assign.phoneNumber)
            .set(assign);
            this.props.navigation.navigate('ListWork');
        }
    }
    // UI element of the doctors
    renderDoctor() {
        return this.state.doctors.map(doctor => {
          return <ListItem key={doctor.uid}
              onPress={()=> this.selectDoctor(doctor)}
              bottomDivider>
              <ListItem.Content>
              <ListItem.Title>{doctor.firstName} {doctor.lastName}</ListItem.Title>
              <ListItem.Subtitle>Doctor</ListItem.Subtitle>
              </ListItem.Content>
            </ListItem>;
        });
      }
    render() {
        return (
            <View style={styles.body}>
                <ScrollView>
                    {this.renderDoctor()}
                </ScrollView>
                <Text style={{fontSize:18, marginHorizontal:60}}>Selected Doctor: {this.selectedDoctor.firstName} {this.selectedDoctor.lastName}</Text>
                <View style={styles.buttonarea}>
                <Button
                    // cancel the work assignment and go back
                    onPress={()=>{this.props.navigation.navigate('ListWork');}}
                    title="Cancel"
                    type="solid"
                    buttonStyle={styles.button}
                />
                <Button
                    // assign the work
                    onPress={()=>{this.assignWork();}}
                    title="Assign"
                    type="solid"
                    buttonStyle={styles.button}
                />
                </View>
            </View>
        );
    }
}
