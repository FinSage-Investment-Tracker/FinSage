import React, { useContext, useState, useEffect, useRef } from 'react'
import { PortfolioContext } from '../context/PortfolioContext';
import PortfolioItem from './PortfolioItem';
import AddPortfolio from './AddPortfolio';
import { useNavigate} from 'react-router-dom'

const PortfolioList = () => {

    let navigate = useNavigate();
    const context = useContext(PortfolioContext);
    const { portfolios, fetchallPortfolios, editPortfolio } = context;
    const [portfolio, setPortfolio] = useState({id: "", ename:"", erelationship:"", epan:""})
    const ref = useRef(null);
    const refClose = useRef(null);

    useEffect(() => {
        if(localStorage.getItem('token')){
            fetchallPortfolios();
        }
        else{
            navigate("/login");
        }
        // eslint-disable-next-line
    }, [])

    const onChange =(e) =>{
        setPortfolio({...portfolio, [e.target.name]:e.target.value})
    }

    const handleClick =(e) =>{
        e.preventDefault();
        editPortfolio(portfolio.id, portfolio.ename, portfolio.erelationship, portfolio.epan)
        refClose.current.click()
    }

    const updatePortfolio = (currentPortfolio) =>{
        ref.current.click();
        setPortfolio({id:currentPortfolio._id, ename: currentPortfolio.name, erelationship: currentPortfolio.relationship, epan: currentPortfolio.pan})
    }


  return (
    <>
    
    <button ref={ref} type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
    Launch demo modal
    </button>

    <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div className="modal-dialog">
        <div className="modal-content">
        <div className="modal-header">
            <h1 className="modal-title fs-5" id="exampleModalLabel">Edit Portfolio</h1>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div className="modal-body">
        <form>
            <div className="mb-3">
                <label htmlFor="name" className="form-label">Portfolio Name</label>
                <input
                    type="text"
                    className="form-control"
                    id="ename"
                    name="ename"
                    placeholder="Enter portfolio name"
                    onChange={onChange}
                    value={portfolio.ename}
                    required
                />
            </div>

            <div className="mb-3">
                <label htmlFor="relationship" className="form-label">Relationship</label>
                <select
                    className="form-select"
                    id="erelationship"
                    name="erelationship"
                    onChange={onChange}
                    value={portfolio.erelationship}
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
                    id="epan"
                    name="epan"
                    placeholder="Enter PAN number"
                    onChange={onChange}
                    value={portfolio.epan}
                    required
                />
            </div>
        </form>
        </div>
        <div className="modal-footer">
            <button ref={refClose} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" className="btn btn-primary" onClick={handleClick} >Update</button>
        </div>
        </div>
    </div>
    </div>
    <div className='container'>
    <h3 className='my-3'>Portfolio List</h3>
    {portfolios.length === 0 ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100px' }}>
            <h3 className="text-muted">No Portfolios Added</h3>
        </div>
    ) : (
        <>
        <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="col">Name</div>
                    <div className="col">Relationship</div>
                    <div className="col">Stocks</div>
                    <div className="col">MF</div>
                    <div className="col text-end">Actions</div>
            </div>
        {portfolios.map((item)=>{
            return <PortfolioItem key={item._id} item={item} updatePortfolio={updatePortfolio} />
        })}
        </>
    )}

    </div>
    <AddPortfolio/>
    </>
  )
}

export default PortfolioList