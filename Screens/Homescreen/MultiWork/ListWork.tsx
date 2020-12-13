/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { ScrollView, StyleSheet, View, Platform, PermissionsAndroid, Alert } from 'react-native';
import { NavigationParams } from 'react-navigation';
import { ListItem, Icon, Button } from 'react-native-elements';
//import database from '@react-native-firebase/database';
// @ts-ignore
import CallLogs from 'react-native-call-log';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {FAB} from 'react-native-paper';
import database from '@react-native-firebase/database';
interface Props extends NavigationParams{}
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
    // get the callog from the phone so that they can be assigned later
    async getCallLogs() {
        if (Platform.OS !== 'ios') {
          try {
            //Ask for runtime permission
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
              {
                title: 'Call Log Example',
                message: 'Access your call logs',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
              },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              CallLogs.load(100).then((calls: any) => this._isMounted && this.setState({calls}));
              this.getuid().then(u=> {this.uid = u;}).catch(()=>{console.log('Error in getting the uid from async storage');});
            } else {
              Alert.alert('Call Log permission denied');
            }
          } catch (e) {
            Alert.alert(e);
          }
        } else {
          Alert.alert(
            'Sorry! You can’t get call logs in iOS devices because of the security concern',
          );
        }
      }
      // called when the screen is loaded
      componentDidMount() {
        this._isMounted = true;
        this._isMounted && this.getCallLogs();
      }
      // update the calllog in realtime
      componentDidUpdate() {
        CallLogs.load(100).then((calls: any) => this._isMounted && this.setState({calls}));
      }
      componentWillUnmount() {
        this._isMounted = false;
      }
      // add patient to the database
      addPatient(call:any) {
        database()
        .ref('/allPatients/' + String(call.phoneNumber))
        .once('value')
        .then((snapshot) => {
          if (snapshot.exists())
          {
            Alert.alert('This number is already assigned or added');
          }
          else {
            call.phoneNumber = call.phoneNumber % 10000000000;
            database()
            .ref('/allPatients/' + String(call.phoneNumber))
            .set(call.phoneNumber)
            .catch(err=>{console.log(String(err));});
            database()
            .ref('/work/unassignedWork/' + String(call.phoneNumber))
            .set(call)
            .catch(err=>{console.log(String(err));});
          }
        });
      }
      // get the correct call icon
      getCallIcon(type:string) {
        if (type === 'INCOMING'){
          return <Icon
          name="call-received"
          size={22}
          color="#2E86C1"
          />;
        } else if (type === 'OUTGOING'){
          return <Icon
          name="call-made"
          size={22}
          color="#33ff49"
          />;
        } else if (type === 'MISSED'){
          return <Icon
          name="call-missed"
          size={22}
          color="#ff0000"
          />;
        } else {
          return;
        }
      }
      getListTitle(call:any){
        if (call.name !== null){
          return call.name;
        } else {
          return call.phoneNumber;
        }
      }
      // return the correct all icon for the call type
      // UI element of the call Logs
      renderCalls() {
        return this.state.calls.map(call => {
          return <ListItem key={call.timestamp}
              bottomDivider>
              <ListItem.Content>
              <ListItem.Title>{this.getListTitle(call)}</ListItem.Title>
              <ListItem.Subtitle>{call.dateTime.slice(0,11)}</ListItem.Subtitle>
              </ListItem.Content>
                {this.getCallIcon(call.type)}
                <Button
                    icon={
                        <Icon
                        name="plus"
                        type="font-awesome"
                        size={22}
                    />}
                    buttonStyle={styles.button}
                    type="clear"
                    onPress={()=> {this.addPatient(call);}}
                />
            </ListItem>;
        });
      }
      render() {
        return (
          <View style={styles.container}>
            <ScrollView>
              <View style={{flex:1, backgroundColor:'white'}}>
                {this.renderCalls()}
              </View>
            </ScrollView>
            <FAB
                style={styles.fab2}
                label="Assign"
                icon="clipboard-text"
                onPress={() => {this.props.navigation.navigate('ListPatients');}}
            />
            <FAB
                style={styles.fab}
                icon="plus"
                onPress={() => {this.props.navigation.navigate('AddWork', );}}
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
    fab2: {
      alignSelf:'flex-end',
      position:'absolute',
      bottom:13,
      right:80,
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 10,
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
    button: {
        flex: 1,
        backgroundColor: 'white',
        paddingVertical: 0,
        paddingHorizontal: 17,
    },
  });
