/* eslint-disable prettier/prettier */
import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { FAB } from 'react-native-paper';
import { NavigationParams } from 'react-navigation';
interface Props extends NavigationParams{}
interface States {}
export default class ListDoctor extends React.Component<Props,States> {
    render() {
        return (
            <View>
                <Text> List Doctor Screen</Text>
                <FAB
                    style={styles.fab}
                    icon="plus"
                    onPress={() => {console.log('Add button pressed');
                    }}
                    />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    fab: {
      position: 'absolute',
      margin: 16,
      right: 0,
      top: 110,
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 10,
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
