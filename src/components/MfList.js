import React, { useContext, useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { MFContext } from '../context/MfContext';
import MfItem from './MfItem';
import AddMf from './AddMf';
import MfTransactions from './MfTransactions';

const MfList = () => {
  const {portfolioId} = useParams();
  const { mutualFunds, addMutualFund, fetchMutualFunds, fetchMfTransactions } = useContext(MFContext);
  const navigate = useNavigate();
  const [mf, setMf] = useState({ id:"", symbol:"", nav:"", units:"", date:"", type:"sell" });
  const ref = useRef(null);
  const refClose = useRef(null);

  useEffect(() => {
    if(localStorage.getItem('token')){
      fetchMutualFunds(portfolioId);
      fetchMfTransactions(portfolioId);
    }else{
      navigate('/login');
    }

    // eslint-disable-next-line
  }, [portfolioId]);

  const onChange =(e) =>{
    setMf({...mf, [e.target.name]:e.target.value})
  }

  // section for selling
  // TODO : logic of checking sell price on date
  const handleClick = async (e) =>{
    e.preventDefault();
    await addMutualFund(portfolioId, mf.symbol, mf.nav, mf.units, mf.type, mf.date);
    refClose.current.click();
    fetchMutualFunds(portfolioId);
    fetchMfTransactions(portfolioId);
  }

  const sellMf = (currentitem) =>{
    ref.current.click();
    setMf({id:currentitem._id, symbol: currentitem.symbol, nav: "", units: "", type: "sell", date: ""})
  }

  return (
    <div className="container mt-3">

    <button ref={ref} type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#editStockModal">
        Launch demo modal
    </button>

    <div className="modal fade" id="editStockModal" tabIndex="-1" aria-labelledby="editStockModalLabel" aria-hidden="true">
        <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                    <h1 className="modal-title fs-5" id="editStockModalLabel">Redeem {mf.symbol}</h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                    <form onSubmit={handleClick} >
                        <div className="mb-3">
                            <label htmlFor="nav" className="form-label">Redeem nav</label>
                            <input
                                type="number"
                                className="form-control"
                                id="nav"
                                name="nav"
                                placeholder="Enter redeem nav"
                                onChange={onChange}
                                value={mf.price}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="units" className="form-label">Redeem Units</label>
                            <input
                                type="number"
                                className="form-control"
                                id="units"
                                name="units"
                                placeholder="redeem units"
                                onChange={onChange}
                                value={mf.units}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="date" className="form-label">Redeem Date</label>  
                                <input
                                    type="date"
                                    className="form-control"
                                    id="date"
                                    placeholder="redeem date"
                                    name="date"
                                    onChange={onChange}
                                    value={mf.date}
                                    required
                                    />
                        </div>

                        <div className="modal-footer">
                            <button ref={refClose} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="submit" className="btn btn-primary">Sell</button>
                        </div>
                    </form>
                </div>
                
            </div>
        </div>
    </div>


      <div className="container">
        <h3 className='my-3'>Holdings</h3>
        {mutualFunds.length === 0 ? (
          <div className="d-flex justify-content-center align-items-center" style={{ height: '100px' }}>
              <h3 className="text-muted">No Current Holdings</h3>
          </div>
        ) : (
          <>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="col">Fund</div>
                <div className="col">nav</div>
                <div className="col">Invested</div>
                <div className="col">Current</div>
                <div className="col">Returns</div>
            </div>
            {mutualFunds.map((mf) => (
              <MfItem key={mf._id} mf={mf} sellMf={sellMf} />
            ))}
          </>
        )}

        <AddMf/>

        <MfTransactions/>
      </div>
    </div>
  )
}

export default MfList