import React, { useContext, useState} from 'react';
import { useParams } from 'react-router-dom';
import { FDContext } from '../../context/FDContext';

const AddFD = () => {
  const { portfolioId } = useParams();
  const { fetchFD, fetchFDTransactions, addFD } = useContext(FDContext);
  const [newFD, setNewFD] = useState({name:"", bank:"", interest:"", amount:"", duration:"", date:"", type:"buy"});
  const [showForm, setShowForm] = useState(false); // State to toggle form visibility

  const handleAddFD = async (e) =>{
    e.preventDefault();
    await addFD(portfolioId, newFD.name, newFD.bank, newFD.interest, newFD.amount, newFD.duration, newFD.date, newFD.type);
    setNewFD({name:"", bank:"", interest:"", amount:"", duration:"", date:"", type:"buy"});
    fetchFD(portfolioId);
    fetchFDTransactions(portfolioId);
  }

  const onChange = (e) => {
    setNewFD({ ...newFD, [e.target.name]: e.target.value });
  };

  const toggleForm = () => {
    setShowForm(!showForm); // Toggle form visibility
  };

  return (
    <>
    <button onClick={toggleForm} className="btn btn-outline-primary mb-3">Add Fixed Deposit</button>
    <div className="col-md-6 mx-auto mb-5 mt-3">
    {showForm && (
        <form onSubmit={handleAddFD} className="mb-4">
        <div className="mb-3">
            <input
                type="text"
                name="name"
                placeholder="Name"
                value={newFD.name}
                onChange={onChange}
                className="form-control"
                required
            />
        </div>
        <div className="mb-3">
            <input
                type="text"
                name="bank"
                placeholder="Bank"
                value={newFD.bank}
                onChange={onChange}
                className="form-control"
                required
            />
        </div>
        <div className="mb-3">
            <input
                type="number"
                name="amount"
                placeholder="Amount Invested"
                value={newFD.amount}
                onChange={onChange}
                className="form-control"
                required
            />
        </div>
        <div className="mb-3">
            <input
                type="number"
                name="interest"
                placeholder="Interest Rate p.a"
                value={newFD.interest}
                onChange={onChange}
                className="form-control"
                required
            />
        </div>
        <div className="mb-3">
            <input
                type="number"
                name="duration"
                placeholder="Duration in years"
                value={newFD.duration}
                onChange={onChange}
                className="form-control"
                required
            />
        </div>
        <div className="mb-3">
                <input
                    type="date"
                    name="date"
                    value={newFD.date}
                    onChange={onChange}
                    className="form-control"
                    required/>
        </div>
        <button type="submit" className="btn btn-primary">Add</button>
    </form>
    )}
    </div>
    </>
  )
}

export default AddFD