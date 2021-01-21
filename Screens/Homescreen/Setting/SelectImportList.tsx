/* eslint-disable prettier/prettier */
import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { NavigationParams } from 'react-navigation';
import {ListItem } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import DocumentPicker from 'react-native-document-picker';
import fs from 'react-native-fs';
import moment from 'moment';
import database from '@react-native-firebase/database';
interface Props extends NavigationParams{}
interface States {
    item: any [],
}
export default class SelectImportList extends React.Component<Props,States> {
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
    // Add the number to the selected list
    addNumber(call:any, listName:String){
        // check the number if already added in the current date
        database()
        .ref('/allPatients/' + moment().format('YYYY-MM-DD') + '/' + String(call.phoneNumber))
        .once('value')
        .then((snapshot) => {
          if (!snapshot.exists())
          {
            database()
            .ref('/allPatients/' + moment().format('YYYY-MM-DD') + '/' + String(call.phoneNumber))
            .set(String(call.phoneNumber))
            .then(()=>{console.log(String(call.phoneNumber) + 'is added to allPatient');})
            .catch(err=>{console.log(String(err));});
            // Add the number to the list
            database()
            .ref('/work/' + listName + '/' + String(call.phoneNumber))
            .set(call)
            .then(()=>{console.log(String(call.phoneNumber) + ' is added to Unassigned List');})
            .catch(err=>{console.log(String(err));});
          }
        });
    }
    //Load all the numbers from the csv in an array
    loadAllNumbers(data:any, listName:String){
        if (!data[0].hasOwnProperty('phone_number')){
            Alert.alert('The given csv file does not have column name phone_number');
        } else {
            // check if the value in the cell is a 10 digit number
            var reg = new RegExp('[0-9]{10}');
            data.forEach((row:any)=>{
                if (reg.test(row.phone_number.slice(row.phone_number.length - 10))) {
                    var call = {
                        'phoneNumber': row.phone_number.slice(row.phone_number.length - 10),
                        'timestamp': new Date().getTime(),
                        'rawType': '',
                        'type': '',
                        'duration': '',
                        'name': '',
                        'dateTime': moment().format('YYYY-MM-DD'),
                    };
                    this.addNumber(call, listName);
                }
            });
        }
    }
    // convert the csv file content to a json object
    csvJSON(csv:any){
        var lines = csv.split('\r\n');
        //console.log(lines);
        var result = [];
        var headers = lines[0].split(',');
        //console.log(headers);
        for (var i = 1; i < lines.length; i++){
            if (lines[i] !== '') {
                var obj = {};
                var currentline = lines[i].split(',');
                console.log(currentline);
                for (var j = 0; j < headers.length; j++){
                    obj[String(headers[j])] = currentline[j];
                }
                result.push(obj);
            }
        }
        return result; //JavaScript object
        //return JSON.stringify(result); //JSON
    }
    // the method to pick a csv file and then call subsequent function
    async filePicker(listName:String) {
        console.log('import fb leads pressed');
        try {
            const res = await DocumentPicker.pick({
              type: [DocumentPicker.types.allFiles],
              //There can me more options as well
              // DocumentPicker.types.allFiles
              // DocumentPicker.types.images+
              // DocumentPicker.types.plainText
              // DocumentPicker.types.audio
              // DocumentPicker.types.pdf
            });
            //Printing the log realted to the file
            console.log('res : ' + JSON.stringify(res));
            console.log('URI : ' + res.uri);
            console.log('Type : ' + res.type);
            console.log('File Name : ' + res.name);
            console.log('File Size : ' + res.size);
            //Setting the state to show single file attributes
            if (res.type !== 'text/csv')
            {
                Alert.alert('File selected is not a csv file');
            } else {
                //console.log(res);
                const exportedFileContent = await fs.readFile(res.uri, 'ascii');
                //this.csvJSON(exportedFileContent);
                var data = this.csvJSON(exportedFileContent);
                //console.log(data);
                this.loadAllNumbers(data,listName);
                this.props.navigation.navigate('Options');
            }
          } catch (err) {
            //Handling any exception (If any)
            if (DocumentPicker.isCancel(err)) {
              //If user canceled the document selection
              Alert.alert('Canceled from single doc picker');
            } else {
              //For Unknown Error
              Alert.alert('Unknown Error: ' + JSON.stringify(err));
              console.log('Unknown Error: ' + JSON.stringify(err));
              throw err;
            }
          }
    }
    // render the list in which the numbers from the csv can be added
    renderList() {
        return this.state.item.map(item => {
          return <ListItem key={item.name}
              onPress={()=> {console.log(String(item.name) + ' is selected');
                this.filePicker(String(item.name));}}
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
