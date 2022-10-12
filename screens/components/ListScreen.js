import React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView, ScrollView, TextInput, TouchableOpacity, Linking, Alert } from 'react-native';
import styles from '../../style/styles';
import {Ionicons} from '@expo/vector-icons';
import { Cell, Section, TableView } from 'react-native-tableview-simple';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {recommendAlgo, calculateMovement} from './algo';


const ListScreen = ({navigation}) => {

    const [name, setName] = useState('');
    const [mainList, setMainList] = useState([]);
    const [apiData, setApiData] = useState(null);
    const [lastRefreshed, setLastRefreshed] = useState(null);

    const setData = async () => {
        var user = name;
        await AsyncStorage.setItem(user, user);
    }
    
    //retrieve data from AsyncStorage
    const getData = async () => {

        try{
            const keys = await AsyncStorage.getAllKeys();
            const result = await AsyncStorage.multiGet(keys);
            for(let i = 0; i < result.length; i++){
                getAPI(result[i][0]);
            }
        }catch(error){
            console.error("error with AsyncStorage.multiGet(keys) or AsyncStorage.getAllKeys()");
        }
    }

    const removeData = async (currency) => {
        for(let i = mainList.length - 1; i >= 0; i--){
            if(mainList[i].Currency == currency){
                AsyncStorage.removeItem(currency, (err) => console.log('removed data!', err));
                //remove the i'th data from mainList
                setMainList((mainList) => mainList.filter((_, index) => index !== i));
                break;
            }
        }
    }

    const removeAll = async () => {
        setMainList([]);
        AsyncStorage.clear().then(() => console.log('Cleared'));
    }

    const getAPI = async (coin) => {

        //change all to capital letters to be inserted into the link
        coin = coin.toUpperCase();

        //remove all white spaces that could have been inserted by mistake
        coin = coin.replaceAll(' ','');

        // Link with real API key (Please use this sparringly. As the limit for this free API key is only 500 API calls per day! If you exceed the limit, you can always use the free demo link below to test)
        // `https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=${coin}&market=CNY&apikey=282FMJHWV610CAN8`


        // Free demo API link. This is a free link and nly displays the free available data that doesn't require an API key:
        // 'https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=BTC&market=CNY&apikey=demo'

       fetch('https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=BTC&market=CNY&apikey=demo', {

            method: "GET",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then((response) => response.json())
        .then((json) => {

            //get all dates in the fetched api
            let dates = Object.keys(json['Time Series (Digital Currency Daily)']);

            let recommend = recommendAlgo(json, dates);

            //calculate the daily price movement percentage
            let movement = calculateMovement(json, dates);
            
            //get name of cryptocurrency and turn it into string.
            let currency = String(json["Meta Data"]["2. Digital Currency Code"]);

            let currencyFullName = String(json["Meta Data"]["3. Digital Currency Name"]);

            setLastRefreshed(json["Meta Data"]["6. Last Refreshed"]);

            setApiData({
                    "Currency": currency, 
                    "Fullname": currencyFullName,
                    "Today": json['Time Series (Digital Currency Daily)'][dates[0]]['4b. close (USD)'],
                    "Movement": movement,
                    "Recommend": recommend,
                    "Json": json,
                    "Dates": dates,
                    });
        })
        .catch((error) => {
            Alert.alert('Error loading API data. This is either due to an invalid ticker symbol being inserted or it is an issue with API provider www.alphavantage.co . If it is because alphavantage.co is down, then please try again later:');
        });
    }

    //initial render
    useEffect(() => {

        //reset the mainList
        setMainList([]);

        //get any data that was previously stored in AsyncStorage. 
        getData();

    }, [])

    // this useEffect watches "apiData" to see if there is any change. If so, this will update mainList
    useEffect(() => { 

        if(apiData != null){

            let duplicate = false;

            for(let i=0; i< mainList.length; i++){
                if(mainList[i].Currency == apiData.Currency){
                        duplicate = true;
                        break;
                }
            }
            if(duplicate == false){

                setMainList(mainList => [...mainList, apiData]);

                AsyncStorage.getItem(apiData.Currency).then((value) => {
                    if(value == null){
                        AsyncStorage.setItem(apiData.Currency, apiData.Currency);
                    }
                })
            }
        }   
    }, [apiData]);

    if(mainList.length != 0)
    {
        return(
            <SafeAreaView style={styles.container}>
              <ScrollView style={{height:"100%"}}> 
                <View style={styles.inputField}>
                    <Ionicons name='add' size={20} />
                    <TextInput style = {{width: '100%'}} placeholder="  Add crypto ticker (e.g. BTC)" returnKeyType="send" onSubmitEditing={value => getAPI(value.nativeEvent.text)}/>
                </View>

                <View style={styles.titleContainer}>
                    <Text style={styles.titleText}>Crypto Watchlist</Text>
                    <TouchableOpacity onPress={removeAll} style={styles.deleteAllContainer}>
                        <Ionicons name='remove-circle-outline' size={20} color='#DCDCDC' />
                    
                        <Text style={styles.deleteAllText}>Delete All</Text>
                    </TouchableOpacity>
                </View>
                <View>
                        <Text style={styles.lastRefreshed}>Last refreshed: {lastRefreshed}</Text>
                        {
                            [...mainList].map((object) => {
                                return (

                                //swipe to delete functionality
                                <Swipeable renderLeftActions={() => {
                                    return(
                                        <TouchableOpacity style={styles.swipeContainer} onPress={()=>removeData(object.Currency.toString())}>
                                        <View >
                                            <Text style={styles.swipeText}>Delete</Text>
                                        </View>
                                        </TouchableOpacity>)
                                }} 
                                friction={2} key={object.Currency.toString()}>

                                    <View style={styles.cell}>
                                    
                                        <TouchableOpacity onPress={()=> navigation.navigate("DetailScreen", {"Json": object.Json, "Dates": object.Dates})}>
                                            <Text style={styles.boldText}>{`Currency: ${object.Fullname} (${object.Currency})`}</Text>
                                            <Text>{`Latest price: USD ${object["Today"]}`}</Text>

                                            {/* display price movement information. This is conditional. If price movement is positive, then a green up arrow is displayed, otherwise, a red down arrow is displayed.  */}
                                            {object.Movement > 0 
                                            ? 
                                            <View style={styles.cellItem}><Text>Price Movement: </Text><Ionicons name='arrow-up-circle' size={20} color='rgba(0,255,0,0.5)' /><Text> {object.Movement}%</Text></View> 
                                            : 
                                            <View style={styles.cellItem}><Text>Price movement: </Text><Ionicons name='arrow-down-circle-sharp' size={20} color='rgba(255,0,0,0.5)' /><Text> {object.Movement}%</Text></View>}

                                            {/* display recommendation based on the calculated moving average. If the recommendation is buy, then a green thumbs up will show, otherwise a red thumbs down will show.  */}
                                            {object.Recommend == "BUY" 
                                            ? 
                                            <View style={styles.cellItem}><Text>Recomend: </Text><Ionicons name='thumbs-up' size={20} color='rgba(0,255,0,0.5)' /><Text> {object.Recommend}</Text></View>
                                            :
                                            <View style={styles.cellItem}><Text>Recomend: </Text><Ionicons name='md-thumbs-down' size={20} color='rgba(255,0,0,0.5)' /><Text> {object.Recommend}</Text></View>
                                            }
                                            
                                        </TouchableOpacity>
                                    </View>
                                </Swipeable>
                                )
                            })
                        }
                </View>
              </ScrollView>
            </SafeAreaView>
          )
    }
    else
    {
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView style={{height:"100%"}}>
                    <View style={styles.inputField}>
                        <Ionicons name='add' size={20} />
                        <TextInput style = {{width: '100%'}} placeholder="  Add crypto ticker (e.g. BTC)" returnKeyType="send" onSubmitEditing={value => getAPI(value.nativeEvent.text)}/>
                    </View>

                    <View style={styles.titleContainer}>
                        <Text style={styles.titleText}>Crypto Watchlist</Text>
                    </View>
                    <View style={styles.cell}>
                        <Text style={styles.boldText}>No cryptocurrencies to display. You can add one on your watchlist using the input field. Some crypto ticker examples are: BTC, LTC, DOGE, ETH, ZEC and XLM</Text>
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }
}

export default ListScreen;