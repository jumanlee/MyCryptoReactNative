import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, SafeAreaView, ScrollView } from 'react-native';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Cell, Section, TableView } from 'react-native-tableview-simple';
import {Ionicons} from '@expo/vector-icons';
import HomeScreenApp from './Homescreen';
import NewsScreenApp from './Newsscreen';
import React from 'react';


function NewsScreen(){
  return(
    <SafeAreaView>
      <View>
        <Text>News Screen!</Text>
      </View>
    </SafeAreaView>
  )
}


const Tab = createBottomTabNavigator();

const Tabscreens = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Watchlist"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Watchlist') {
              iconName = focused
                ? 'stopwatch'
                : 'stop-circle';

            } else if (route.name === 'News') {
              iconName = focused
              ? 'stopwatch'
              : 'stop-circle';
            }

          return <Ionicons name={iconName} size={35} color={color}/>;
          }, headerShown: false,
          tabBarActiveTintColor: '#4B0082',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Watchlist" component={HomeScreenApp}/>
        <Tab.Screen name="News" component={NewsScreenApp}/>
      </Tab.Navigator>
    </NavigationContainer>

  );
}

export default Tabscreens;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

