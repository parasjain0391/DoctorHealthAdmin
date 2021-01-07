/* eslint-disable prettier/prettier */
import React from 'react';
import { NavigationParams } from 'react-navigation';
import {createStackNavigator} from '@react-navigation/stack';
import ListDoctor from './Doctor/ListDoctor';
import DoctorPerformance from './Doctor/DoctorPerformance';
// it is a stack navigator that deals with the doctor management
const Stack = createStackNavigator();
interface Props extends NavigationParams{}
interface States {}
export default class Work extends React.Component<Props,States> {
    render() {
        return (
            <Stack.Navigator initialRouteName="ListDoctor">
                <Stack.Screen
                    name="ListDoctor"
                    component={ListDoctor}
                    options={{title: 'List Doctor'}}
                />
                <Stack.Screen
                    name="DoctorPerformance"
                    component={DoctorPerformance}
                    options={{title: 'Doctor Performance'}}
                />
            </Stack.Navigator>
        );
    }
}
