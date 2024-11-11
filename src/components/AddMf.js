import React, { useContext, useState} from 'react';
import { useParams } from 'react-router-dom';
import { MFContext } from '../context/MfContext';

const AddMf = () => {
    const { portfolioId } = useParams();
    const { addMutualFund, fetchMutualFunds, fetchMfTransactions } = useContext(MFContext);
    const [newMf, setNewMf] = useState({ id:"", symbol:"", nav:"", invested:"", type:"buy", date:"" });
    const [showForm, setShowForm] = useState(false); // State to toggle form visibility

    const handleAddMf = async (e) => {
        e.preventDefault();
        await addMutualFund(portfolioId, newMf.symbol, newMf.nav, newMf.invested, newMf.type, newMf.date);
        setNewMf({symbol:"", nav:"", invested:"", type:"buy", date:""});
        fetchMutualFunds(portfolioId);
        fetchMfTransactions(portfolioId);

        // const API_KEY = ""
        // const url = `https://eodhd.com/api/eod/${newStock.symbol}.nse?from=${newStock.date}&to=${newStock.date}&period=d&api_token=${API_KEY}&fmt=json`
        // const response = await fetch(url);
        // const data = await response.json();
        // const high = data[0].high
        // const low = data[0].low
        // if((newStock.price < high) && (newStock.price >low)){
        //     await addStock(portfolioId, newStock.symbol, newStock.price, newStock.quantity, newStock.type, newStock.date);
        //     setNewStock({ symbol: "", price: "", quantity: "", type: "buy", date:""});
        //     fetchStocks(portfolioId);
        //     fetchStocktransactions(portfolioId);
        // }
        // else{
        //     await alert(`price should be between ${low} and ${high}`)
        // }
    };

    const onChange = (e) => {
        setNewMf({ ...newMf, [e.target.name]: e.target.value });
    };

    const toggleForm = () => {
        setShowForm(!showForm); // Toggle form visibility
    };

  return (
        <>
        <button onClick={toggleForm} className="btn btn-outline-primary mb-3">Add Mutual Fund</button>
        <div className="col-md-6 mx-auto mb-5 mt-3">
        {showForm && (
            <form onSubmit={handleAddMf} className="mb-4">
            <div className="mb-3">
                <input
                    type="text"
                    name="symbol"
                    placeholder="Symbol"
                    value={newMf.symbol}
                    onChange={onChange}
                    className="form-control"
                    required
                />
            </div>
            <div className="mb-3">
                <input
                    type="number"
                    name="nav"
                    placeholder="nav"
                    value={newMf.nav}
                    onChange={onChange}
                    className="form-control"
                    required
                />
            </div>
            <div className="mb-3">
                <input
                    type="number"
                    name="invested"
                    placeholder="Invested"
                    value={newMf.invested}
                    onChange={onChange}
                    className="form-control"
                    required
                />
            </div>
            <div className="mb-3">
                    <input
                        type="date"
                        name="date"
                        value={newMf.date}
                        onChange={onChange}
                        className="form-control"
                        required/>
            </div>
            <button type="submit" className="btn btn-primary">Add Mutual Fund</button>
        </form>
        )}
        </div>
        </>
  )
}

export default AddMf