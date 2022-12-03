//actions is an object
import {WALLET_DEDUCTED, WALLET_ADDED, TRANSAC_ADDED, TRANSAC_CLEARED, ASSET_ADDED, ASSET_SOLD, ASSET_PRICE_UPDATED} from './actionTypes';

export const initialState = {
    funds: 0,
    transactions: [],
    assetList: {},
}

export const walletReducer = (state = initialState, action) => {
    switch(action.type){
        case WALLET_DEDUCTED: return {
            ...state,
            funds: parseFloat(state.funds) - parseFloat(action.value)

        }

        case WALLET_ADDED: return {
            ...state,
            funds: parseFloat(state.funds) + parseFloat(action.value)
        }

        default: return state
    }
}

export const transacReducer = (state = initialState, action) => {

    switch(action.type){
        case TRANSAC_ADDED: 

            const getDateTime = () => {

                //construct date
                let day = new Date().getDate().toString();
                let month = new Date().getMonth() + 1;
                month = month.toString();
                let year = new Date().getFullYear().toString();
        
                let date = day+"/"+month+"/"+year;
        
                //construct time
                let hours = new Date().getHours().toString();
                let min = new Date().getMinutes().toString();
                // let sec = new Date().getSeconds().toString();
        
                let time;
        
                if(min < 10){
                    time = hours+":"+"0"+min;
                }else{
                    time = hours+":"+min;
                }
        
                let dateTime = `Date: ${date} Time: ${time}`;
        
                return dateTime;
            }
            
            return {
                ...state,
                //using .concat rather than push because we want immutability, so concat returns a new copy of array
                transactions: state.transactions.concat({dateTime: getDateTime(), item: action.item})
            }

        case TRANSAC_CLEARED: return {
            ...state,
            transactions: [],
        }

        default: return state
    }
}

//reducer for portfolio
export const portfolioReducer = (state = initialState, action) => {

    //do a deep copy of assetList to ensure immutability
    let newAssetList = JSON.parse(JSON.stringify(state.assetList));

    switch(action.type){
        case ASSET_ADDED: 

            //if the newAssetList has the coin name, then add/update the quantity and price
            if(newAssetList.hasOwnProperty(String(action.name))){
                newAssetList[String(action.name)].marketPrice = parseFloat(action.marketPrice);
                //add to the existing quantity
                newAssetList[String(action.name)].quantity = Number(newAssetList[String(action.name)].quantity) + Number(action.quantity);

                newAssetList[String(action.name)].invested = parseFloat(newAssetList[String(action.name)].invested) + parseFloat(action.invested);

                //ignore sale property in this case as it's irrelevant. 

            }else
            {
                newAssetList[String(action.name)] = {
                    marketPrice: parseFloat(action.marketPrice),
                    quantity: Number(action.quantity),
                    invested: parseFloat(action.invested),
                    sale: parseFloat(0),
                }
            }

            return {
                ...state,
                assetList: newAssetList,
            }

        case ASSET_SOLD:

            //if the newAssetList has the coin name and has enough quantity in the portfolio to sell, then update the portfolio
            if((newAssetList.hasOwnProperty(String(action.name)) && (newAssetList[String(action.name)].quantity >= action.quantity))){

                newAssetList[String(action.name)].marketPrice = parseFloat(action.marketPrice);
                
                newAssetList[String(action.name)].quantity = Number(newAssetList[String(action.name)].quantity) - Number(action.quantity);

                //add the sale proceeds (cash) into the sale property of the object
                newAssetList[String(action.name)].sale = parseFloat(newAssetList[String(action.name)].sale) + parseFloat(action.sale);

                return {
                    ...state,
                    assetList: newAssetList,
                }
            }

            //if the conditions above are not satisfied, then just return the previous state
            return {
                ...state,
                assetList: state.assetList,
            }

        case ASSET_PRICE_UPDATED:

            for(let i = 0; i < action.mainList.length; i++){

                if(newAssetList.hasOwnProperty(String(action.mainList[i]["Fullname"]))){
                    //update the market price for that crypto
                    newAssetList[String(action.mainList[i]["Fullname"])]["marketPrice"] = action.mainList[i]["Today"];
                }
            }
        
            return {
                ...state,
                assetList: newAssetList,
            }

        default: return state
    }
}




