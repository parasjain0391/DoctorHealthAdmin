/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { ScrollView, View, StyleSheet, Text } from 'react-native';
import { NavigationParams } from 'react-navigation';
import { ListItem, Button } from 'react-native-elements';

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
    doctors: {
        uid:string,
        name:string,
    } [];
}
export default class AssignWork extends React.Component<Props,States> {
    selectedDoctor:{
        uid:string,
        name:string,
    }
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
        this.selectedDoctor = {'name':'Not Selected','uid':''};
    }
    selectDoctor(doctor:any) {
        this.selectedDoctor.name = doctor.name;
        this.selectedDoctor.uid = doctor.uid;
        console.log(this.selectedDoctor.name + ' is selected');
        this.forceUpdate();
    }
    assignWork() {
        // Code for work Assignment
        console.log('Work Assigned');
        this.props.navigation.navigate('ListWork');
    }
    renderDoctor() {
        return this.state.doctors.map(doctor => {
          return <ListItem key={doctor.uid}
              onPress={()=> this.selectDoctor(doctor)}
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
                <Text style={{fontSize:18, marginHorizontal:60}}>Selected Doctor: {this.selectedDoctor.name}</Text>
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
                />
                </View>
            </View>
        );
    }
}
