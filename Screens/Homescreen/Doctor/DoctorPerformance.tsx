/* eslint-disable prettier/prettier */
import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { NavigationParams } from 'react-navigation';
import {ListItem} from 'react-native-elements';
import {FAB} from 'react-native-paper';
import database from '@react-native-firebase/database';
import moment from 'moment';
//import {LineChart} from 'react-native-chart-kit';

interface Props extends NavigationParams{}
interface States {
    dataRecieved: {
        'Assigned':number,
        'Not Interested':number,
        'Interested':number,
        'Not Answered':number,
        'Not Answered 2':number,
        'Report Awaited':number,
        'Order Confirmed':number,
        'Price Issue':number,
        'Time Spent':number,
        'Calls Made':number,
        'Finally Confirmed':number,
        'Order Declined':number,
        'Assigned Rejected':number,
        'Repeat':number,
        'Existing Patients':number,
        'Appointments':number,
        'Call Back':number,
    },
    Pending:number,
}

export default class ListDoctor extends React.Component<Props,States> {
    _isMounted:boolean
    doctor:any
    isLoading:boolean
    loadingStatus:string
    constructor(props:Props){
        super(props);
        this.state = {
            dataRecieved:{
                'Assigned':0,
                'Not Interested':0,
                'Interested':0,
                'Not Answered':0,
                'Not Answered 2':0,
                'Report Awaited':0,
                'Order Confirmed':0,
                'Price Issue':0,
                'Calls Made':0,
                'Time Spent':0,
                'Finally Confirmed':0,
                'Order Declined':0,
                'Assigned Rejected':0,
                'Repeat':0,
                'Existing Patients':0,
                'Appointments':0,
                'Call Back':0,
            },
            Pending:0,
        };
        this._isMounted = false;
        this.doctor = '';
        this.isLoading = false;
        this.loadingStatus = 'Loading';
    }

