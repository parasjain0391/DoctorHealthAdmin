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
// @ts-ignore
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
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
      isVisible:boolean;
}
export default class ListWork extends React.Component<Props,States> {
    _isMounted:boolean;
    uid:string;
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
        isVisible: false,
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
              CallLogs.load(500).then((calls: any) => this._isMounted && this.setState({calls}));
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
      // componentDidUpdate() {
      //   CallLogs.load(500).then((calls: any) => this._isMounted && this.setState({calls}));
      // }
      componentWillUnmount() {
        this._isMounted = false;
      }
      // add patient to the database
      addPatient(call:any) {
        call.phoneNumber = call.phoneNumber % 10000000000;
        database()
        .ref('/allPatients/' + String(call.phoneNumber))
        .once('value')
        .then((snapshot) => {
          if (snapshot.exists())
          {
            Alert.alert(String(call.phoneNumber) + ' is already assigned or added');
          }
          else {
            database()
            .ref('/allPatients/' + String(call.phoneNumber))
            .set(String(call.phoneNumber))
            .then(()=>{console.log(String(call.phoneNumber) + 'is added to allPatient');})
            .catch(err=>{console.log(String(err));});
            database()
            .ref('/work/Unassigned/' + String(call.phoneNumber))
            .set(call)
            .then(()=>{console.log(String(call.phoneNumber) + 'is added to Unassigned List');})
            .catch(err=>{console.log(String(err));});
          }
        });
      }
      confirmAddAll(){
        console.log('Add All Number Pressed');
        Alert.alert(
          'Add All Calls',
          'Are you sure that you want to add all the number in the call log?',
          [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Add All numbers'),
              style: 'cancel',
            },
            { text: 'OK', onPress: () => {this.addAllNumber();} },
          ],
          { cancelable: true }
        );
      }
      addAllNumber(){
        console.log('Add All number confirmed');
        var uniqueCalls = {};
        CallLogs.load(1000).then((calls: any) => {
          this._isMounted && this.setState({calls:calls});
          calls.forEach((call:any)=>{
            var num = String(call.phoneNumber);
            if (!uniqueCalls.hasOwnProperty(num)){
              uniqueCalls[num] = JSON.stringify(call);
              this.addNumber(call);
            }
          });
        });
      }
      addNumber(call:any){
        call.phoneNumber = call.phoneNumber % 10000000000;
        database()
        .ref('/allPatients/' + String(call.phoneNumber))
        .once('value')
        .then((snapshot) => {
          if (!snapshot.exists())
          {
            database()
            .ref('/allPatients/' + String(call.phoneNumber))
            .set(String(call.phoneNumber))
            .then(()=>{console.log(String(call.phoneNumber) + 'is added to allPatient');})
            .catch(err=>{console.log(String(err));});
            database()
            .ref('/work/Unassigned/' + String(call.phoneNumber))
            .set(call)
            .then(()=>{console.log(String(call.phoneNumber) + ' is added to Unassigned List');})
            .catch(err=>{console.log(String(err));});
          }
        });
      }
      addOne(call:any) {
        call.phoneNumber = call.phoneNumber % 10000000000;
        database()
        .ref('/allPatients/' + String(call.phoneNumber))
        .once('value')
        .then((snapshot) => {
            if (snapshot.exists())
            {
                Alert.alert(String(call.phoneNumber) + ' is already assigned or added');
            }
            else {
              this.props.navigation.navigate('SelectListOne',{call});
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
      // return the correct all icon for the call type
      // UI element of the call Logs
      renderCalls() {
        return this.state.calls.map(call => {
          return <ListItem key={String(call.phoneNumber) + String(call.timestamp)}
              bottomDivider>
              <ListItem.Content>
              <ListItem.Title>{String(call.phoneNumber % 10000000000)}</ListItem.Title>
              <ListItem.Subtitle>{call.dateTime/*.slice(0,11)*/}</ListItem.Subtitle>
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
                    onPress={()=> {this.addOne(call);}}
                />
                <Button
                        icon={
                            <Icon
                            name="call"
                            size={22}
                        />}
                        type="clear"
                        // Make direct call to the number
                        onPress={() => {RNImmediatePhoneCall.immediatePhoneCall(call.phoneNumber);}}
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
                style={styles.fab3}
                label="Add all"
                icon="clipboard-text"
                onPress={() => {this.confirmAddAll();}}
            />
            <FAB
                style={styles.fab2}
                label="Assign"
                icon="clipboard-text"
                onPress={() => {this.props.navigation.navigate('SelectList');/*this.props.navigation.navigate('ListPatients');*/}}
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
    fab3: {
      alignSelf:'flex-end',
      position:'absolute',
      bottom:13,
      right:220,
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 10,
    },
    titleText: {
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
