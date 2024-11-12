import React, { useContext, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { StockContext } from '../../context/StockContext';

const SipList = () => {
  const { portfolioId } = useParams();
  const {fetchSips, sips, fetchStocks, fetchStocktransactions, deleteSip } = useContext(StockContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('token')) {
        fetchStocks(portfolioId);
        fetchStocktransactions(portfolioId);
        fetchSips(portfolioId);
    } else {
        navigate("/login");
    }
    // eslint-disable-next-line
}, [portfolioId]);

  return (
    <div className='container'>
    <h3 className='my-3'>Active SIPs</h3>
    {sips.length === 0 ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100px' }}>
            <h3 className="text-muted">No Active SIPS</h3>
        </div>
            ) : (
                <>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="col">Symbol</div>
                        <div className="col">Qty</div>
                        <div className="col">Date</div>
                    </div>
                    {sips.map((item) => (
                        <div key={item._id}>
                          <div className="card w-100 mb-3" style={{ padding: '15px' }}>
                              <div className="d-flex justify-content-between align-items-center">
                                  <div className="col">{item.symbol}</div>
                                  <div className="col">{item.quantity}</div>
                                  <div className="col">{new Date(item.startDate).getDate()}th of Every month</div>
                                  <button type="button" className="btn btn-danger" onClick={()=> deleteSip(item._id)} >Break</button>
                              </div>
                          </div>
                        </div>
                    ))}
                </>
            )}
    </div>
  )
}

export default SipList