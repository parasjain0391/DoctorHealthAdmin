/* eslint-disable prettier/prettier */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { FAB } from 'react-native-paper';
import { NavigationParams } from 'react-navigation';
import {ListItem } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import database from '@react-native-firebase/database';
interface Props extends NavigationParams{}
interface States {
    doctors: any [],
}
export default class ListDoctor extends React.Component<Props,States> {
    ref:any
    _isMounted:boolean
    constructor(props:Props) {
        super(props);
        this.state = {
            doctors: [
            ],
        };
        this._isMounted = false;
        this.ref = database().ref('/user');
    }
    // called when the screen is loaded and gets the doctors information form the database
    componentDidMount() {
        this._isMounted = true;
        this.ref
        .once('value')
        .then((snapshot:any) => {this.loadDoctor(snapshot);})
        .catch((err:any)=> {console.log(String(err));});
        this.ref
        .on('value',(snapshot:any)=>{this.loadDoctor(snapshot);});
    }
    componentWillUnmount() {
        this._isMounted = false;
        this.ref.off();
    }
    loadDoctor(snapshot:any) {
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
    // function to view the detail of the doctor
    viewDoctorDetail(doctor:any) {
        //code to view doctor detail
        console.log(doctor.firstName + ' ' + doctor.lastName + ' Details');
        this.props.navigation.navigate('DoctorPerformance',{doctor:doctor});
    }
    renderDoctor() {
        return this.state.doctors.map(doctor => {
          return <ListItem key={doctor.uid}
              onPress={()=> this.viewDoctorDetail(doctor)}
              bottomDivider>
              <ListItem.Content>
              <ListItem.Title>{doctor.firstName} {doctor.lastName}</ListItem.Title>
              <ListItem.Subtitle>{doctor.role}</ListItem.Subtitle>
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
                <FAB
                    style={styles.fab}
                    icon="plus"
                    onPress={() => {console.log('Add button pressed'); this.props.navigation.navigate('AddDoctor');}}
                    />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    fab: {
        alignSelf:'flex-end',
        position:'absolute',
        bottom:10,
        right:10,
    },
    body: {
        justifyContent:'flex-end',
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 10,
        justifyContent:'flex-end',
    },
    itleText: {
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
