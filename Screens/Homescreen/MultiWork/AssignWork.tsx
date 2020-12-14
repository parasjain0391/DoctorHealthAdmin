/* eslint-disable prettier/prettier */
/* eslint-disable no-trailing-spaces */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { ScrollView, View, StyleSheet, Text, Alert } from 'react-native';
import { NavigationParams } from 'react-navigation';
import { ListItem, Button } from 'react-native-elements';
import database from '@react-native-firebase/database';
import moment from 'moment';
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
    _isMounted:any;
    ref:any;
    constructor(props:Props) {
        super(props);
        this.state = {
            doctors: [
                {'uid':'1','name':'Paras1'},
            ],
        };
        this.ref = database().ref('/user');
        this._isMounted = false;
        this.selectedDoctor = {'firstName':'Not','lastName':'Selected','uid':''};
    }
    // loaad the doctor information fromm the database and push it to local variable doctors
    componentDidMount() {
        this._isMounted = true;
        this._isMounted && this.ref
        .once('value')
        .then((snapshot:any)=>{this.loadDoctor(snapshot);})
        .catch((err:any)=>{console.log(String(err));});
        this.ref
        .on('value',(snapshot:any)=>{this.loadDoctor(snapshot);});
    }
    componentWillUnmount(){
        this._isMounted = false;
        this.ref.off();
    }
    loadDoctor(snapshot:any){
        const doctors:any = [];
        snapshot.forEach((item:any)=>{
            var i = item.val();
            i.uid = item.key;
            if (i.role !== 'Admin'){
                doctors.push(i);
            }
        });
        this.setState({ doctors: doctors });
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
                    onPress={()=>{this._isMounted && this.assignMultipleWork();}}
                    title="Assign"
                    type="solid"
                    buttonStyle={styles.button}
                />
                </View>
            </View>
        );
    }
    // UI element of the doctors
    renderDoctor() {
        return this.state.doctors.map(doctor => {
          return <ListItem key={doctor.uid}
              onPress={()=> this.selectDoctor(doctor)}
              bottomDivider>
              <ListItem.Content>
              <ListItem.Title>{doctor.firstName} {doctor.lastName}</ListItem.Title>
              <ListItem.Subtitle>{doctor.role}</ListItem.Subtitle>
              </ListItem.Content>
            </ListItem>;
        });
    }
    // Select the doctor is assigned to the variable and reflect it on the screen
    selectDoctor(doctor:any) {
        this.selectedDoctor = doctor;
        console.log(this.selectedDoctor.firstName + ' ' + this.selectedDoctor.lastName + ' is selected');
        this.forceUpdate();
    }
    // the patient is assigned to the doctor and the database is updated
    // After the assignment the sreen goes back to list work
    assignMultipleWork() {
        if (this.selectedDoctor.firstName === 'Not' && this.selectedDoctor.lastName === 'Selected' ){
            Alert.alert('Please select a doctor');
            return;
        } else {
            const {calls} = this.props.route.params;
            var i:number = 0;
            calls.forEach((call:any) => {
                this.assignWork(call);
                i++;
            });
            this.updatePerformance(this.selectedDoctor.uid,i);
            this.props.navigation.navigate('ListWork');
        }
    }
    assignWork(call:any) {
        const assign = {
            'phoneNumber': call.phoneNumber,
            'doctoruid': this.selectedDoctor.uid,
            'statusUpdateDate':moment().format('YYYY-MM-DD'),
            'status':'Pending',
            'timeSpent':0,
            'callsMade':0,
            'assignedTo': this.selectedDoctor.firstName + ' ' + this.selectedDoctor.lastName,
            'timestamp': moment().unix(),            
        };
        console.log(assign);
        database()
        .ref('/work/Pending/' + String(assign.doctoruid))
        .child(String(assign.phoneNumber))
        .set(assign)
        .catch((err)=>{console.log('/work/Pending/' + String(err));});
        database()
        .ref('/work/unassignedWork/' + String(assign.phoneNumber))
        .set(null)
        .catch((err)=>{console.log('/work/unassignedWork/' + String(err));});
    }
    updatePerformance(uid:any,i:number){
        database()
        .ref('/doctorPerformance/' + String(uid))
        .child('Pending')
        .once('value')
        .then((snapshot)=>{
            if (snapshot.exists()){
                database()
                .ref('/doctorPerformance/' + String(uid))
                .update({
                    Pending:snapshot.val() + i,
                })
                .catch((err)=>{console.log('/doctorPerformance/' + String(err));});
            } else {
                database()
                .ref('/doctorPerformance/' + String(uid))
                .update({
                    Pending:i,
                })
                .catch((err)=>{console.log('/doctorPerformance/' + String(err));});
            }
        })
        .catch((err)=>{console.log('/doctorPerformance/' + String(err));});
        
        //get a perfromance template and assigned count
        database()
        .ref('/doctorPerformance/' + String(uid))
        .child(String(moment().format('YYYY-MM-DD')))
        .once('value')
        .then((snapshot)=>{
            if (snapshot.exists()){
                database()
                .ref('/doctorPerformance/' + String(uid) + '/' + String(moment().format('YYYY-MM-DD')))
                .update({
                    Assigned:snapshot.val().Assigned + i,
                })
                .catch((err)=>{console.log(String(err));});
            } else {
                var freshPerformance = { 'Order Confirmed':0,
                                    'Interested':0,
                                    'Not Answered':0,
                                    'Not Answered 2':0,
                                    'Price Issue':0,
                                    'Report Awaited':0,
                                    'Not Interested':0,
                                    'Assigned':i,
                                    'Time Spent':0,
                                    'Calls Made':0,
                                    'Finally Confirmed':0,
                                    'Order Declined':0};
                console.log(freshPerformance);
                database()
                .ref('/doctorPerformance/' + String(uid) + '/' + String(moment().format('YYYY-MM-DD')))
                .set(freshPerformance)
                .catch((err)=>{console.log(String(err));});
            }
        })
        .catch((err)=>{console.log(String(err));});
    }
}
