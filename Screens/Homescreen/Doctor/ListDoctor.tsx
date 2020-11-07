/* eslint-disable prettier/prettier */
import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { FAB } from 'react-native-paper';
import { NavigationParams } from 'react-navigation';
import {ListItem } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
interface Props extends NavigationParams{}
interface States {
    doctors: {
        name:string,
        uid:string,
    } [],
}
export default class ListDoctor extends React.Component<Props,States> {
    constructor(props:Props) {
        super(props);
        this.state = {
            doctors: [
                {'uid':'1','name':'Paras1'},
                {'uid':'2','name':'Paras2'},
                {'uid':'3','name':'Paras3'},
                {'uid':'4','name':'Paras4'},
                {'uid':'5','name':'Paras5'},
                {'uid':'6','name':'Paras6'},
                {'uid':'7','name':'Paras7'},
                {'uid':'8','name':'Paras8'},
                {'uid':'9','name':'Paras9'},
                {'uid':'10','name':'Paras10'},
                {'uid':'11','name':'Paras11'},
            ],
        };
    }
    viewDoctorDetail(doctor:any) {
        //code to view doctor detail
        console.log(doctor.name + 'Details');
    }
    renderDoctor() {
        return this.state.doctors.map(doctor => {
          return <ListItem key={doctor.uid}
              onPress={()=> this.viewDoctorDetail(doctor)}
              bottomDivider>
              <ListItem.Content>
              <ListItem.Title>{doctor.name}</ListItem.Title>
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
