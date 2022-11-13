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
import { deductWallet, addWallet } from '../../../redux/actions';
import { connect } from 'react-redux';



    const Popup = ({displays, setDisplays, funds, addWallet, deductWallet}) => {

        const addedAmount = useRef(null);
        const deductedAmount = useRef(null);

        return (
            <Modal transparent visible={displays.options.popup} backdropTransitionOutTiming={0}>
                {/* placed touchablewithoutfeedback so that user can dismiss keyboard by clicking elswhere on the popup when no longer wants to edit in the input field */}
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.popupContainer}>
                        <View style={styles.popup}>
                            <View style={styles.popupX}>
                                <Text></Text>
                                <TouchableOpacity onPress={()=>{
                                    setDisplays({...displays, options: {
                                        popup: false,
                                        addFunds: false,
                                        withdrawFunds: false,
                                        },
                                    })}}>
                                    <Text style={styles.popupXText}>X</Text>
                                </TouchableOpacity>
                            </View>

                            { displays.options.addFunds && displays.options.popup ? 
                                <View>
                                    <View style={styles.popupInputContainer}>
                                        <Text style={styles.popupInputTitle}>Funds to be added (USD):</Text>
                                        <TextInput style = {styles.popupInput} placeholderTextColor={'grey'} placeholder="Enter amount"  onChangeText={(value) => addedAmount.current = value}  keyboardType="numeric"/>
                                    </View> 
                                    <View style={{flexDirection: 'row', justifyContent: 'flex-start', marginLeft: '5%', marginTop: '1%'}}>
                                        <TouchableOpacity style={styles.popupBack} onPress={
                                            () => { 
                                                if(addedAmount.current != null){
                                                    addWallet(addedAmount.current);
                                                    addedAmount.current = null;
                                                    setDisplays({...displays, options: {
                                                        popup: false,
                                                        addFunds: false,
                                                        withdrawFunds: false,
                                                        },
                                                    });
                                                }
                                            }}>
                                                <Text style = {styles.popupButtonText}>Submit</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View> 
                            : null }

                            { displays.options.withdrawFunds && displays.options.popup ? 
                                <View>
                                    <View style={styles.popupInputContainer}>
                                        <Text style={styles.popupInputTitle}>Funds to be withdrawn (USD):</Text>
                                        <TextInput style = {styles.popupInput} placeholderTextColor={'grey'} placeholder="Enter amount"  onChangeText={(value) => deductedAmount.current = value}  keyboardType="numeric"/>
                                    </View> 
                                    <View style={{flexDirection: 'row', justifyContent: 'flex-start', marginLeft: '5%', marginTop: '1%'}}>
                                        <TouchableOpacity style={styles.popupBack} onPress={
                                            () => { 
                                                if(deductedAmount.current != null){
                                                    deductWallet(deductedAmount.current);
                                                    deductedAmount.current = null;
                                                    setDisplays({...displays, options: {
                                                        popup: false,
                                                        addFunds: false,
                                                        withdrawFunds: false,
                                                        },
                                                    });
                                                }
                                            }}>
                                                <Text style = {styles.popupButtonText}>Submit</Text>
                                        </TouchableOpacity>
                                    </View>
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
            funds: state.funds
        }
    }
    
    const mapDispatchToProps = dispatch => {
        return {
            //match deductWallet() to a prop called deductWallet
            deductWallet: (_deductedAmount) => dispatch(deductWallet(_deductedAmount)),
            addWallet: (_addedAmount) => dispatch(addWallet(_addedAmount)),
        }
    }
    
    //connect states and despatches to props
    export default connect(
        mapStateToProps, 
        mapDispatchToProps
        )(Popup)

    // export default Popup;