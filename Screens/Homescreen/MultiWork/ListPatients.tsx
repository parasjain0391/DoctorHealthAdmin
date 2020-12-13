/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { NavigationParams } from 'react-navigation';
import { CheckBox, Button } from 'react-native-elements';
import database from '@react-native-firebase/database';
// @ts-ignore
import AsyncStorage from '@react-native-async-storage/async-storage';
interface Props extends NavigationParams{}
interface States {
    calls:any,
}
export default class ListWork extends React.Component<Props,States> {
    _isMounted:boolean;uid:string;
    // get the uid saved in the mobile
    async getuid() {
        const uid:any = await AsyncStorage.getItem('uid');
        return uid;
    }
    constructor(props: Props) {
      super(props);
      this._isMounted = false;
      this.uid = 'null';
      this.state = {
        calls: [],
      };
    }
    // called when the screen is loaded
    componentDidMount() {
        this._isMounted = true;
        database()
        .ref('/work/unassignedWork/')
        .once('value')
        .then((snapshot) => {
            const calls:any = [];
            snapshot.forEach((item:any)=>{
                var i = item.val();
                i.isChecked = false;
                calls.push(i);
            });
            this.setState({ calls: calls });
          })
        .catch(err => {console.log(String(err));});
    }
    //Assign the checkboxed patients
    assignMultipleWork() {
        var c:any = [];
        this.state.calls.forEach((item:any)=>{
            if (item.isChecked) {
                c.push(item);
            }
        });
        this.props.navigation.navigate('AssignWork',{calls:c});
    }
      // UI element of the call Logs
      renderCalls() {
        return this.state.calls.map((call:any) => {
          return <View key={call.timestamp}>
            <CheckBox
            title={String(call.phoneNumber)}
            checked={call.isChecked}
            onPress={() => {call.isChecked = !call.isChecked; this.forceUpdate();}}
            />
            </View>;
        });
      }
      render() {
        return (
          <View style={styles.body}>
            <ScrollView>
              <View style={{flex:1, backgroundColor:'white'}}>{this.renderCalls()}</View>
            </ScrollView>
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
                    onPress={()=>{this.assignMultipleWork();}}
                    title="Assign"
                    type="solid"
                    buttonStyle={styles.button}
                />
            </View>
          </View>
        );
    }
}
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
