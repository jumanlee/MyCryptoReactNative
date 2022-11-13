import React from 'react';
import { useState, useEffect, useRef, useMemo } from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView, ScrollView, TextInput, TouchableOpacity, Linking, Alert, Modal, TouchableWithoutFeedback, Keyboard } from 'react-native';
// import styles from '../../style/styles';
import {Ionicons} from '@expo/vector-icons';
import { Cell, Section, TableView } from 'react-native-tableview-simple';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { GestureHandlerRootView } from "react-native-gesture-handler";
// import {recommendAlgo, calculateMovement} from './algo';
import { addWallet, deductWallet } from '../redux/actions';
import { connect } from 'react-redux'
import styles from '../style/styles';
import Popup from './components/walletscreen-components/Popup';

const Walletscreen = ({funds}) => {

    //    const addedAmount = useRef(null);
    //    const deductedAmount = useRef(null);

       const [displays, setDisplays] = useState(
        {options: {
            popup: false,
            addFunds: false,
            withdrawFunds: false,
        }
    })

    return(
        <SafeAreaView style={styles.container}>
            <ScrollView style={{height:"100%"}}>

            <Popup displays={displays} setDisplays={setDisplays}/>

            <View style={styles.walletContainer}>
                <View style = {styles.titleContainer}><Text style={styles.titleText}>Wallet</Text></View>
                <View style={styles.cell}>
                    <Text style={styles.boldText}>Available funds: USD {funds}</Text>

                        <View style={styles.popupButtonContainer}>
                            <TouchableOpacity style={styles.popupButton} onPress={() => {setDisplays({...displays, options: {
                            popup: true,
                            addFunds: true,
                            withdrawFunds: false,
                            },
                        })}}>
                                <Text style={styles.popupButtonText}>Add funds</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.popupButton} onPress={() =>  {setDisplays({...displays, options: {
                            popup: true,
                            addFunds: false,
                            withdrawFunds: true,
                            },
                        })}}>
                                <Text style={styles.popupButtonText}>Withdraw funds</Text>
                            </TouchableOpacity>
                        </View>
                </View>
            </View>
            </ScrollView>
        </SafeAreaView> 
    )
}

const mapStateToProps = state => {
    // console.log(state.funds);
    return {
        funds: state.funds
    }
}

//connect states and despatches to props
export default connect(
    mapStateToProps, 
    )(Walletscreen)



