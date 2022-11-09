import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, SafeAreaView, ScrollView } from 'react-native';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Cell, Section, TableView } from 'react-native-tableview-simple';
import Tabscreens from "./screens/Tabscreens";
import React from 'react';
import { Provider } from 'react-redux'
import store from './redux/store'


export default function App() {
  return (
    <Provider store={store}>
        <Tabscreens/>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
