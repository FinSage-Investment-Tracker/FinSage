import React, { useContext, useEffect, useState } from 'react'
import { GoldContext } from '../../context/GoldContext'
import { useParams, useNavigate } from 'react-router-dom';
import AddGold from './AddGold'

const GoldList = () => {

  const { portfolioId } = useParams();
  let navigate = useNavigate();
  const { golds, fetchGold } = useContext(GoldContext);
  const [prices, setPrices] = useState({ gold: null, silver: null, platinum: null });

  useEffect(() => {
    fetchPrices();
    if(localStorage.getItem('token')){
        fetchGold(portfolioId);
    }
    else{
        navigate("/login");
    }
    // eslint-disable-next-line
}, [portfolioId])

const fetchPrices = async () => {
  // 6988162245ea0304c511677c8a0246a1
    const API_KEY = '6988162245ea0304c511677c8a0246a1';
    const url = `https://api.metalpriceapi.com/v1/latest?api_key=${API_KEY}&base=INR&currencies=XPT,XAU,XAG`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.success) {
        const troyOunceToGram = 31.1035;
        setPrices({
          gold: (data.rates.INRXAU / troyOunceToGram).toFixed(2),
          silver: (data.rates.INRXAG / troyOunceToGram).toFixed(2),
          platinum: (data.rates.INRXPT / troyOunceToGram).toFixed(2),
        });
      } else {
        console.error("Failed to fetch prices:", data);
      }
    } catch (error) {
      console.error("Error fetching metal prices:", error);
    }
  };

  return (
    <div className="container mt-3">
    <div className='container'>
    <h3 className='my-3'>Today's Prices</h3>
    <div className="d-flex justify-content-between align-items-center mb-3">
    <div className="card w-100 mb-3 mx-3" style={{ padding: '15px' }}>
    <div className="d-flex justify-content-between align-items-center">
        <h4 style={{ margin: 0 }}>Gold</h4>
        <h4 style={{ color: '#B22222', margin: 0, width: '50%', textAlign: 'right' }}>
        {prices.gold ? `${prices.gold} INR/g` : 'Loading...'}
        </h4>
    </div>
    </div>
    <div className="card w-100 mb-3 mx-3" style={{ padding: '15px' }}>
    <div className="d-flex justify-content-between align-items-center">
        <h4 style={{ margin: 0 }}>Silver</h4>
        <h4 style={{ color: '#3CB371', margin: 0, width: '50%', textAlign: 'right' }}>
        {prices.silver ? `${prices.silver} INR/g` : 'Loading...'}
        </h4>
    </div>
    </div>
    <div className="card w-100 mb-3 mx-3" style={{ padding: '15px' }}>
    <div className="d-flex justify-content-between align-items-center">
        <h4 style={{ margin: 0 }}>Platinum</h4>
        <h4 style={{ color: '#4682B4', margin: 0, width: '50%', textAlign: 'right' }}>
        {prices.platinum ? `${prices.platinum} INR/g` : 'Loading...'}
        </h4>
    </div>
    </div>
    </div>
    <h3 className='my-3'>Portfolio List</h3>
    {golds.length === 0 ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100px' }}>
            <h3 className="text-muted">No Gold Transactions</h3>
        </div>
    ) : (
        <>
        <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="col">Purity</div>
                <div className="col">price/g</div>
                <div className="col">Invested</div>
                <div className="col">Date</div>
                <div className="col">Returns</div>
        </div>
        {golds.map((item)=>{
            return <div key={item._id} item={item} >
            <div className="card w-100 mb-3" style={{ padding: '15px' }}>
            <div className="d-flex justify-content-between align-items-center">
              <div className="col">{item.type}</div>
              <div className="col">{item.price}</div>
              <div className="col">{item.price * item.quantity}</div>
              <div className="col">{new Date(item.date).toLocaleDateString('en-GB')}</div>
              <div 
                className="col" 
                style={{
                  color: (
                    item.type === 'gold' ? 
                      ((prices.gold - item.price) / item.price) * 100 :
                    item.type === 'silver' ? 
                      ((prices.silver - item.price) / item.price) * 100 :
                    item.type === 'platinum' ? 
                      ((prices.platinum - item.price) / item.price) * 100 : 
                    0
                  ) > 0 ? 'green' : 'red', 
                  fontWeight: 'bold'
                }}
              >
                {item.type === 'gold' ? 
                  (((prices.gold - item.price) / item.price) * 100).toFixed(2) : 
                  item.type === 'silver' ? 
                    (((prices.silver - item.price) / item.price) * 100).toFixed(2) : 
                  item.type === 'platinum' ? 
                    (((prices.platinum - item.price) / item.price) * 100).toFixed(2) : 
                  null
                }%
              </div>
            </div>
          </div>
            </div>
        })}
        </>
    )}

    </div>
    <AddGold/>
    </div>
  )
}

export default GoldList