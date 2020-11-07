/* eslint-disable prettier/prettier */
import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { NavigationParams } from 'react-navigation';
import { ListItem, Button } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';


const styles = StyleSheet.create({
    body: {
      backgroundColor: 'white',
      justifyContent:'space-around',
      flex:1,
    },
    buttonarea: {
        flex:1,
        flexDirection:'row',
        justifyContent:'space-around',
        alignContent:'center',
        alignItems:'center',
        marginVertical:25,
        marginHorizontal:90,
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
        height:50,
        width:100,
        marginHorizontal:10,
        marginVertical:25,
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
                // {'uid':'5','name':'Paras5'},
                // {'uid':'6','name':'Paras6'},
                // {'uid':'7','name':'Paras7'},
                // {'uid':'8','name':'Paras8'},
                // {'uid':'9','name':'Paras9'},
                // {'uid':'10','name':'Paras10'},
                // {'uid':'11','name':'Paras11'},
            ],
        };
        this.selectedDoctor = {'name':'','uid':''};
    }
    selectDoctor(doctor:any) {
        this.selectedDoctor = doctor;
        console.log(doctor + 'is selected');
    }
    assignWork() {
        // Code for work Assignment
        console.log('Work Assigned');
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
            <SafeAreaView>
            <View>
                <ScrollView>
                    {this.renderDoctor()}
                </ScrollView>
                <View style={styles.buttonarea}>
                <Button
                    onPress={()=>{this.props.navigation.navigate('ListWork');}}
                    title="Cancel"
                    type="outline"
                    buttonStyle={styles.button}
                    titleStyle={styles.buttontitle}
                />
                <Button
                    onPress={()=>{this.assignWork();}}
                    title="Assign"
                    type="outline"
                    buttonStyle={styles.button}
                    titleStyle={styles.buttontitle}
                />
                </View>
            </View>
            </SafeAreaView>
        );
    }
}
