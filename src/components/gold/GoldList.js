import React, { useContext, useEffect } from 'react'
import { GoldContext } from '../../context/GoldContext'
import { useParams, useNavigate } from 'react-router-dom';
import AddGold from './AddGold'

const GoldList = () => {

  const { portfolioId } = useParams();
  let navigate = useNavigate();
  const { golds, fetchGold } = useContext(GoldContext);

  useEffect(() => {
    if(localStorage.getItem('token')){
        fetchGold(portfolioId);
    }
    else{
        navigate("/login");
    }
    // eslint-disable-next-line
}, [portfolioId])

  return (
    <div className="container mt-3">
    <div className='container'>
    <h3 className='my-3'>Portfolio List</h3>
    {golds.length === 0 ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100px' }}>
            <h3 className="text-muted">No Gold Transactions</h3>
        </div>
    ) : (
        <>
        <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="col">Purity</div>
                <div className="col">Invested</div>
                <div className="col">Date</div>
        </div>
        {golds.map((item)=>{
            return <div key={item._id} item={item} >
                <div className="card w-100 mb-3" style={{ padding: '15px' }}>
                  <div className="d-flex justify-content-between align-items-center">
                      <div className="col">{item.type}</div>
                      <div className="col">{item.price}</div>
                      <div className="col">{new Date(item.date).toLocaleDateString('en-GB')}</div>
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