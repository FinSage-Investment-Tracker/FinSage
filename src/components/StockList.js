import React, { useContext, useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { StockContext } from '../context/StockContext';
import StockItem from './StockItem'; // Import StockItem component
import AddStock from './AddStock'; // Import AddStock component
import StockTransactions from './StockTransactions';
// eslint-disable-next-line
import StockChart from './StockChart';
import StockPieChart from './StockPieChart';
import SipList from './sip/SipList';
import AddSip from './sip/AddSip';

const StockList = () => {
    const { portfolioId } = useParams();
    const {stocks, addStock, fetchStocks, fetchStocktransactions } = useContext(StockContext);
    const navigate = useNavigate();
    const [stock, setStock] = useState({ id:"", symbol: "", price: "", quantity: "", type: "sell", date:""});
    const ref = useRef(null);
    const refClose = useRef(null);

    useEffect(() => {
        if (localStorage.getItem('token')) {
            fetchStocks(portfolioId);
            fetchStocktransactions(portfolioId);
        } else {
            navigate("/login");
        }
        // eslint-disable-next-line
    }, [portfolioId]);

    const onChange =(e) =>{
        setStock({...stock, [e.target.name]:e.target.value})
    }

    //section for selling price logic
    const handleClick = async (e) =>{
        e.preventDefault();
        const API_KEY = "66f3115d0f1214.40427570"; // Add your API key here
        const url = `https://eodhd.com/api/eod/${stock.symbol}.nse?from=${stock.date}&to=${stock.date}&period=d&api_token=${API_KEY}&fmt=json`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            const high = data[0].high;
            const low = data[0].low;
            if (stock.price < high && stock.price > low) {
                await addStock(portfolioId, stock.symbol, stock.price, stock.quantity, stock.type, stock.date);
                refClose.current.click();
                fetchStocks(portfolioId);
                fetchStocktransactions(portfolioId);
            } else {
                alert(`Price should be between ${low} and ${high}`);
            }
        } catch (error) {
            alert(`Error: ${error.message}, check the stock symbol`);
        }
    }

    const sellStock = (currentStock) =>{
        ref.current.click();
        setStock({id:currentStock._id, symbol: currentStock.symbol, price: "", quantity: currentStock.quantity, type: "sell", date: ""})
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
                        <h1 className="modal-title fs-5" id="editStockModalLabel">Sell {stock.symbol}</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleClick} >
                            <div className="mb-3">
                                <label htmlFor="price" className="form-label">Selling Price</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="price"
                                    name="price"
                                    placeholder="Enter sell price"
                                    onChange={onChange}
                                    value={stock.price}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="quantity" className="form-label">Selling Quantity</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="quantity"
                                    name="quantity"
                                    placeholder="Enter quantity"
                                    onChange={onChange}
                                    value={stock.quantity}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="date" className="form-label">Selling Date</label>  
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="date"
                                        placeholder="selling date"
                                        name="date"
                                        onChange={onChange}
                                        value={stock.date}
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
        <h3 className='my-3'>Holdings</h3>
        {stocks.length === 0 ? (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100px' }}>
                <h3 className="text-muted">No Current Holdings</h3>
            </div>
                ) : (
                    <>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <div className="col">Symbol</div>
                            <div className="col">Qty</div>
                            <div className="col">Average Price</div>
                            <div className="col">Current Price</div>
                            <div className="col">Invested</div>
                            <div className="col">Current</div>
                            <div className="col">Returns</div>
                        </div>
                        {stocks.map((stock) => (
                            <StockItem key={stock._id} stock={stock} sellStock={sellStock} />
                        ))}
                    </>
                )}
        </div>

        <SipList />

        <AddStock />
        <AddSip />
        <div className="row">
            <div className="col-md-6">
                <StockPieChart />
            </div>
            <div className="col-md-6">
                <StockPieChart />
            </div>
        </div>

        <StockTransactions/>

    </div>
    );
};

export default StockList;
