/* eslint-disable prettier/prettier */
import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Work from './Homescreen/Work';
import Doctor from './Homescreen/Doctor';
import Setting from './Homescreen/Setting';
import { NavigationParams } from 'react-navigation';
// Screen that open after the login
// is a tab navigator that open the work screen by default which by itself is a stack navigator
const Tab = createMaterialTopTabNavigator();
interface Props extends NavigationParams{}
interface States {}
export default class Homescreen extends React.Component<Props,States> {
    render() {
        return (
            <Tab.Navigator initialRouteName="Work">
                <Tab.Screen name="Work" component={Work} />
                <Tab.Screen name="Doctor" component={Doctor} />
                <Tab.Screen name="Setting" component={Setting} />
            </Tab.Navigator>
        );
    }
}
