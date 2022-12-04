import React from 'react';
import { useState, useEffect } from 'react';
import {Text, View, Image, SafeAreaView, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import styles from '../style/styles';

const NewsScreenApp = () => {

    const [newsList, setNewsList] = useState([]);

    const getNewsAPI = async () => 
    {

        // Link with real API key (Please use this sparringly. As the limit for this free API key is only 500 API calls per day! If you exceed the limit, you can always use the free demo link below to test)
        'https://www.alphavantage.co/query?function=NEWS_SENTIMENT&time_from=20220410T0130&limit=50&apikey=282FMJHWV610CAN8'

        // Free demo API link. This is a free link and nly displays the free available data that doesn't require an API key:
        'https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=COIN,CRYPTO:BTC,FOREX:USD&time_from=20220410T0130&limit=200&apikey=demo'

        fetch(
            'https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=COIN,CRYPTO:BTC,FOREX:USD&time_from=20220410T0130&limit=200&apikey=demo', 
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
