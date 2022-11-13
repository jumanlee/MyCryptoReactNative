
//algorithm to calculate whether the crypto is recommended to be sold or bought. 
export const recommendAlgo = (_json, _dates) => {

    //calculate the 10-day Moving Average 
    let shortAveragesSum = 0;
    for(let i = 0; i < 9; i++){
        shortAveragesSum += parseFloat(_json['Time Series (Digital Currency Daily)'][_dates[i]]['4b. close (USD)']);
    }

    let shortMovingAverage = shortAveragesSum/10;

    //calculate the 50-day moving average
    let longAveragesSum = 0;

    for(let i = 0; i < 49; i++){
        longAveragesSum += parseFloat(_json['Time Series (Digital Currency Daily)'][_dates[i]]['4b. close (USD)']);
    }

    let longMovingAverage = longAveragesSum/50;

    //calculate recommendation. If 10-day moving average of price is greater than 50-day moving average of price, then the recommendation should be BUY, otherwise, recommendation should be SELL. This is based on the Simple Moving Average trading methodology.
    let recommend;

    if(shortMovingAverage > longMovingAverage){
        recommend = "BUY";
    }else{
        recommend = "SELL";
    }

    return recommend;
}

//calculate the daily price movement percentage
export const calculateMovement = (_json, _dates) => {

    let movement = parseFloat((_json['Time Series (Digital Currency Daily)'][_dates[0]]['2b. high (USD)'] - _json['Time Series (Digital Currency Daily)'][_dates[1]]['2b. high (USD)'])/_json['Time Series (Digital Currency Daily)'][_dates[1]]['2b. high (USD)'])*100;

    //round up to two decimal places
    movement = movement.toFixed(2);

    return movement;

}