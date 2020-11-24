/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */

import React from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
//import { Input, Button } from 'react-native-elements';
import { NavigationParams } from 'react-navigation';
//import auth from '@react-native-firebase/auth';
//import database from '@react-native-firebase/database';
import {LineChart} from 'react-native-chart-kit';

interface Props extends NavigationParams{}
interface States {
    dataRecieved: {
        Date:string,
        calls:number,
    } [],
}

export default class ListDoctor extends React.Component<Props,States> {
    constructor(props:Props){
        super(props);
        this.state = {
            dataRecieved: [
                {'Date' : '11/11/2020','calls':20},
                {'Date' : '12/11/2020','calls':60},
                {'Date' : '13/11/2020','calls':80},
                {'Date' : '14/11/2020','calls':70},
                {'Date' : '15/11/2020','calls':40},
                {'Date' : '16/11/2020','calls':50},
                {'Date' : '17/11/2020','calls':20},
        ]};
    }

    callLineChart() {
        var label:any = [];
        var calldata:any = [];
        this.state.dataRecieved.forEach(element => {
            var i = element.Date.lastIndexOf('/');
            label.push(element.Date.substring(0,i));
            calldata.push(element.calls);
        });
        return <LineChart
            data={{
                labels: label,
                datasets: [
                {
                    data: calldata,
                    strokeWidth: 2,
                },
                ],
            }}
            width={Dimensions.get('window').width - 16}
            height={220}
            chartConfig={{
                backgroundColor: '#1cc910',
                backgroundGradientFrom: '#eff3ff',
                backgroundGradientTo: '#efefef',
                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                borderRadius: 16,
                },
            }}
            style={{
                marginVertical: 8,
                borderRadius: 16,
            }}
        />;
    }
    render() {
        return (
            <View style={styles.body}>
                <ScrollView>
                    {this.callLineChart()}
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
