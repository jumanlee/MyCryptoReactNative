import React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView, ScrollView, TextInput, TouchableOpacity, Linking, Alert } from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import { Cell, Section, TableView } from 'react-native-tableview-simple';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { GestureHandlerRootView } from "react-native-gesture-handler";

// NOTE TO MARKER
// Please note that as this is a third party API, I cannot guarantee that the API server is always up and running. In the unlikely event that the API server is down, please wait for a few hours or come back the following day and try the app again. In any case, I have already recorded a video, which has been uploaded onto Youtube https://www.youtube.com/watch?v=zzggsHxq0ic&t=9s demonstrating how the app is used. In that video, it is shown how the API data is fetched successfully when the server is up and running. To test whether the API server is down, just visit www.alphavantage.co and it should be up and running if the server is operational. 

// Another important point is that a free API key is used in this app. The free version only allows up to 5 API requests per minute and 500 API requests per day to be made. Certainly, if this app is made available on the app store, it is essential to subscribe to a premium API Key, which allows for many more API requests per minute and day. However, for the sake of this project, I feel the free version is sufficient. Therefore, please use the API sparingly and try not to exceed the limit. 

// REMINDER: Every item that you add to the list equates to one API request. And everytime you go to the General News Screen or the Crypto-Specific News Screen, it equates to one API request. Therefore, it is very easy to exceed 5 API requests PER MINUTE. Please becareful about this. If this app is to be made available to the app store, the free version of the API service certainly wouldn't do. Instead, a premium version of the API service is needed, which requires payment.

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

            //calculate the 10-day Moving Average 
            let shortAveragesSum = 0;
            for(let i = 0; i < 9; i++){
                shortAveragesSum += parseFloat(json['Time Series (Digital Currency Daily)'][dates[i]]['4b. close (USD)']);
            }

            let shortMovingAverage = shortAveragesSum/10;

            //calculate the 50-day moving average
            let longAveragesSum = 0;

            for(let i = 0; i < 49; i++){
                longAveragesSum += parseFloat(json['Time Series (Digital Currency Daily)'][dates[i]]['4b. close (USD)']);
            }

            let longMovingAverage = longAveragesSum/50;

            //calculate recommendation. If 10-day moving average of price is greater than 50-day moving average of price, then the recommendation should be BUY, otherwise, recommendation should be SELL. This is based on the Simple Moving Average trading methodology.
            let recommend;

            if(shortMovingAverage > longMovingAverage){
                recommend = "BUY";
            }else{
                recommend = "SELL";
            }

            //calculate the daily price movement percentage
            let movement = 
            parseFloat((json['Time Series (Digital Currency Daily)'][dates[0]]['2b. high (USD)'] - json['Time Series (Digital Currency Daily)'][dates[1]]['2b. high (USD)'])/json['Time Series (Digital Currency Daily)'][dates[1]]['2b. high (USD)'])*100;

            //round up to two decimal places
            movement = movement.toFixed(2);

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

