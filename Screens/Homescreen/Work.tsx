/* eslint-disable prettier/prettier */
import React from 'react';
import { NavigationParams } from 'react-navigation';
import {createStackNavigator} from '@react-navigation/stack';
import ListWork from './MultiWork/ListWork';
import AddWork from './MultiWork/AddWork';
import AssignWork from './MultiWork/AssignWork';
import ListPatients from './MultiWork/ListPatients';
// default tab in the Homescreen
// deal with the patient and thier assignment
const Stack = createStackNavigator();
interface Props extends NavigationParams{}
interface States {}
export default class Work extends React.Component<Props,States> {
    render() {
        return (
            <Stack.Navigator initialRouteName="ListWork">
                <Stack.Screen
                    name="ListWork"
                    component={ListWork}
                    options={{title: 'Call Log'}}
                />
                <Stack.Screen
                    name="AddWork"
                    component={AddWork}
                    options={{title: 'Add New Patient'}}
                />
                <Stack.Screen
                    name="AssignWork"
                    component={AssignWork}
                    options={{title: 'Assign Work'}}
                />
                <Stack.Screen
                    name="ListPatients"
                    component={ListPatients}
                    options={{title: 'List of Unassigned Patients'}}
                />
            </Stack.Navigator>
        );
    }
}
