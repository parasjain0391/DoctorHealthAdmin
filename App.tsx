/* eslint-disable prettier/prettier */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
// @ts-ignore
import {NavigationContainer} from '@react-navigation/native';
//import {View} from 'react-native';
//import Login from './Screens/Login';
import Loading from './Screens/Loading';
import LoginTrial from './Screens/LoginTrial';
import Homescreen from './Screens/Homescreen';
import { NavigationParams } from 'react-navigation';
import ReConfirmedUpdate from './Screens/Homescreen/Setting/ReConfirmedUpdate';
import ReConfirmedList from './Screens/Homescreen/Setting/ReConfirmedList';
import SelectImportList from './Screens/Homescreen/Setting/SelectImportList';
import AddDoctor from './Screens/Homescreen/Doctor/AddDoctor';
import AddWork from './Screens/Homescreen/MultiWork/AddWork';
import AssignWork from './Screens/Homescreen/MultiWork/AssignWork';
import ListPatients from './Screens/Homescreen/MultiWork/ListPatients';

const Stack = createStackNavigator();
interface Props extends NavigationParams {}
interface States {}
export default class App extends React.Component<Props, States> {
  render() {
    return (
      // stack navigator for login screen and others
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Loading">
          {/* <Stack.Screen
            name="Login"
            component={Login}
            options={{title: 'Login'}}
          /> */}
          <Stack.Screen
            name="LoginTrial"
            component={LoginTrial}
            options={{title: 'Login'}}
          />
          <Stack.Screen
            name="Loading"
            component={Loading}
            options={{title: 'Dr. Health'}}
          />
          <Stack.Screen
            name="Homescreen"
            component={Homescreen}
            options={{title: 'Doctor Health'}}
          />
          <Stack.Screen
              name="ReConfirmed List"
              component={ReConfirmedList}
              options={{title: 'List of confirmed order patient'}}
          />
          <Stack.Screen
              name="ReConfirmed Update"
              component={ReConfirmedUpdate}
              options={{title: 'Status Update'}}
          />
          <Stack.Screen
              name="SelectImportList"
              component={SelectImportList}
              options={{title: 'Select the list to import the numbers'}}
          />
          <Stack.Screen
              name="AddDoctor"
              component={AddDoctor}
              options={{title: 'Add Doctor'}}
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
              options={{title: 'Selected List of Patients'}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
