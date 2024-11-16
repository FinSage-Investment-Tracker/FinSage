import React, { useContext, useState } from 'react'
import { GoldContext } from '../../context/GoldContext'
import { useParams } from 'react-router-dom';

const AddGold = () => {
    const { portfolioId } = useParams()
    const { addGold } = useContext(GoldContext);

    const [gold, setGold] = useState({type:"24k", price:"", date:""});
    const [showForm, setShowForm] = useState(false);

    const handleClick = async (e) =>{
      e.preventDefault();
      await addGold(portfolioId, gold.type, gold.price, gold.date);
      setGold({type:"", price:"", date:""});
    }
    const onChange =(e) =>{
      setGold({...gold, [e.target.name]:e.target.value})
    }

    const toggleForm = () => {
      setShowForm(!showForm); // Toggle form visibility
    };
  return (
    <>
    <button onClick={toggleForm} className="btn btn-outline-primary mb-3">Add Gold Investment</button>
    <div className="col-md-6 mx-auto mb-5 mt-3">
    {showForm && (
        <form onSubmit={handleClick} className="mb-4">
        <div className="mb-3">
            <label htmlFor="price" className="form-label">Purchase Price</label>
            <input
                type="number"
                className="form-control"
                id="price"
                name="price"
                placeholder="Enter purchase price"
                onChange={onChange}
                required
            />
        </div>

        <div className="mb-3">
            <label htmlFor="type" className="form-label">Purity</label>
            <select
                className="form-select"
                id="type"
                name="type"
                onChange={onChange}
                required
            >
                <option value="24k">24K</option>
                <option value="22k">22K</option>
            </select>
        </div>

        <div className="mb-3">
            <label htmlFor="date" className="form-label">Purchase date</label>
            <input
                type="date"
                className="form-control"
                id="date"
                name="date"
                placeholder="Purchase date"
                onChange={onChange}
                required
            />
        </div>

        <button type="submit" className="btn btn-primary">Add</button>
    </form>
    )}
    </div>
    </>
  )
}

export default AddGold