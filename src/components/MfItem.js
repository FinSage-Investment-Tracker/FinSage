import React, { useEffect, useState } from 'react';

const MfItem = ({mf, sellMf}) => {
  const [todayPrice, setTodayPrice] = useState(null);

    const getPrice = async () => {
        // const API_KEY = "";
        // const url = `https://eodhd.com/api/real-time/${stock.symbol}.NSE?api_token=${API_KEY}&fmt=json`;
        // const response = await fetch(url);
        // const data = await response.json();
        // const today_price = data.close;
        const today_price = 1000;
        setTodayPrice(today_price);
    };

    useEffect(() => {
        getPrice();
        // eslint-disable-next-line
    }, []);

    const current = todayPrice ? todayPrice * (mf.invested/mf.nav) : 0;
    const returns_change = mf.invested ? ((current - mf.invested) / mf.invested) * 100 : 0;

  return (
    <>
    <div className="card w-100 mb-3" style={{ padding: '15px' }}>
        <div className="d-flex justify-content-between align-items-center">
            <div className="col">{mf.symbol}</div>
            <div className="col">{mf.nav}</div>
            <div className="col">{mf.invested}</div>
            <div className="col" style={{ color: current >= mf.invested ? 'green' : 'red', fontWeight: 'bold' }}>{current}</div>
            <div className="col" style={{ color: returns_change > 0 ? 'green' : 'red', fontWeight: 'bold' }}>{returns_change.toFixed(2)}%</div>
            <button type="button" className="btn btn-danger" onClick={() => sellMf(mf)} >Redeem</button>
        </div>
    </div>
    </>
  )
}

export default MfItem