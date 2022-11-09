import {WALLET_DEDUCTED, WALLET_ADDED} from './actionTypes'

export const deductWallet = (_deductedAmount) => {

    // let totalValue = price*quantity;
    return {
        type: WALLET_DEDUCTED,
        value: _deductedAmount,
    }
}

export const addWallet = (_addedAmount) => {
    return {
        type: WALLET_ADDED,
        value: _addedAmount,
    }

}