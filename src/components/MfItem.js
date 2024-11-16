import React, { useEffect, useState } from 'react';

const MfItem = ({mf, sellMf}) => {
  const [todayPrice, setTodayPrice] = useState(null);

  const getPrice = async () => {
    // VW453IKM1V01L7RE
    // FNJ80BLVZPE52HW3
    const API_KEY = process.env.REACT_APP_AV;
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${mf.symbol}.BSE&outputsize=full&apikey=${API_KEY}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        const timeSeries = data["Time Series (Daily)"];
        const latestDate = Object.keys(timeSeries)[0];
        const today_price = parseFloat(timeSeries[latestDate]["4. close"]);
        setTodayPrice(today_price);
    } catch (error) {
        console.error("Error fetching stock price:", error);
    }
};

    useEffect(() => {
        getPrice();
        // eslint-disable-next-line
    }, []);

    const invested = mf.nav * mf.units;
    const current = todayPrice ? todayPrice * mf.units : 0;
    const returns_change = invested ? ((current - invested) / invested) * 100 : 0;

  return (
    <>
    <div className="card w-100 mb-3" style={{ padding: '15px' }}>
        <div className="d-flex justify-content-between align-items-center">
            <div className="col">{mf.symbol}</div>
            <div className="col">{mf.nav}</div>
            <div className="col">{invested.toFixed(2)}</div>
            <div className="col" style={{ color: current >= mf.invested ? 'green' : 'red', fontWeight: 'bold' }}>{current}</div>
            <div className="col" style={{ color: returns_change > 0 ? 'green' : 'red', fontWeight: 'bold' }}>{returns_change.toFixed(2)}%</div>
            <button type="button" className="btn btn-danger" onClick={() => sellMf(mf)} >Redeem</button>
        </div>
    </div>
    </>
  )
}

export default MfItem