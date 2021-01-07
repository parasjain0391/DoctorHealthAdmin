/* eslint-disable prettier/prettier */
import React from 'react';
import { NavigationParams } from 'react-navigation';
import {createStackNavigator} from '@react-navigation/stack';
import ListWork from './MultiWork/ListWork';
import SelectList from './MultiWork/SelectList';
import SelectListOne from './MultiWork/SelectListOne';
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
                    name="SelectList"
                    component={SelectList}
                    options={{title: 'Select the list'}}
                />
                <Stack.Screen
                    name="SelectListOne"
                    component={SelectListOne}
                    options={{title: 'Select the list'}}
                />
            </Stack.Navigator>
        );
    }
}