const DetailScreen = ({route, navigation}) => {

    const [newsList, setNewsList] = useState([]);

    let json = route.params.Json;
    //get the associated currency
    let coin = json['Meta Data']['2. Digital Currency Code']; 
    //get all the dates
    let dates = route.params.Dates;
    //empty array to store price history
    let priceHistory = [];

    //get price history from the last 30 days
    for(let i = 0; i < 29; i++){
        try{
            priceHistory.push([dates[i],json['Time Series (Digital Currency Daily)'][dates[i]]['4b. close (USD)']]);
        }catch(error){
            console.log("error loading json or dates data");
        }
    }

    const getNewsAPI = async () => 
    {
        // Link with real API key (Please use this sparringly. As the limit for this free API key is only 500 API calls per day! If you exceed the limit, you can always use the free demo link below to test)
        `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=CRYPTO:${coin}&time_from=20220410T0130&limit=6&apikey=282FMJHWV610CAN8`

        // Free demo API link. This is a free link and nly displays the free available data that doesn't require an API key:
        'https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=COIN,CRYPTO:BTC,FOREX:USD&time_from=20220410T0130&limit=200&apikey=demo'

        fetch(
            `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=CRYPTO:${coin}&time_from=20220410T0130&limit=6&apikey=282FMJHWV610CAN8`, 
            {
                method: "GET",
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }
            }).then((response) => response.json())
            .then((json) => {

                setNewsList(json["feed"]);
            })
            .catch((error) => {

                console.log("error loading news API");

            })
    }

    //function to open an url on a web browser
    const openPage = async (url) => {
        const supported = await Linking.canOpenURL(url);

        if(supported){
            await Linking.openURL(url);
        }else{
            Alert.alert(`Unable to open link: ${url}`);
        }
    }

    //initial render
    useEffect(() => { 

        getNewsAPI();

    }, [])

    if(newsList.length > 0){
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView style={{height:"100%"}}>
                    <View>
                        <View style = {styles.titleContainer}><Text style={styles.titleText}>Top Stories For {json["Meta Data"]["3. Digital Currency Name"]}</Text></View>
                        <View>
                            {newsList.map(
                                (object, index) => {

                                    let imageLink;
                                    if(object["banner_image"] != ""){
                                        imageLink = object["banner_image"];
                                    }
                                    else{
                                        imageLink = "https://g.foolcdn.com/image/?url=https%3A%2F%2Fg.foolcdn.com%2Feditorial%2Fimages%2F699016%2Fgeneric-downward-5.jpg&w=700&op=resize";
                                    }

                                    return(
                                        <View key={index} style={styles.cell}>
                                            <TouchableOpacity onPress={() => {openPage(object.url)}}>
                                                <View>
                                                    <Image source={{uri: imageLink}} style = {styles.image}/>
                                                </View>
                                                <Text style={styles.boldText}>{object["title"]}</Text>
                                                <Text>{object["summary"]}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )
                                }
                            )}
                        </View>

                        <View style = {styles.titleContainer}><Text style={styles.titleText}>Price History of last 30 days</Text></View>

                        <View>
                            {priceHistory.map(
                                (item) => {
                                    return(
                                    <View key={item[0]}>
                                            <View style={styles.cell} >
                                                <Text><Text style={styles.boldText}>Date: </Text> {item[0]}</Text>
                                                <Text><Text style={styles.boldText}>Price: </Text>USD {item[1]}</Text>
                                            </View>
                                    </View>
                                    )
                                }
                            )}
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }
    else{
        return(
        <SafeAreaView style={styles.container}>
            <ScrollView style={{height:"100%"}}>

                <View style = {styles.titleContainer}><Text style={styles.titleText}>Top Stories</Text></View>
                
                <View style={styles.cell}>
                    <Text style={styles.boldText}>Please wait. News data loading.....</Text>
                </View>

                <View style = {styles.titleContainer}><Text style={styles.titleText}>Price History of last 30 days</Text></View>

                <View>
                    {priceHistory.map(
                        (item) => {
                            return(
                            <View key={item[0]}>
                                    <View style={styles.cell} >
                                        <Text><Text style={styles.boldText}>Date: </Text> {item[0]}</Text>
                                        <Text><Text style={styles.boldText}>Price: </Text>USD {item[1]}</Text>
                                    </View>
                            </View>
                            )
                        }
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
        )
    }
}

//set navigation functionality
const Stack = createStackNavigator();

export default function HomeScreenApp(){
    return (
        
          <Stack.Navigator initialRouteName="ListScreen"
            screenOptions={{headerShown: true, headerTitle: "", headerTransparent: false, headerStyle: {backgroundColor: 'rgba(221,160,221,0.5)'}}}
          >
            <Stack.Screen name="ListScreen" component={ListScreen}/>
            <Stack.Screen name="DetailScreen" component={DetailScreen}/>
          </Stack.Navigator>
      );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'rgba(221,160,221,0.5)',
      justifyContent: 'center',
    },

    titleContainer: {
        marginLeft: '5%',
        marginRight: '5%',
        marginBottom: '2%',
        marginTop: '2%',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    titleText:{
        fontSize: 20,
        fontWeight: 'bold',
        color: '#696969',
    },

    inputField: {
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        borderRadius: 20,
        margin: '5%',
        padding: '2%',
        width: '70%',
        borderWidth: 2,
        borderColor: '#E6E6FA',
    },

    lastRefreshed:{
        fontSize: 13,
        color: '#696969',
        marginLeft: '5%',
        marginRight: '5%',
        marginBottom: '2%',
        marginTop: '2%',
    },

    deleteAllContainer:{
        backgroundColor: 'rgba(75,0,130, 0.5)',
        width: '38%',
        paddingRight: '5%',
        paddingLeft: '5%',
        paddingTop: '2%',
        paddingBottom: '2%',
        marginLeft: '5%',
        marginTop: '2%',
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    swipeContainer:{
        backgroundColor: 'red',
        paddingLeft: '3%',
        paddingRight: '3%',
        marginTop: '1%',
        marginRight: '0%',
        marginLeft: '1%',
        marginBottom: '2%',
        borderRadius: 10,
        flexDirection: 'column',
        justifyContent: 'center',

    },

    swipeText: {
        fontWeight: 'bold',
        color: 'white',
    },

    deleteAllText:{
        color: '#DCDCDC',
        textAlign: 'center',
    },

    cell: {
        backgroundColor: 'white',
        width: '90%',
        marginRight: '5%',
        marginLeft: '5%',
        marginTop: '1%',
        marginBottom: '2%',
        padding: '4%',
        borderRadius: 10,
        borderColor: '#E6E6FA',
    },

    cellItem: {
        flexDirection: 'row', 
        justifyContent: 'flex-start', 
        alignItems: 'center',
    },

    boldText: {
        fontWeight: 'bold',
        color: '#800080',
    },

    image: {
        height: 150, 
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        marginBottom: '2%',
    }
  });