    // callLineChart() {
    //     var label:any = [];
    //     var calldata:any = [];
    //     this.state.dataRecieved.forEach(element => {
    //         label.push(element.Date.substring(0,5));
    //         calldata.push(element.calls);
    //     });
    //     return <LineChart
    //         data={{
    //             labels: label,
    //             datasets: [
    //             {
    //                 data: calldata,
    //                 strokeWidth: 2,
    //             },
    //             ],
    //         }}
    //         width={Dimensions.get('window').width - 16}
    //         height={220}
    //         chartConfig={{
    //             backgroundColor: '#1cc910',
    //             backgroundGradientFrom: '#eff3ff',
    //             backgroundGradientTo: '#efefef',
    //             decimalPlaces: 2,
    //             color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    //             style: {
    //             borderRadius: 16,
    //             },
    //         }}
    //         style={{
    //             marginVertical: 8,
    //             borderRadius: 16,
    //         }}
    //     />;
    // }
    componentDidMount(){
        this._isMounted = true;
        this.isLoading = false;
        const {doctor} = this.props.route.params;
        this.doctor = doctor;
        this._isMounted && this.getParameter(this.doctor,1);
    }
    componentWillUnmount(){
        this._isMounted = false;
    }
    render() {
        return (
            <View style={styles.container}>
                <ScrollView>
                    {this.performanceParameter()}
                </ScrollView>
                <FAB
                style={styles.fab1}
                label="1"
                icon="clipboard-text"
                onPress={() => {this._isMounted && this.getParameter(this.doctor,1);}}
                />
                <FAB
                style={styles.fab7}
                label="7"
                icon="clipboard-text"
                onPress={() => {this._isMounted && this.getParameter(this.doctor,7);}}
                />
                <FAB
                style={styles.fab30}
                label="30"
                icon="clipboard-text"
                onPress={() => {this._isMounted && this.getParameter(this.doctor,30);}}
                />
            </View>
        );
    }
    performanceParameter(){
        return <View>
                <ListItem
                    bottomDivider>
                    <ListItem.Content>
                        <ListItem.Title>{this.loadingStatus}</ListItem.Title>
                    </ListItem.Content>
                </ListItem>
                <ListItem
                    bottomDivider>
                    <ListItem.Content>
                        <ListItem.Title>Assigned: {this.state.dataRecieved.Assigned}</ListItem.Title>
                    </ListItem.Content>
                </ListItem>
                <ListItem
                    bottomDivider>
                    <ListItem.Content>
                        <ListItem.Title>Pending: {this.state.Pending}</ListItem.Title>
                    </ListItem.Content>
                </ListItem>
                <ListItem
                    bottomDivider>
                    <ListItem.Content>
                        <ListItem.Title>Assigned Rejected: {this.state.dataRecieved['Assigned Rejected']}</ListItem.Title>
                    </ListItem.Content>
                </ListItem>
                <ListItem
                    bottomDivider>
                    <ListItem.Content>
                        <ListItem.Title>Calls Made: {this.state.dataRecieved['Calls Made']}</ListItem.Title>
                    </ListItem.Content>
                </ListItem>
                <ListItem
                    bottomDivider>
                    <ListItem.Content>
                        <ListItem.Title>Time Spent: {Math.floor(this.state.dataRecieved['Time Spent'] / 60)} Minutes {this.state.dataRecieved['Time Spent'] % 60} Sec</ListItem.Title>
                    </ListItem.Content>
                </ListItem>
                <ListItem
                    bottomDivider>
                    <ListItem.Content>
                        <ListItem.Title>Order Confirmed: {this.state.dataRecieved['Order Confirmed']}</ListItem.Title>
                    </ListItem.Content>
                </ListItem>
                <ListItem
                    bottomDivider>
                    <ListItem.Content>
                        <ListItem.Title>Finally Confirmed: {this.state.dataRecieved['Finally Confirmed']}</ListItem.Title>
                    </ListItem.Content>
                </ListItem>
                <ListItem
                    bottomDivider>
                    <ListItem.Content>
                        <ListItem.Title>Order Declined: {this.state.dataRecieved['Order Declined']}</ListItem.Title>
                    </ListItem.Content>
                </ListItem>
                <ListItem
                    bottomDivider>
                    <ListItem.Content>
                        <ListItem.Title>Report Awaited: {this.state.dataRecieved['Report Awaited']}</ListItem.Title>
                    </ListItem.Content>
                </ListItem>
                <ListItem
                    bottomDivider>
                    <ListItem.Content>
                        <ListItem.Title>Interested: {this.state.dataRecieved.Interested}</ListItem.Title>
                    </ListItem.Content>
                </ListItem>
                <ListItem
                    bottomDivider>
                    <ListItem.Content>
                        <ListItem.Title>Repeat: {this.state.dataRecieved.Repeat}</ListItem.Title>
                    </ListItem.Content>
                </ListItem>
                <ListItem
                    bottomDivider>
                    <ListItem.Content>
                        <ListItem.Title>Repeat: {this.state.dataRecieved['Existing Patients']}</ListItem.Title>
                    </ListItem.Content>
                </ListItem>
                <ListItem
                    bottomDivider>
                    <ListItem.Content>
                        <ListItem.Title>Appointments: {this.state.dataRecieved.Appointments}</ListItem.Title>
                    </ListItem.Content>
                </ListItem>
                <ListItem
                    bottomDivider>
                    <ListItem.Content>
                        <ListItem.Title>Call Back: {this.state.dataRecieved['Call Back']}</ListItem.Title>
                    </ListItem.Content>
                </ListItem>
                <ListItem
                    bottomDivider>
                    <ListItem.Content>
                        <ListItem.Title>Price Issue: {this.state.dataRecieved['Price Issue']}</ListItem.Title>
                    </ListItem.Content>
                </ListItem>
                <ListItem
                    bottomDivider>
                    <ListItem.Content>
                        <ListItem.Title>Not Interested: {this.state.dataRecieved['Not Interested']}</ListItem.Title>
                    </ListItem.Content>
                </ListItem>
                <ListItem
                    bottomDivider>
                    <ListItem.Content>
                        <ListItem.Title>Not Answered: {this.state.dataRecieved['Not Answered']}</ListItem.Title>
                    </ListItem.Content>
                </ListItem>
                <ListItem
                    bottomDivider>
                    <ListItem.Content>
                        <ListItem.Title>Not Answered 2: {this.state.dataRecieved['Not Answered 2']}</ListItem.Title>
                    </ListItem.Content>
                </ListItem>
            </View>;
    }
    getParameter(doctor:any,i:number){
        this.isLoading = true;
        const ref = database()
        .ref('/doctorPerformance/' + String(doctor.uid));
        ref
        .child('Pending')
        .once('value')
        .then((dataSnapShot)=>{
            if (dataSnapShot.exists()){
                this.setState({Pending:dataSnapShot.val()});
            }
        })
        .catch((err)=>{console.log(String(err));});
        var dR = {
            'Assigned':0,
            'Not Interested':0,
            'Interested':0,
            'Not Answered':0,
            'Not Answered 2':0,
            'Report Awaited':0,
            'Order Confirmed':0,
            'Price Issue':0,
            'Calls Made':0,
            'Time Spent':0,
            'Finally Confirmed':0,
            'Order Declined':0,
            'Assigned Rejected':0,
            'Repeat':0,
            'Existing Patients':0,
            'Appointments':0,
            'Call Back':0,
        };
        for (let j = 0; j < i; j++) {
            ref
            .child(String(moment().subtract(j,'days').format('YYYY-MM-DD')))
            .once('value')
            .then((snapshot)=>{
                if (snapshot.exists())
                {
                    snapshot.forEach((perParameter:any)=>{
                        dR[String(perParameter.key)] += perParameter.val();
                        this.setState({dataRecieved:dR});
                    });
                } else if (i === 1){
                    Alert.alert('This Doctor is not assigned any Patient today');
                }
            })
            .catch((err)=>{console.log(String(err));});
        }
        this.loadingStatus = String(i) + ' days Status';    }
}

const styles = StyleSheet.create({
    fab1: {
        alignSelf:'flex-end',
        position:'absolute',
        bottom:10,
        right:19,
        backgroundColor:'#33ff49',
    },
    fab7: {
        alignSelf:'flex-end',
        position:'absolute',
        bottom:70,
        right:19,
        backgroundColor:'#33ff49',
    },
    fab30: {
        alignSelf:'flex-end',
        position:'absolute',
        bottom:130,
        right:10,
        backgroundColor:'#33ff49',
    },
    activity: {
        alignSelf:'flex-end',
        position:'absolute',
        bottom:250,
        right:10,
        backgroundColor:'#33ff49',
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 10,
        justifyContent:'flex-end',
    },
  });
