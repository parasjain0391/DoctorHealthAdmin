/* eslint-disable prettier/prettier */
import React from 'react';
import { Text, View } from 'react-native';
import { NavigationParams } from 'react-navigation';
interface Props extends NavigationParams {}
interface States {}
export default class AddDoctor extends React.Component<Props,States> {
    render() {
        return (
            <View>
                <Text> Add Doctor Screen</Text>
            </View>
        );
    }
}
