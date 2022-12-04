
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {Ionicons} from '@expo/vector-icons';
import HomeScreenApp from './Homescreen';
import NewsScreenApp from './Newsscreen';
import Walletscreen from './Walletscreen';
import Portfolioscreen from './Portfolioscreen';
import React from 'react';

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

            } else if (route.name === 'Wallet') {
                iconName = focused
                ? 'stopwatch'
                : 'stop-circle';
              
            } else if (route.name === 'Portfolio') {
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
        <Tab.Screen name="Wallet" component={Walletscreen}/>
        <Tab.Screen name="Portfolio" component={Portfolioscreen}/>
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

