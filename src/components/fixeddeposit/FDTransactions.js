import React, { useContext, useEffect} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FDContext } from '../../context/FDContext';

const FDTransactions = () => {
    const { portfolioId } = useParams();
    const { fdtransactions, fetchFDTransactions } = useContext(FDContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('token')) {
            fetchFDTransactions(portfolioId);
        } else {
            navigate("/login");
        }
        // eslint-disable-next-line
    }, [portfolioId]);
  return (
    <div className='container'>
        <h3 className='my-3'>Transactions</h3>
        {fdtransactions.length === 0 ? (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100px' }}>
                <h3 className="text-muted">No Transactions Made</h3>
            </div>
        ) : (
            <>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="col">Name</div>
                <div className="col">Bank</div>
                <div className="col">Amount</div>
                <div className="col">Interest</div>
                <div className="col">Duration</div>
                <div className="col">date</div>
                <div className="col">type</div>
            </div>
            {fdtransactions.map((item) => (
            <div className="card w-100 mb-3" style={{ padding: '15px' }} key={item._id}>
            <div className="d-flex justify-content-between align-items-center">
                <div className="col">{item.name}</div>
                <div className="col">{item.bank}</div>
                <div className="col">{item.amount}</div>
                <div className="col">{item.interest}% p.a</div>
                <div className="col">{item.duration} years</div>
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

export default FDTransactions