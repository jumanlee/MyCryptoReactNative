//actions is an object
import {WALLET_DEDUCTED, WALLET_ADDED, TRANSAC_ADDED} from './actionTypes';

export const initialState = {
    funds: 0,
    transactions: [],
}

export const walletReducer = (state = initialState, action) => {
    switch(action.type){
        case WALLET_DEDUCTED: return {
            ...state,
            funds: parseFloat(state.funds) - parseFloat(action.value)

        }
        break;

        case WALLET_ADDED: console.log(state);return {
            ...state,
            
            funds: parseFloat(state.funds) + parseFloat(action.value)
        }
        break;

        default: return state
    }
}


export const transacReducer = (state = initialState, action) => {
    switch(action.type){
        case TRANSAC_ADDED: return {
            ...state,
            transactions: state.transactions.concat({date: action.date, item: action.item})
        }
        break;

        default: return state
    }
}




