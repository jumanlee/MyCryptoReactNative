import React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView, ScrollView, TextInput, TouchableOpacity, Linking, Alert } from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import { Cell, Section, TableView } from 'react-native-tableview-simple';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const NewsScreenApp = () => {

    const [newsList, setNewsList] = useState([]);

    const getNewsAPI = async () => 
    {

        // Link with real API key (Please use this sparringly. As the limit for this free API key is only 500 API calls per day! If you exceed the limit, you can always use the free demo link below to test)
        'https://www.alphavantage.co/query?function=NEWS_SENTIMENT&time_from=20220410T0130&limit=50&apikey=282FMJHWV610CAN8'

        // Free demo API link. This is a free link and nly displays the free available data that doesn't require an API key:
        'https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=COIN,CRYPTO:BTC,FOREX:USD&time_from=20220410T0130&limit=200&apikey=demo'

        fetch(
            'https://www.alphavantage.co/query?function=NEWS_SENTIMENT&time_from=20220410T0130&limit=50&apikey=282FMJHWV610CAN8', 
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

    useEffect(() => { 

        getNewsAPI();

    }, [])
 

    if(newsList.length > 0){
        return (

            <SafeAreaView style={styles.container}>
                <ScrollView style={{height:"100%"}}>
                    <View>
                        <View style = {styles.titleContainer}>
                            <Text style={styles.titleText}>General Finance News</Text>
                        </View>
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
            </ScrollView>
        </SafeAreaView>
        )
    }
}

export default NewsScreenApp;

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

    trashBin: {
        position: 'absolute',
        right: "5%",
        top: "30%",
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