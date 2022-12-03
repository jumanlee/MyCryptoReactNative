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
import { deductWallet, addWallet, reset, addTransac, addAsset, sellAsset, assetList } from '../../../redux/actions';
import { connect } from 'react-redux';

//popup container component 
const Popup = ({displays, setDisplays, popupJson, popupDates, popupName, popupPrice, funds, deductWallet, addWallet, addAsset, sellAsset, addTransac, assetList, navigation}) => {

    //use ref for input values
    const quantityInput = useRef(null);
    const priceInput = useRef(null);

    return (
        <Modal transparent visible={displays.options.popup} 
        backdropTransitionOutTiming={0}>
            {/* placed touchablewithoutfeedback so that user can dismiss keyboard by clicking elswhere on the popup when no longer wants to edit in the input field */}
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.popupContainer}>
                    <View style={styles.popup}>
                        <View style={styles.popupX}>
                            <Text style={{fontSize: 20, fontWeight: 'bold', color: '#800080'}}>{popupName.current} price:</Text>
                                <TouchableOpacity onPress={()=>{setDisplays({...displays, options: {
                                        popup: false,
                                        sell: false,
                                        buy: false,
                                        buttons: false,
                                    },
                                })}}>
                                    <Text style={styles.popupXText}>X</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.popupX}>
                                <Text style={{...styles.titleText, marginBottom: '3%'} }>US${parseFloat(popupPrice.current).toLocaleString("en-US")}</Text>
                            </View>

                            {displays.options.buy ? 
                            <View>
                                <View style={styles.popupInputContainer}>
                                    <Text style={styles.popupInputTitle}>Price (USD):</Text>
                                    <TextInput style = {styles.popupInput} placeholderTextColor={'grey'} placeholder="Enter price (USD)"  onChangeText={(value) => priceInput.current = value}  keyboardType="numeric"/>
                                    <Text style={styles.popupInputTitle}>Quantity:</Text>
                                    <TextInput style = {styles.popupInput} placeholderTextColor={'grey'} placeholder="Enter quantity"  onChangeText={(value) => quantityInput.current = value} keyboardType="numeric"/>
                                </View> 
                                <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
                                    <TouchableOpacity style={styles.popupBack} onPress={()=> { 

                                            if(priceInput.current != null && quantityInput.current != null){

                                                let totalAmount = priceInput.current*quantityInput.current;

                                                if(totalAmount > funds){
                                                    Alert.alert("Insufficient funds. Please top up your wallet!");
                                                }else if(parseFloat(priceInput.current) < parseFloat(popupPrice.current)){
                                                    Alert.alert("You can't buy lower than the market price! You're very unlikely to get an order filled in the real world!");
                                                }else{
                                                    deductWallet(totalAmount);
                                                    addAsset(popupName.current, popupPrice.current, quantityInput.current, totalAmount);
                                                    addTransac(`Bought ${quantityInput.current} ${popupName.current} for USD ${parseFloat(totalAmount).toLocaleString("en-US")}`);
                                                    quantityInput.current = null;
                                                    priceInput.current = null;

                                                    //reset the popup window, close it. 
                                                    setDisplays({...displays, options: {
                                                        popup: false,
                                                        sell: false,
                                                        buy: false,
                                                        buttons: false,
                                                    }})
                                                }
                                            }
                                        }}>
                                            <Text style = {styles.popupBackText}>Buy</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={styles.popupBack} onPress={()=> {setDisplays({...displays, options: {
                                            popup: true,
                                            sell: false,
                                            buy: false,
                                            buttons: true,
                                        },
                                    });}}>
                                            <Text style = {styles.popupBackText}>Back</Text>
                                    </TouchableOpacity>
                                </View>
                                
                            </View> : null}

                            {displays.options.sell ? 
                            <View>
                            <View style={styles.popupInputContainer}>
                                <Text style={styles.popupInputTitle}>Price (USD):</Text>
                                <TextInput style = {styles.popupInput} placeholder="Enter price (USD)" returnKeyType="send" onChangeText={(value) => priceInput.current = value}  keyboardType="numeric"/>
                                <Text style={styles.popupInputTitle}>Quantity:</Text>
                                <TextInput style = {styles.popupInput} placeholder="Enter quantity (USD)" returnKeyType="send" onChangeText={(value) => quantityInput.current = value} keyboardType="numeric"/>
                            </View> 
                            <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
                                <TouchableOpacity style={styles.popupBack} onPress={()=> {
                                        if(priceInput.current != null && quantityInput.current != null){

                                            let totalAmount = priceInput.current*quantityInput.current;

                                            if(parseFloat(priceInput.current) > parseFloat(popupPrice.current)){
                                                Alert.alert("You can't sell higher than the market price! You're very unlikely to get an order filled in the real world!");
                                            }else if(quantityInput.current > assetList[popupName.current]["quantity"]){
                                                Alert.alert("You can't sell more crypto than you own!");
                                            }else{
                                                addWallet(totalAmount);
                                                sellAsset(popupName.current, popupPrice.current, quantityInput.current, totalAmount);
                                                addTransac(`Sold ${quantityInput.current} ${popupName.current} for USD ${parseFloat(totalAmount).toLocaleString("en-US")}`);
                                                quantityInput.current = null;
                                                priceInput.current = null;

                                                //reset the popup window, close it. 
                                                setDisplays({...displays, options: {
                                                    popup: false,
                                                    sell: false,
                                                    buy: false,
                                                    buttons: false,
                                                }})
                                            }
                                        }
                                }}>
                                        <Text style = {styles.popupBackText}>Sell</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.popupBack} onPress={()=> {setDisplays({...displays, options: {
                                        popup: true,
                                        sell: false,
                                        buy: false,
                                        buttons: true,
                                    },
                                });}}>
                                        <Text style = {styles.popupBackText}>Back</Text>
                                </TouchableOpacity>
                            </View>

                            </View> : null}

                            { displays.options.buttons ? 
                            <View style={styles.popupButtonContainer}>
                                <TouchableOpacity style={styles.popupButton} onPress={() => {setDisplays({...displays, options: {
                                        popup: true,
                                        buy: true,
                                        sell: false,
                                        buttons: false,
                                    },
                                })}}>
                                    <Text style={styles.popupButtonText}>Buy</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.popupButton} onPress={() => {setDisplays({...displays, options: {
                                        popup: true,
                                        buy: false,
                                        sell: true,
                                        buttons: false,
                                    },
                                })}}>
                                    <Text style={styles.popupButtonText}>Sell</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.popupButton} onPress={()=> {navigation.navigate("DetailScreen", {"Json": popupJson.current, "Dates": popupDates.current}); setDisplays({...displays, options: {
                                        popup: false,
                                        sell: false,
                                        buy: false,
                                        buttons: false,
                                    },
                                })}}>
                                    <Text style={styles.popupButtonText}>Details</Text>
                                </TouchableOpacity>
                            </View> 
                            : null }
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    )
}

const mapStateToProps = state => {
    // console.log(state.funds);
    return {
        funds: state.wallet.funds,
        assetList: state.portfolio.assetList,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        //match deductWallet() to a prop called deductWallet
        deductWallet: (_deductedAmount) => dispatch(deductWallet(_deductedAmount)),
        addWallet: (_addedAmount) => dispatch(addWallet(_addedAmount)),
        addAsset: (_name, _marketPrice, _quantity, _invested) => dispatch(addAsset(_name, _marketPrice, _quantity, _invested)),
        sellAsset: (_name, _marketPrice, _quantity, _sale) => dispatch(sellAsset(_name, _marketPrice, _quantity, _sale)),
        addTransac: (item) => dispatch(addTransac(item)),
        reset: () => dispatch(reset()),
    }
}

//connect states and despatches to props
export default connect(
    mapStateToProps, 
    mapDispatchToProps
    )(Popup)
