import React from 'react';
import { useState } from 'react';
import { Text, View, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { addWallet, deductWallet, addTransac, clearTransac, transactions } from '../redux/actions';
import { connect } from 'react-redux'
import styles from '../style/styles';
import Popup from './components/walletscreen-components/Popup';

const Walletscreen = ({funds, transactions, clearTransac}) => {

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
                <View style = {styles.titleContainer}>
                    <Text style={styles.titleText}>Wallet</Text>
                </View>

                <View style={styles.cell}>
                    <Text style={{fontSize: 16, color: '#800080', fontWeight: 'bold'}}>Available funds: </Text>
                    <View style={{marginTop: '2%'}}>
                        <Text style={{fontSize: 22, fontWeight: 'bold', color: '#696969'}}>USD {funds.toLocaleString("en-US")}</Text>
                    </View>

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
                        });
                        
                        }}>
                                <Text style={styles.popupButtonText}>Withdraw funds</Text>
                            </TouchableOpacity>
                        </View>
                </View>

                <View style = {styles.titleContainer}>
                    <View>
                        <Text style={styles.titleText}>Transactions</Text>
                    </View>
                    <TouchableOpacity style={styles.popupButton} onPress={() => clearTransac()}>
                        <Text style={styles.popupButtonText}>Clear</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.cell}>
                    <View>
                        {
                            // if transactions doesn't hold an empty array, then return the following:
                            transactions.length > 0 ?
                            <View>{
                                [...transactions].map((object, index) => {
                                    return(
                                        <View key={index} style={styles.transacContainer}>
                                            <Text style={styles.boldText}>{object.dateTime}</Text>
                                            <Text>{object.item}</Text>
                                        </View>
                                    )
                                }
                                )}</View> :
                            <View>
                                <Text style={styles.boldText}>No transactions to show</Text>
                            </View>
                        }
                    </View>  
                </View>
            </View>
            </ScrollView>
        </SafeAreaView> 
    )
}

const mapStateToProps = state => {

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
        addTransac: (dateTime, item) => dispatch(addTransac(dateTime, item)),
        clearTransac: () => dispatch(clearTransac()),
    }
}

//connect states and despatches to props
export default connect(
    mapStateToProps, 
    mapDispatchToProps,
    )(Walletscreen)



