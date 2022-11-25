import {WALLET_DEDUCTED, WALLET_ADDED, RESET, TRANSAC_ADDED, TRANSAC_CLEARED, ASSET_ADDED, ASSET_SOLD, ASSET_PRICE_UPDATED} from './actionTypes'

export const deductWallet = (_deductedAmount) => {

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

export const reset = () => {
    return {
        type: RESET,
    }
}

export const addTransac = (_item) => {
    return {
        type: TRANSAC_ADDED,
        item: _item,
    }
}

export const clearTransac = () => {
    return {
        type: TRANSAC_CLEARED,
    }
}

export const addAsset = (_name, _marketPrice, _quantity, _invested) => {
    return {
        type: ASSET_ADDED,
        name: _name,
        marketPrice: _marketPrice,
        quantity: _quantity,
        invested: _invested,
    }
}

export const sellAsset = (_name, _marketPrice, _quantity, _sale) => {
    return {
        type: ASSET_SOLD,
        name: _name,
        marketPrice: _marketPrice,
        quantity: _quantity,
        sale: _sale,
    }
}

export const updateAssetPrice = (_mainList) => {
    return {
        type: ASSET_PRICE_UPDATED,
        mainList: _mainList
    }
}