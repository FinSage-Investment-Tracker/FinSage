import React, { useContext, useState } from 'react'
import { PortfolioContext } from '../context/PortfolioContext';

const AddPortfolio = () => {

    const context = useContext(PortfolioContext);
    const { addPortfolio } = context;

    const [portfolio, setPortfolio] = useState({name:"", relationship:"self", pan:""})
    const [showForm, setShowForm] = useState(false); // State to toggle form visibility

    const handleClick = async (e) =>{
        e.preventDefault();
        await addPortfolio(portfolio.name, portfolio.relationship, portfolio.pan);
        setPortfolio({name:"", relationship:"self", pan:""})
    }
    const onChange =(e) =>{
        setPortfolio({...portfolio, [e.target.name]:e.target.value})
    }

    const toggleForm = () => {
        setShowForm(!showForm); // Toggle form visibility
    };

  return (
    <>
    <button onClick={toggleForm} className="btn btn-outline-primary mb-3">Add Portfolio</button>
    <div className="col-md-6 mx-auto mb-5 mt-3">
    {showForm && (
        <form>
        <div className="mb-3">
            <label htmlFor="name" className="form-label">Portfolio Name</label>
            <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                placeholder="Enter portfolio name"
                onChange={onChange}
                required
            />
        </div>

        <div className="mb-3">
            <label htmlFor="relationship" className="form-label">Relationship</label>
            <select
                className="form-select"
                id="relationship"
                name="relationship"
                onChange={onChange}
                required
            >
                <option value="self">Self</option>
                <option value="father">Father</option>
                <option value="mother">Mother</option>
                <option value="spouse">Spouse</option>
                <option value="child">Child</option>
                <option value="other">Other</option>
            </select>
        </div>

        <div className="mb-3">
            <label htmlFor="pan" className="form-label">PAN</label>
            <input
                type="text"
                className="form-control"
                id="pan"
                name="pan"
                placeholder="Enter PAN number"
                onChange={onChange}
                required
            />
        </div>

        <button type="button" className="btn btn-primary" onClick={handleClick}>Create Portfolio</button>
    </form>
    )}
    </div>
    </>
  )
}

export default AddPortfolio