import React from 'react';
import { useMemo } from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import styles from '../../../style/styles';
import {Ionicons} from '@expo/vector-icons';
import Swipeable from 'react-native-gesture-handler/Swipeable';

//bug associated with tethering (now resolved! But good to note): The first time when a crypto is added onto the list and the user buys it, then immediately proceeds to delete it, the item gets deleted, which is not supposed to be the case, cuz the system should be prohibiting it as the user still owns the said crypto. The reason this is happening is cuz useMemo was only used to track mainList. Bear in mind that removeData function is passed down from parent. When the user buys a newly added crypto, that alters mainList, which then updates the function in useMemo, but then it updates the redux state of assetList, as a result the parent's assetList gets updated, but when it gets to the child (renderList component), because useMemo only tracked changes from mainList, the update from assetList is ignored, as it's not changes in mainList, that's why the passed down removeData that contains "assetList", which is not updated. To solve for that, I asked for useMemo to track assetList too. 

//component to render the list of items
const renderList = (mainList, popupName, popupJson, popupDates, popupPrice, displays, setDisplays, removeData, assetList) => useMemo(() => {

    console.log("render within useMemo");
    //useMemo is used to prevent unnessary renders if the mainlist state remains the same. 
    return(
    //because mainList is an array, if you put [mainlist] it would mean [["Content"]], so you need to use ...mainlist to CLONE the content into [].
    [...mainList].map((object) => {

        // updateAssetPrice(object.Fullname, object.Today);

        return (
        //swipe to delete functionality
        <Swipeable renderLeftActions={() => {
            return(
                <TouchableOpacity style={styles.swipeContainer} onPress={()=>removeData(object.Currency.toString())}>
                <View >
                    <Text style={styles.swipeText}>Delete</Text>
                </View>
                </TouchableOpacity>)
        }} 
        friction={2} key={object.Currency.toString()}>

            <View style={styles.cell}>
            
                <TouchableOpacity onPress={()=> {popupName.current = object.Fullname; popupJson.current = object.Json; popupDates.current = object.Dates; popupPrice.current = object.Today
                    setDisplays({...displays, options: {
                        popup: true,
                        buy: false,
                        sell: false,
                        buttons: true,
                    },
                })}}>
                    <Text style={styles.boldText}>{`Currency: ${object.Fullname} (${object.Currency})`}</Text>
                    <Text>{`Latest price: USD ${parseFloat(object["Today"]).toLocaleString("en-US")}`}</Text>

                    {/* display price movement information. This is conditional. If price movement is positive, then a green up arrow is displayed, otherwise, a red down arrow is displayed.  */}
                    {object.Movement > 0 
                    ? 
                    <View style={styles.cellItem}><Text>Price Movement: </Text><Ionicons name='arrow-up-circle' size={20} color='rgba(0,255,0,0.5)' /><Text> {object.Movement}%</Text></View> 
                    : 
                    <View style={styles.cellItem}><Text>Price movement: </Text><Ionicons name='arrow-down-circle-sharp' size={20} color='rgba(255,0,0,0.5)' /><Text> {object.Movement}%</Text></View>}

                    {/* display recommendation based on the calculated moving average. If the recommendation is buy, then a green thumbs up will show, otherwise a red thumbs down will show.  */}
                    {object.Recommend == "BUY" 
                    ? 
                    <View style={styles.cellItem}><Text>Recomend: </Text><Ionicons name='thumbs-up' size={20} color='rgba(0,255,0,0.5)' /><Text> {object.Recommend}</Text></View>
                    :
                    <View style={styles.cellItem}><Text>Recomend: </Text><Ionicons name='md-thumbs-down' size={20} color='rgba(255,0,0,0.5)' /><Text> {object.Recommend}</Text></View>
                    }
                    
                </TouchableOpacity>
            </View>
        </Swipeable>
        )
    }))

}, [mainList, assetList])


export default renderList;
