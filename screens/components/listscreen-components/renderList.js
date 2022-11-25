
import React from 'react';
import { useState, useEffect, useRef, useMemo } from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView, ScrollView, TextInput, TouchableOpacity, Linking, Alert, Modal, TouchableWithoutFeedback, Keyboard } from 'react-native';
import styles from '../../../style/styles';
import {Ionicons} from '@expo/vector-icons';
import { Cell, Section, TableView } from 'react-native-tableview-simple';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { GestureHandlerRootView } from "react-native-gesture-handler";




//component to render the list of items
const renderList = (mainList, popupName, popupJson, popupDates, popupPrice, displays, setDisplays, removeData) => useMemo(() => {

    console.log("render within useMemo");
    //useMemo is used to prevent unnessary renders if the mainlist state remains the same. 
    return(
    //because mainList is an array, if you put [mainlist] it would mean [["Content"]], so you need to use ...mainlist to CLONE the content into [].
    [...mainList].map((object) => {

        // updateAssetPrice(object.Fullname, object.Today);

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
            
                <TouchableOpacity onPress={()=> {popupName.current = object.Fullname; popupJson.current = object.Json; popupDates.current = object.Dates; popupPrice.current = object.Today
                    setDisplays({...displays, options: {
                        popup: true,
                        buy: false,
                        sell: false,
                        buttons: true,
                    },
                })}}>
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
    }))

}, [mainList])


export default renderList;
