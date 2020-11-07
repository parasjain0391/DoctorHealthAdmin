/* eslint-disable prettier/prettier */
import React from 'react';
import { NavigationParams } from 'react-navigation';
import {createStackNavigator} from '@react-navigation/stack';
import ListWork from './Work/ListWork';
import AddWork from './Work/AddWork';
import AssignWork from './Work/AssignWork';
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
                    options={{title: 'ListWork'}}
                />
                <Stack.Screen
                    name="AddWork"
                    component={AddWork}
                    options={{title: 'AddWork'}}
                />
                <Stack.Screen
                    name="AssignWork"
                    component={AssignWork}
                    options={{title: 'AssignWork'}}
                />
            </Stack.Navigator>
        );
    }
}
