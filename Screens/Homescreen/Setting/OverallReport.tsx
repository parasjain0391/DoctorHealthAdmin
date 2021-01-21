/* eslint-disable prettier/prettier */
import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { NavigationParams } from 'react-navigation';
import { ListItem } from 'react-native-elements';
import database from '@react-native-firebase/database';
import { FAB } from 'react-native-paper';
import moment from 'moment';
// screen that is only used to logout for now
interface Props extends NavigationParams {}
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

export default class OverallReport extends React.Component<Props,States> {
    _isMounted:boolean
    loadingStatus:string
    constructor(props:Props) {
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
        this.loadingStatus = 'Loading';
    }
    componentDidMount() {
        this._isMounted = true;
        this._isMounted && this.getParameter(1);
    }
    componentWillUnmount() {
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
                onPress={() => {this._isMounted && this.getParameter(1);}}
                />
                <FAB
                style={styles.fab7}
                label="7"
                icon="clipboard-text"
                onPress={() => {this._isMounted && this.getParameter(7);}}
                />
                <FAB
                style={styles.fab30}
                label="30"
                icon="clipboard-text"
                onPress={() => {this._isMounted && this.getParameter(30);}}
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
    getParameter(i:number){
        let dR = {
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
        let Pending = 0;
        const ref = database()
        .ref('/doctorPerformance');
        ref
        .once('value')
        .then((dataSnapShot)=>{
            dataSnapShot.forEach((doctor:any)=>{
                Pending += doctor.child('Pending').val();
                for (let j = 0; j < i; j++) {
                    ref
                    .child(String(doctor.key))
                    .child(String(moment().subtract(j,'days').format('YYYY-MM-DD')))
                    .once('value')
                    .then((snapshot)=>{
                        if (snapshot.exists()){
                            snapshot.forEach((perParameter:any)=>{
                                dR[String(perParameter.key)] += perParameter.val();
                            });
                            this._isMounted && this.setState({dataRecieved:dR, Pending :Pending});
                        }
                    })
                    .catch((err)=>{console.log(String(err));});
                }
            });
        })
        .catch((err)=>{console.log(String(err));});
        this.loadingStatus = String(i) + ' day Status';
    }
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
    rowview: {
        flexDirection:'row',
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 10,
        justifyContent:'flex-end',
    },
  });
