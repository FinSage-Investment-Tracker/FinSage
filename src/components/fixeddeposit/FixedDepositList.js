import React, { useContext, useState, useEffect, useRef } from 'react'
import AddFD from './AddFD'
import { useNavigate, useParams } from 'react-router-dom'
import { FDContext } from '../../context/FDContext';
import FDItem from './FDItem';
import FDTransactions from './FDTransactions';

const FixedDepositList = () => {
  const { portfolioId } = useParams();
  const { fixedDeposit, fetchFD, fetchFDTransactions, addFD } = useContext(FDContext);
  const navigate = useNavigate();
  const [fd, setFd] = useState({id:"", name:"", bank:"", interest:"", amount:0, duration:"", date:"", type:"sell"});
  const ref = useRef(null);
  const refClose = useRef(null);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      fetchFD(portfolioId);
      fetchFDTransactions(portfolioId);
    } else {
        navigate("/login");
    }
    // eslint-disable-next-line
  }, [portfolioId]);

  const onChange =(e) =>{
    setFd({...fd, [e.target.name]:e.target.value})
  }

  //section for selling
  // TODO : logic of checking sell price on date same as in AddStock
  const handleClick = async (e) =>{
    e.preventDefault();
    await addFD(portfolioId, fd.name, fd.bank, fd.interest, fd.amount, fd.duration, fd.date, fd.type);
    refClose.current.click();
    fetchFD(portfolioId);
    fetchFDTransactions(portfolioId);
  }

  const sellFD = (currentfd) =>{
    ref.current.click();
    setFd({id: currentfd._id, name:currentfd.name, bank: currentfd.bank, interest: currentfd.interest, amount: currentfd.amount, duration: currentfd.duration, date: currentfd.date, type: "sell"});
  }

return (
  <div className="container mt-3">

    <button ref={ref} type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#editStockModal">
        Launch demo modal
    </button>

    <div className="modal fade" id="editStockModal" tabIndex="-1" aria-labelledby="sellFDModalLabel" aria-hidden="true">
        <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                    <h1 className="modal-title fs-5" id="editStockModalLabel">Sell {fd.name}</h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                    <form onSubmit={handleClick} >
                        <div className="mb-3">
                            <label htmlFor="amount" className="form-label">Withdraw Amount</label>
                            <input
                                type="number"
                                className="form-control"
                                id="amount"
                                name="amount"
                                placeholder="Enter amount"
                                onChange={onChange}
                                value={fd.amount}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="date" className="form-label">Selling Date</label>  
                                <input
                                    type="date"
                                    className="form-control"
                                    id="date"
                                    placeholder="withdraw date"
                                    name="date"
                                    onChange={onChange}
                                    value={fd.date}
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
    <div className='container'>
      <h3 className='my-3'>Fixed Deposits</h3>
      {fixedDeposit.length === 0 ? (
          <div className="d-flex justify-content-center align-items-center" style={{ height: '100px' }}>
              <h3 className="text-muted">No Current Fixed Deposits</h3>
          </div>
              ) : (
                  <>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                          <div className="col">Name</div>
                          <div className="col">Bank</div>
                          <div className="col">amount</div>
                          <div className="col">Interest</div>
                      </div>
                      {fixedDeposit.map((item) => (
                          <FDItem key={item._id} fd={item} sellFD={sellFD} />
                      ))}
                  </>
              )}
      </div>

      <AddFD/>

      <FDTransactions/>
  </div>
)}

export default FixedDepositList