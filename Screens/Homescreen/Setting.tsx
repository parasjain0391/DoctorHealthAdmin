/* eslint-disable prettier/prettier */
import React from 'react';
import { NavigationParams } from 'react-navigation';
import {createStackNavigator} from '@react-navigation/stack';
import Options from './Setting/Options';
import OverallReport from './Setting/OverallReport';
// it is a stack navigator that deals with the doctor management
const Stack = createStackNavigator();
interface Props extends NavigationParams{}
interface States {}
export default class Work extends React.Component<Props,States> {
    render() {
        return (
            <Stack.Navigator initialRouteName="Options">
                <Stack.Screen
                    name="Options"
                    component={Options}
                    options={{title: 'Options'}}
                />
                <Stack.Screen
                    name="Overall Report"
                    component={OverallReport}
                    options={{title: 'Overall Report'}}
                />
            </Stack.Navigator>
        );
    }
}
