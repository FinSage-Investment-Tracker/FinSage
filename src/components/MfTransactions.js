import React, { useContext, useEffect} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MFContext } from '../context/MfContext';

const MfTransactions = () => {

    const { portfolioId } = useParams();
    const { mfTransactions, fetchMfTransactions } = useContext(MFContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('token')) {
            fetchMfTransactions(portfolioId);
        } else {
            navigate("/login");
        }
        // eslint-disable-next-line
    }, [portfolioId]);


  return (
    <div className='container'>
        <h3 className='my-3'>Mutual Funds Transactions</h3>
        {mfTransactions.length === 0 ? (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100px' }}>
                <h3 className="text-muted">No Transactions Made</h3>
            </div>
        ) : (
            <>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="col">Fund</div>
                <div className="col">nav</div>
                <div className="col">units</div>
                <div className="col">Date</div>
                <div className="col">Type</div>
            </div>
            {mfTransactions.map((item) => (
            <div className="card w-100 mb-3" style={{ padding: '15px' }} key={item._id}>
            <div className="d-flex justify-content-between align-items-center">
                <div className="col">{item.symbol}</div>
                <div className="col">{item.nav}</div>
                <div className="col">{item.units}</div>
                <div className="col">{new Date(item.date).toLocaleDateString('en-GB')}</div>
                <div className="col">{item.type}</div>
            </div>
            </div>
            ))}
            </>
        )}


    </div>
  )
}

export default MfTransactions