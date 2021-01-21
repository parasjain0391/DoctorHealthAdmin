/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { NavigationParams } from 'react-navigation';
import { CheckBox, Button } from 'react-native-elements';
import database from '@react-native-firebase/database';
// @ts-ignore
interface Props extends NavigationParams{}
interface States {
    calls:any,
    isChecked:boolean,
    count:number,
    checkedCount:number,
}
export default class ListWork extends React.Component<Props,States> {
    _isMounted:boolean;
    uid:string;
    listName:string;
    updateAlert:boolean;
    constructor(props: Props) {
      super(props);
      this._isMounted = false;
      this.uid = 'null';
      this.listName = '';
      this.updateAlert = false;
      this.state = {
        calls: [],
        isChecked: false,
        count: 0,
        checkedCount:0,
      };
    }
    // called when the screen is loaded
    componentDidMount() {
        this._isMounted = true;
        const {listName} = this.props.route.params;
        this.listName = listName;
        // A Event Listener is added at the database for any changes in the node
        database()
        .ref('/work/' + String(this.listName))
        .on('value', (snapshot:any) => {
          this.loadPatient(snapshot);
          this.updateAlert = false;
        });
    }
    // called when the sceen is unmounted
    componentWillUnmount(){
      this._isMounted = false;
      this.updateAlert = false;
    }
    // Load the patient that are fetched from the database to the this.state.calls which automatically calls render
    loadPatient(snapshot:any){
      if (!snapshot.exists()) {
        Alert.alert(String(this.listName) + ' list is empty');
      }
      const calls:any = [];
            var c:number = 0;
            snapshot.forEach((item:any)=>{
                var i = item.val();
                i.isChecked = false;
                calls.push(i);
                c++;
            });
            this.setState({ calls: calls, count:c });
    }
    //Assign the checkboxed patients by pushin the selected patient to AssignWork Screen
    // called by pressing on the Assign button
    assignMultipleWork() {
        var c:any = [];
        var flag = false;
        this.state.calls.forEach((item:any)=>{
            if (item.isChecked) {
                c.push(item);
                flag = true;
            }
        });
        if (flag){
          this.props.navigation.navigate('AssignWork',{calls:c,listName:this.listName});
        } else {
          Alert.alert('Please Select at least one patient to be assigned');
        }
    }
    // check the 10 unchecked calls in the upper reach of the list
    // called by pressing select 10 button 
    selectTen(){
        var callCount:number = 0;
        this.state.calls.forEach((call:any)=>{
            if (call.isChecked === false && callCount < 10){
              call.isChecked = !call.isChecked;
              callCount++;
            }
        });
        this.setState({checkedCount:this.state.checkedCount + callCount});
        this.forceUpdate();
    }
    // UI element of the call Logs
    renderCalls() {
      return this.state.calls.map((call:any) => {
        return <View key={call.phoneNumber}>
          <CheckBox
          title={String(call.phoneNumber)}
          checked={call.isChecked}
          onPress={() => {call.isChecked = !call.isChecked;
            this.setState({checkedCount:this.state.checkedCount + 1});
            this.forceUpdate();}}
          />
          </View>;
      });
    }
    render() {
      return (
        <View style={styles.body}>
          <ScrollView>
            <View style={{flex:1, backgroundColor:'white'}}>
              {this.renderCalls()}
            </View>
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
                  title={'Assign(' + this.state.checkedCount + '/' + this.state.count + ')'}
                  type="solid"
                  buttonStyle={styles.button}
              />
              <Button
                  // assign first 10 work in the list
                  onPress={()=>{this.selectTen();}}
                  title="Select 10"
                  type="solid"
                  disabled={this.state.count - this.state.checkedCount < 10}
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
