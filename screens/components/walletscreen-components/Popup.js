import React from 'react';
import {useRef} from 'react';
import { Text, View, TextInput, TouchableOpacity, Alert, Modal, TouchableWithoutFeedback, Keyboard } from 'react-native';
import styles from '../../../style/styles';
import { deductWallet, addWallet, addTransac, transactions } from '../../../redux/actions';
import { connect } from 'react-redux';


    const Popup = ({displays, setDisplays, funds, addWallet, deductWallet, addTransac, transactions}) => {

        //userefs for input amounts
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
                                                    
                                                    setDisplays({...displays, options: {
                                                        popup: false,
                                                        addFunds: false,
                                                        withdrawFunds: false,
                                                        },
                                                    });
                                                    
                                                    //opeartions to send info to transaction reducer so that the transactions will be displayed in the transactions section.

                                                    let item = `Added funds of USD ${parseFloat(addedAmount.current).toLocaleString("en-US")}`;
                                                    addTransac(item);

                                                    //reset addedAmount back to null
                                                    addedAmount.current = null;
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
                                                if(deductedAmount.current != null && deductedAmount.current <= funds){
                                                    deductWallet(deductedAmount.current);
                                                    
                                                    setDisplays({...displays, options: {
                                                        popup: false,
                                                        addFunds: false,
                                                        withdrawFunds: false,
                                                        },
                                                    });

                                                    //opeartions to send info to transaction reducer so that the transactions will be displayed in the transactions section.

                                                    let item = `Withdrew funds of USD ${parseFloat(deductedAmount.current).toLocaleString("en-US")}`;
                                                    addTransac(item);

                                                    //reset deductedAmount 
                                                    deductedAmount.current = null;
                                                }else if(deductedAmount.current > funds){
                                                    Alert.alert("You can't withdraw more than the amount of cash you have in your wallet!");

                                                    //reset deducated amount
                                                    deductedAmount.current = null;
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
            funds: state.wallet.funds,
            transactions: state.transac.transactions,
        }
    }
    
    const mapDispatchToProps = dispatch => {
        return {
            //match deductWallet() to a prop called deductWallet
            deductWallet: (_deductedAmount) => dispatch(deductWallet(_deductedAmount)),
            addWallet: (_addedAmount) => dispatch(addWallet(_addedAmount)),
            addTransac: (item) => dispatch(addTransac(item)),
        }
    }
    
    //connect states and despatches to props
    export default connect(
        mapStateToProps, 
        mapDispatchToProps
        )(Popup)

