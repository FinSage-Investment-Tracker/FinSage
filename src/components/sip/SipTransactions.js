import React, { useContext, useEffect} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StockContext } from '../../context/StockContext';

const SipTransactions = () => {

    const { portfolioId } = useParams();
    const {siptransactions, fetchSiptransactions } = useContext(StockContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('token')) {
            fetchSiptransactions(portfolioId);
        } else {
            navigate("/login");
        }
        // eslint-disable-next-line
    }, [portfolioId]);


  return (
    <div className='container'>
        <h3 className='my-3'>SIP Transactions</h3>
        {siptransactions.length === 0 ? (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100px' }}>
                <h3 className="text-muted">No SIP Transactions Made</h3>
            </div>
        ) : (
            <>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="col">Symbol</div>
                <div className="col">Qty</div>
                <div className="col">Price</div>
                <div className="col">Date</div>
            </div>
            {siptransactions.map((item) => (
            <div className="card w-100 mb-3" style={{ padding: '15px' }} key={item._id}>
            <div className="d-flex justify-content-between align-items-center">
                <div className="col">{item.symbol}</div>
                <div className="col">{item.quantity}</div>
                <div className="col">{item.price}</div>
                <div className="col">{new Date(item.date).toLocaleDateString('en-GB')}</div>
            </div>
            </div>
            ))}
            </>
        )}


    </div>
  );
};

export default SipTransactions