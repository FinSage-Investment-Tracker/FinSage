import React, { useContext, useEffect } from 'react'
import { StockContext } from '../../context/StockContext'
import { useParams, useNavigate } from 'react-router-dom'

const StockReturns = () => {
    const { portfolioId } = useParams();
    let navigate = useNavigate();
    const { booked, fetchReturns } = useContext(StockContext);

    useEffect(() => {
        if(localStorage.getItem('token')){
            fetchReturns(portfolioId);
        }
        else{
            navigate("/login");
        }
        // eslint-disable-next-line
    }, [portfolioId])
  return (
    <div className='container'>
    <h3 className='my-3'>Booked P&L</h3>
    {booked.length === 0 ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100px' }}>
            <h3 className="text-muted">No P&L Booked</h3>
        </div>
    ) : (
        <>
        <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="col">Symbol</div>
            <div className="col">Returns</div>
        </div>
        {booked.map((item)=>{
            return <div key={item._id} item={item} >
                <div className="card w-100 mb-3" style={{ padding: '15px' }}>
                  <div className="d-flex justify-content-between align-items-center">
                      <div className="col">{item.symbol}</div>
                      <div className="col" style={{ color: item.returns >= 0 ? 'green' : 'red', fontWeight: 'bold' }} >{item.returns.toFixed(2)}</div>
                  </div>
              </div>
            </div>
        })}
        </>
    )}

    </div>
  )
}

export default StockReturns