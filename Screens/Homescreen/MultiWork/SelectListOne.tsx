/* eslint-disable prettier/prettier */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationParams } from 'react-navigation';
import {ListItem } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import database from '@react-native-firebase/database';
import moment from 'moment';
interface Props extends NavigationParams{}
interface States {
    item: any [],
}
export default class SelectListOne extends React.Component<Props,States> {
    _isMounted:boolean
    constructor(props:Props) {
        super(props);
        this.state = {
            item: [{'name':'Unassigned'},
                {'name':'Photos not done'},
                {'name':'Photos done'},
                {'name':'Facebook leads'},
            ],
        };
        this._isMounted = false;
    }
    // called when the screen is loaded 
    componentDidMount() {
        this._isMounted = true;
    }
    // called when the screen is unmounted
    componentWillUnmount() {
        this._isMounted = false;
    }
    // the operation to add the number to selected list
    addPatient(listName:String) {
        const {call} = this.props.route.params;
        // Add patient to allPatient for the current date
        database()
        .ref('/allPatients/' + moment().format('YYYY-MM-DD') + '/' + String(call.phoneNumber))
        .set(String(call.phoneNumber))
        .then(()=>{console.log(String(call.phoneNumber) + 'is added to allPatient');})
        .catch(err=>{console.log(String(err));});
        // Add the call to the list selected
        database()
        .ref('/work/' + String(listName) + '/' + String(call.phoneNumber))
        .set(call)
        .then(()=>{console.log(String(call.phoneNumber) + 'is added to ' + String(listName) + ' List');})
        .catch(err=>{console.log(String(err));});
        this.props.navigation.navigate('ListWork');
    }
    //show the name of the list for which the number can be added
    renderList() {
        return this.state.item.map(item => {
          return <ListItem key={item.name}
              onPress={()=> {console.log(String(item.name) + ' list is selected');
                this.addPatient(item.name);}}
              bottomDivider>
              <ListItem.Content>
              <ListItem.Title>{item.name}</ListItem.Title>
              </ListItem.Content>
            </ListItem>;
        });
    }
    render() {
        return (
            <View style={styles.body}>
                <ScrollView>
                    {this.renderList()}
                </ScrollView>
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
