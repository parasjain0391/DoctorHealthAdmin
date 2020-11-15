/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { ScrollView, View, StyleSheet, Text, Alert } from 'react-native';
import { NavigationParams } from 'react-navigation';
import { ListItem, Button } from 'react-native-elements';
import database from '@react-native-firebase/database';
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
    constructor(props:Props) {
        super(props);
        this.state = {
            doctors: [
                {'uid':'1','name':'Paras1'},
            ],
        };
        this.selectedDoctor = {'name':'Not Selected','uid':''};
    }
    selectDoctor(doctor:any) {
        this.selectedDoctor = doctor;
        console.log(this.selectedDoctor.firstName + ' ' + this.selectedDoctor.lastName + ' is selected');
        this.forceUpdate();
    }
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
    assignWork() {
        // Code for work Assignment
        console.log('Work Assigned');
        if (this.selectDoctor.name === 'Not Selected'){
            Alert.alert('Please select a doctor');
            return;
        } else {
            const {call} = this.props.route.params;
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
            };
            console.log(assign);
            database()
            .ref('/work/' + assign.uid)
            .child(assign.phoneNumber)
            .set(assign);
            this.props.navigation.navigate('ListWork');
        }
    }
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
                    onPress={()=>{this.props.navigation.navigate('ListWork');}}
                    title="Cancel"
                    type="solid"
                    buttonStyle={styles.button}
                />
                <Button
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
