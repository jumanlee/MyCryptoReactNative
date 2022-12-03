//This file contains all helper functions or algorithms that are used by different components 

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

export const todayDateGenerate = () => {

        let day = new Date().getDate().toString();
        let month = (new Date().getMonth() + 1).toString();
        let year = new Date().getFullYear().toString();

        //this is so that it matches the lastRefreshed date format from the API
        if(day.length < 2){
            day = "0"+day;
        }

        //this is so that it matches the lastRefreshed date format from the API
        if(month.length < 2){
            month = "0"+month;
        }

        let date = year+"-"+month+"-"+day;

        return date;
}


//merge sort algorithm
//merge function merges two sorted arrays to produce a third sorted array
const merge = (array1, array2) => 
{
    var m = array1.length;
    var n = array2.length;
    var s = []; 

    var i = 0;
    var j = 0;
    var k = 0; 

    while((i < m) && (j<n))
    {
        if(array1[i][5] > array2[j][5])
        {
            s[k] = array1[i];
            i = i + 1;
        }
        else
        {
            s[k] = array2[j];
            j = j + 1;
        }

        k = k + 1;
    }

    while(i < m)
    {
        s[k] = array1[i];
        i = i + 1;
        k = k + 1;
    }

    while(j < n)
    {
        s[k] = array2[j];
        j = j +1;
        k = k + 1;
    }

    return s;
}

//recursively does merge sort
export const mergeSort = (array) => {

    var n = array.length;

    //base cases are when array only has one element or empty.
    if(n == 1 || n == 0)
    {
        return array; 
    }

    var m = Math.floor((n+1)/2);
    var L = [];
    var R = [];

    for(var i = 0; i < m; i++)
    {
        L.push(array[i]); 
    }
    for(var i = m; i < n; i++)
    {
        R.push(array[i]); 
    }

    return merge(mergeSort(L), mergeSort(R));
}