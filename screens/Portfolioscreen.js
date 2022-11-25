import React from 'react';
import { useState, useEffect, useRef, useMemo } from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView, ScrollView, TextInput, TouchableOpacity, Linking, Alert, Modal, TouchableWithoutFeedback, Keyboard } from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import { Cell, Section, TableView } from 'react-native-tableview-simple';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { addWallet, deductWallet, reset, addTransac, transactions, assetList } from '../redux/actions';
import { connect } from 'react-redux'
import styles from '../style/styles';


const Portfolioscreen = ({funds, reset, transactions, assetList}) => {

//     //merges two sorted arrays to produce a third sorted array
// function merge(array1, array2) 
// {
//     var m = array1.length;
//     var n = array2.length;
//     var s = []; 

//     var i = 0;
//     var j = 0;
//     var k = 0; 

//     while((i < m) && (j<n))
//     {
//         if(array1[i][1] > array2[j][1])
//         {
//             s[k] = array1[i];
//             i = i + 1;
//         }
//         else
//         {
//             s[k] = array2[j];
//             j = j + 1;
//         }

//         k = k + 1;
//     }

//     while(i < m)
//     {
//         s[k] = array1[i];
//         i = i + 1;
//         k = k + 1;
//     }

//     while(j < n)
//     {
//         s[k] = array2[j];
//         j = j +1;
//         k = k + 1;
//     }

//     return s;
// }

// //recursively does merge sort
// function mergeSort(array) 
// {

//     var n = array.length;
//     if(n == 1)
//     {
//         return array; 
//     }

//     var m = Math.floor((n+1)/2);
//     var L = [];
//     var R = [];

//     for(var i = 0; i < m; i++)
//     {
//         L.push(array[i]); 
//     }
//     for(var i = m; i < n; i++)
//     {
//         R.push(array[i]); 
//     }

//     return merge(mergeSort(L), mergeSort(R));
// }


    let arrayAssetList = [];
    let totalMarketValue = 0;
    let marketValue = 0;

    //parse the object content into an array for processing
    arrayAssetList = Object.keys(assetList).map((key) => 
        {
            //only retrieve the crypto into arrayAssetList if the user owns more than 0 in quantity. 
            if(assetList[key]["quantity"] > 0){

                marketValue = assetList[key]["marketPrice"]*assetList[key]["quantity"];

                //add up the total market value in all currencies that the users own.
                totalMarketValue += (assetList[key]["quantity"]*assetList[key]["marketPrice"]);

                //return the object content onto arrayAssetList
                return([key, assetList[key]["marketPrice"], assetList[key]["quantity"], assetList[key]["invested"], assetList[key]["sale"], marketValue])
            }
        }); 

 return(
     <SafeAreaView style={styles.container}>
         <ScrollView style={{height:"100%"}}>
            <View>
                <View style = {styles.titleContainer}>
                    <View>
                        <Text style={styles.titleText}>Portfolio</Text>
                    </View>
                    <TouchableOpacity style={styles.popupButton} onPress={() => reset()}>
                        <Text style={styles.popupButtonText}>Reset</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.cell}>
                        <View>
                            {
                                // if portfolio is not empty, then return the content in arrayAssetList, which stores assets in the user's portfolio.
                                arrayAssetList.length > 0 ?
                                <View>{
                                    arrayAssetList.map((item, index) => {
        
                                        return(
                                            <View key={index} style={styles.transacContainer}>
                                                <Text style={styles.boldText}>{item[0]}</Text>
                                                <Text style={styles.cellText}>Market Price: USD {item[1].toLocaleString("en-US")}</Text>
                                                <Text style={styles.cellText}>Quantity owned: {item[2]}</Text>
                                                <Text style={styles.cellText}>Market value: USD {item[5].toLocaleString("en-US")}</Text>

                                                <Text style={styles.cellText}>Weight: {`${((item[5]/totalMarketValue)*100).toLocaleString("en-US")}%`}</Text>

                                                <Text style={styles.cellText}>Sale proceeds: USD {item[4].toLocaleString("en-US")}</Text>

                                                <Text style={styles.cellText}>Total invested amount: USD {item[3].toLocaleString("en-US")}</Text>

                                                
                                                <Text style={styles.cellText}>Gain/Loss: USD {((item[5] + item[4]) - item[3]).toLocaleString("en-US")}</Text> 
                                            
                                            </View>
                                        )
                                    }
                                )}</View> :
                            <View>
                                <Text style={styles.boldText}>Your portfolio is empty!</Text>
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
    //  funds: state.wallet.funds,
    //  transactions: state.transac.transactions,
        assetList: state.portfolio.assetList
 }
}

const mapDispatchToProps = dispatch => {
 return {
     //match deductWallet() to a prop called deductWallet
     deductWallet: (_deductedAmount) => dispatch(deductWallet(_deductedAmount)),
     addWallet: (_addedAmount) => dispatch(addWallet(_addedAmount)),
     addTransac: (dateTime, item) => dispatch(addTransac(dateTime, item)),
     reset: () => dispatch(reset()),
 }
}

//connect states and despatches to props
export default connect(
 mapStateToProps, 
 mapDispatchToProps,
 )(Portfolioscreen)