import React, { useCallback } from 'react';
import { useState, useEffect, useRef, useMemo } from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView, ScrollView, TextInput, TouchableOpacity, Linking, Alert, Modal, TouchableWithoutFeedback, Keyboard } from 'react-native';
import styles from '../../../style/styles';
import {Ionicons} from '@expo/vector-icons';
import { Cell, Section, TableView } from 'react-native-tableview-simple';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer, useFocusEffect } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {recommendAlgo, calculateMovement, todayDateGenerate} from '../algo';
import Popup from './Popup';
import renderList from './renderList';
import { updateAssetPrice, assetList } from '../../../redux/actions';
import { connect } from 'react-redux';


const ListScreen = ({navigation, updateAssetPrice, assetList}) => {

    //general app states
    const [name, setName] = useState('');
    const [mainList, setMainList] = useState([]);
    const [apiData, setApiData] = useState(null);
    // const [lastRefreshed, setLastRefreshed] = useState(null);
    const [render, setRender] = useState(false);

    const lastRefreshed = useRef(null);

    //popup window states
    const popupName = useRef(null);
    const popupJson = useRef(null);
    const popupDates = useRef(null);
    const popupPrice = useRef(null);
    const [displays, setDisplays] = useState(
        {options: {
            popup: false,
            buy: false,
            sell: false,
            buttons: false,
        }
    })
   
    //component to save data 
    const setData = async () => {
        var user = name;
        await AsyncStorage.setItem(user, user);
    }
    
    //component to retrieve data from AsyncStorage
    const getData = async () => {

        try{
            const keys = await AsyncStorage.getAllKeys();
            const result = await AsyncStorage.multiGet(keys);
            for(let i = 0; i < result.length; i++){

                //be sure to ignore redux persist in Async Storage
                if(result[i][0] != "persist:root"){
                    //get the result
                    getAPI(result[i][0]);
                }

            }
        }catch(error){
            console.error("error with AsyncStorage.multiGet(keys) or AsyncStorage.getAllKeys()");
        }
    }

    //component to remove data from the list and async storage
    const removeData = async (currency) => {
        for(let i = mainList.length - 1; i >= 0; i--){
            if(mainList[i].Currency == currency)
            {
                //ensure that user is not deleting a currency that they still own
                if(assetList.hasOwnProperty(mainList[i].Fullname))
                {
                    if(assetList[mainList[i].Fullname]["quantity"] > 0){
                        Alert.alert("You can't untrack a currency that you still own. To delete, make sure you've sold off the currency.");
                    }
                    else
                    {
                        //proceed to remove said crypto
                        AsyncStorage.removeItem(currency, (err) => console.log('removed data!', err));
                        //remove the i'th data from mainList
                        setMainList((mainList) => mainList.filter((_, index) => index !== i));
                    }
                }
                else
                {
                    //proceed to remove said crypto
                    AsyncStorage.removeItem(currency, (err) => console.log('removed data!', err));
                    //remove the i'th data from mainList
                    setMainList((mainList) => mainList.filter((_, index) => index !== i));
                }

                break;
            }
        }
    }

    //component to delete all data on the list
    const removeAll = async () => {
        setMainList([]);
        AsyncStorage.clear().then(() => console.log('Cleared'));
    }

    //component to retrieve data from user input
    const getAPI = async (coin) => {

        //change all to capital letters to be inserted into the link
        coin = coin.toUpperCase();

        //remove all white spaces that could have been inserted by mistake
        coin = coin.replaceAll(' ','');

        // Link with real API key (Please use this sparringly. As the limit for this free API key is only 500 API calls per day! If you exceed the limit, you can always use the free demo link below to test)
        // `https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=${coin}&market=CNY&apikey=282FMJHWV610CAN8`


        // Free demo API link. This is a free link and nly displays the free available data that doesn't require an API key:
        // 'https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=BTC&market=CNY&apikey=demo'


       fetch(`https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=${coin}&market=CNY&apikey=282FMJHWV610CAN8`, {

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

            //set the date for last refreshed
            lastRefreshed.current = json["Meta Data"]["6. Last Refreshed"];

            // setLastRefreshed(json["Meta Data"]["6. Last Refreshed"]);

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

            console.log(error);
        });
    }

    //initial render, only runs once
    // useEffect(() => {

    //     //reset the mainList
    //     setMainList([]);

    //     //get any data that was previously stored in AsyncStorage. 
    //     getData();

    // }, [])


    useFocusEffect( useCallback(() => {

        console.log("useFocusEffect rendered");

        let todayDate = todayDateGenerate();
        console.log(todayDate);
        console.log(lastRefreshed.current);

        if(lastRefreshed.current != null){

           let isSameDate = lastRefreshed.current.includes(todayDate);

           console.log(isSameDate);

            if(!isSameDate){

                console.log("!samedate render")
                //reset the mainList
                setMainList([]);

                //get any data that was previously stored in AsyncStorage. 
                getData();
            }
        }
        else{

            console.log("else render");
            //reset the mainList
            setMainList([]);

            //get any data that was previously stored in AsyncStorage. 
            getData();
        }
        
    }, []))

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

    //For updating prices in portfolio. Use useeffect to track changes in mainlist, if there are changes, then update all the market prices in portfolio. 
    useEffect(() => {

        if(mainList.length != 0){
            updateAssetPrice([...mainList]);
        }

    }, [mainList])

    //generate the list of cryptocurrencies and return below
    const generateList = renderList(mainList, popupName, popupJson, popupDates, popupPrice, displays, setDisplays, removeData, assetList);

    if(mainList.length != 0)
    {
        return(
            <SafeAreaView style={styles.container}>
              <ScrollView style={{height:"100%"}}> 

                {/* popup window component. Passing down all the neccessary props */}
                <Popup displays={displays} popupJson={popupJson} popupDates={popupDates} popupName={popupName} popupPrice={popupPrice} setDisplays={setDisplays} navigation={navigation}/>

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
                        <Text style={styles.lastRefreshed}>Last refreshed: {lastRefreshed.current}</Text>

                        {/* function to generate the list of cryptocurrency items */}
                        {generateList}
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

// export default ListScreen;

const mapStateToProps = state => {
    // console.log(state.funds);
    return {
        assetList: state.portfolio.assetList,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        updateAssetPrice: (_mainList) => dispatch(updateAssetPrice(_mainList)),
    }
}

//connect states and despatches to props
export default connect(
    mapStateToProps, 
    mapDispatchToProps
    )(ListScreen)

