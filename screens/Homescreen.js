import React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView, ScrollView, TextInput, TouchableOpacity, Linking, Alert } from 'react-native';
import styles from '../style/styles';
import {Ionicons} from '@expo/vector-icons';
import { Cell, Section, TableView } from 'react-native-tableview-simple';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ListScreen from './components/homescreen-components/ListScreen';
import DetailScreen from './components/homescreen-components/DetailScreen';

// NOTE TO MARKER
// Please note that as this is a third party API, I cannot guarantee that the API server is always up and running. In the unlikely event that the API server is down, please wait for a few hours or come back the following day and try the app again. In any case, I have already recorded a video, which has been uploaded onto Youtube https://www.youtube.com/watch?v=zzggsHxq0ic&t=9s demonstrating how the app is used. In that video, it is shown how the API data is fetched successfully when the server is up and running. To test whether the API server is down, just visit www.alphavantage.co and it should be up and running if the server is operational. 

// Another important point is that a free API key is used in this app. The free version only allows up to 5 API requests per minute and 500 API requests per day to be made. Certainly, if this app is made available on the app store, it is essential to subscribe to a premium API Key, which allows for many more API requests per minute and day. However, for the sake of this project, I feel the free version is sufficient. Therefore, please use the API sparingly and try not to exceed the limit. 

// REMINDER: Every item that you add to the list equates to one API request. And everytime you go to the General News Screen or the Crypto-Specific News Screen, it equates to one API request. Therefore, it is very easy to exceed 5 API requests PER MINUTE. Please becareful about this. If this app is to be made available to the app store, the free version of the API service certainly wouldn't do. Instead, a premium version of the API service is needed, which requires payment.

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

