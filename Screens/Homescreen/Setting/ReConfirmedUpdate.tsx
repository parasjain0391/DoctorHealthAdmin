/* eslint-disable prettier/prettier */
import React from 'react';
import {Alert, StyleSheet, View } from 'react-native';
import { NavigationParams, SafeAreaView } from 'react-navigation';
// @ts-ignore
import RadioButtonRN from 'radio-buttons-react-native';
import { Button } from 'react-native-elements';
import database from '@react-native-firebase/database';
// @ts-ignore
import CallLogs from 'react-native-call-log';
import moment from 'moment';
const styles = StyleSheet.create({
    body: {
      backgroundColor: 'white',
      justifyContent:'flex-end',
      fontSize:18,
    },
    buttonarea: {
        flexDirection:'row',
        justifyContent:'space-evenly',
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

interface Props extends NavigationParams {
  navigation:any
}
interface States {
    calls: {
        dateTime: string;
        duration: number;
        name: string;
        phoneNumber: number;
        rawType: number;
        timestamp: string;
        type: string;
      }[];
 }
export default class StatusUpdate extends React.Component<Props, States> {
    newStatus:string;
    previousStatus:string;
    timeSpent:number;
    callCount:number;
    doctoruid:String;
    _isMounted:boolean;
    constructor(props:Props) {
        super(props);
        this.state = {
            calls: [],
          };
        this.newStatus = 'Order Confirmed';
        this.previousStatus = 'Order Confirmed';
        this.callCount = 0;
        this.timeSpent = 0;
        this.doctoruid = '';
        this._isMounted = false;
    }
    componentDidMount(){
        this._isMounted = true;
    }
    componentWillUnmount(){
        this._isMounted = false;
    }
    // Update the performance varaiable of the doctor
    updatePerformance(patient:any){
        const datePerformanceRef = database()
        .ref('/doctorPerformance/' + String(patient.doctoruid) + '/' + String(patient.statusUpdateDate));
        datePerformanceRef
        .once('value')
        .then((snapshot)=>{
            if (!snapshot.exists()){
                var freshPerformance = { 'Order Confirmed':0,
                                    'Interested':0,
                                    'Not Answered':0,
                                    'Not Answered 2':0,
                                    'Price Issue':0,
                                    'Report Awaited':0,
                                    'Not Interested':0,
                                    'Assigned':0,
                                    'Time Spent':0,
                                    'Calls Made':0,
                                    'Finally Confirmed':0,
                                    'Order Declined':0,
                                    'Assigned Rejected':0};
                database()
                .ref('/doctorPerformance/' + String(patient.doctoruid) + '/' + String(patient.statusUpdateDate))
                .set(freshPerformance)
                .catch((err)=>{console.log(String(err));});
            }
            let count = snapshot.child(String(this.newStatus)).val() + 1;
            datePerformanceRef
            .child(String(this.newStatus))
            .set(count)
            .catch((err)=>{console.log(String(err));});
        })
        .catch((err)=>{console.log(String(err));});
    }
    // updates the status of the patient in the database
    updateStatus(patient:any) {
        //Previosu Status is stored for decrement in count
        this.previousStatus = patient.status;
        this.doctoruid = patient.doctoruid;
        if (this.newStatus === this.previousStatus) {
            Alert.alert('Please select a new status of the patient');
        } else {
            //Status is updated
            patient.status = this.newStatus;
            // code to calculate the time spend on that patient on call
            CallLogs.load(50).then((calls: any) => this.setState({calls}));
            this.state.calls.forEach((call)=>{
                call.phoneNumber = call.phoneNumber % 10000000000;
                if (call.phoneNumber === patient.phoneNumber){
                    this.timeSpent += call.duration;
                    this.callCount++;
                }
            });
            var rec:any = {
                phoneNumber: patient.phoneNumber,
                doctoruid: patient.doctoruid,
                statusUpdateDate: String(moment().format('YYYY-MM-DD')),
                timeSpend:this.timeSpent,
                callsMade:this.callCount,
                status:this.newStatus,
            };
            this.updatePerformance(patient);
            // code to record the data of the patient
            database()
            .ref('/records/' + String(rec.doctoruid) + '/' + String(rec.statusUpdateDate) + '/' + String(rec.status))
            .child(rec.phoneNumber)
            .set(rec);
            // code to create a list of all Finally Confirmed Patients
            database()
            .ref('/work/' + String(rec.status) + '/' + String(patient.doctoruid))
            .child(rec.phoneNumber)
            .set(rec);
            // code to update the data for special profile
            database()
            .ref('/work/Order Confirmed/' + String(patient.doctoruid))
            .child(rec.phoneNumber)
            .set(null);
            console.log('Status is updated as ' + this.newStatus);
            this.props.navigation.navigate('ReConfirmed List');
        }
        //change data in the database
    }
    render() {
      const { patient } = this.props.route.params;
      const data = [
            {
                label:'Order Declined',
            },
            {
                label:'Finally Confirmed',
            },
      ];
      return (
        <SafeAreaView>
        <View>
            <View>
                <RadioButtonRN
                data={data}
                selectedBtn={(value:any) => {this.newStatus = value.label;}}
                animationTypes={['zoomIn']}
                duration={5}
                textStyle={styles.radioText}
                boxStyle={styles.radioText}
                />
            </View>
            <View style={styles.buttonarea}>
            <Button
                onPress={()=>{this.props.navigation.navigate('ReConfirmed List');}}
                title="Cancel"
                type="outline"
                buttonStyle={styles.button}
                titleStyle={styles.buttontitle}
            />
            <Button
                onPress={()=>{this._isMounted && this.updateStatus(patient);}}
                title="Save"
                type="solid"
                buttonStyle={styles.button}
                titleStyle={styles.buttontitle}
            />
            </View>
        </View>
        </SafeAreaView>
      );
    }
}
