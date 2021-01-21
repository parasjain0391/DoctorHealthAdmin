/* eslint-disable prettier/prettier */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationParams } from 'react-navigation';
import {ListItem } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
interface Props extends NavigationParams{}
interface States {
    item: any [],
}
export default class SelectList extends React.Component<Props,States> {
    _isMounted:boolean
    constructor(props:Props) {
        super(props);
        this.state = {
            item: [{'name':'Unassigned'},
                {'name':'Photos not done'},
                {'name':'Photos done'},
                {'name':'Facebook leads'},
            ],
        };
        this._isMounted = false;
    }
    // called when the screen is loaded
    componentDidMount() {
        this._isMounted = true;
    }
    // called when the screen is unmounted
    componentWillUnmount() {
        this._isMounted = false;
    }
    //show the name of the list for which the number can be added
    renderList() {
        return this.state.item.map(item => {
          return <ListItem key={item.name}
              onPress={()=> {console.log(String(item.name) + ' is selected to be assigned');
                this.props.navigation.navigate('ListPatients',{listName:String(item.name)});}}
              bottomDivider>
              <ListItem.Content>
              <ListItem.Title>{item.name}</ListItem.Title>
              </ListItem.Content>
            </ListItem>;
        });
    }
    render() {
        return (
            <View style={styles.body}>
                <ScrollView>
                    {this.renderList()}
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
