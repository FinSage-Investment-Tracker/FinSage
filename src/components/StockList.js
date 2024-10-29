import React, { useContext, useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StockContext } from '../context/StockContext';
import StockItem from './StockItem'; // Import StockItem component
import AddStock from './AddStock'; // Import AddStock component

const StockList = () => {
    const { portfolioId } = useParams();
    const { stocks, fetchStocks, addStock, updateStock } = useContext(StockContext);
    const navigate = useNavigate();
    const [stock, setStock] = useState({ id: "", symbol: "", demat: "", price: "", quantity: "", exchange: "", type: "" });
    const ref = useRef(null);
    const refClose = useRef(null);

    useEffect(() => {
        if (localStorage.getItem('token')) {
            fetchStocks(portfolioId);
        } else {
            navigate("/login");
        }
        // eslint-disable-next-line
    }, [portfolioId]);

    const handleAddStock = async (newStock) => {
        await addStock(portfolioId, newStock.symbol, newStock.demat, newStock.price, newStock.quantity, newStock.exchange, newStock.type);
        fetchStocks(portfolioId); // Fetch stocks again to update the list
    };

    const updateStockDetails = (currentStock) => {
        ref.current.click();
        setStock({
            id: currentStock._id,
            symbol: currentStock.symbol,
            demat: currentStock.demat,
            price: currentStock.price,
            quantity: currentStock.quantity,
            exchange: currentStock.exchange,
            type: currentStock.type
        });
    };

    const handleClick = (e) => {
        e.preventDefault();
        updateStock(stock.id, {
            symbol: stock.symbol,
            demat: stock.demat,
            price: stock.price,
            quantity: stock.quantity,
            exchange: stock.exchange,
            type: stock.type
        });
        refClose.current.click();
        fetchStocks(portfolioId); // Refetch stocks to get updated data
    };

    return (
        <div className="container mt-3">
            <button ref={ref} type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#editStockModal">
                Launch demo modal
            </button>

            <div className="modal fade" id="editStockModal" tabIndex="-1" aria-labelledby="editStockModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="editStockModalLabel">Edit Stock</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="symbol" className="form-label">Stock Symbol</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="symbol"
                                        name="symbol"
                                        placeholder="Enter stock symbol"
                                        onChange={(e) => setStock({ ...stock, symbol: e.target.value })}
                                        value={stock.symbol}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="demat" className="form-label">Demat</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="demat"
                                        name="demat"
                                        placeholder="Enter demat number"
                                        onChange={(e) => setStock({ ...stock, demat: e.target.value })}
                                        value={stock.demat}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="price" className="form-label">Price</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="price"
                                        name="price"
                                        placeholder="Enter stock price"
                                        onChange={(e) => setStock({ ...stock, price: e.target.value })}
                                        value={stock.price}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="quantity" className="form-label">Quantity</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="quantity"
                                        name="quantity"
                                        placeholder="Enter quantity"
                                        onChange={(e) => setStock({ ...stock, quantity: e.target.value })}
                                        value={stock.quantity}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="exchange" className="form-label">Exchange</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="exchange"
                                        name="exchange"
                                        placeholder="Enter exchange"
                                        onChange={(e) => setStock({ ...stock, exchange: e.target.value })}
                                        value={stock.exchange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="type" className="form-label">Type</label>
                                    <select
                                        className="form-select"
                                        id="type"
                                        name="type"
                                        onChange={(e) => setStock({ ...stock, type: e.target.value })}
                                        value={stock.type}
                                        required
                                    >
                                        <option value="buy">Buy</option>
                                        <option value="sell">Sell</option>
                                        {/* Add other options as needed */}
                                    </select>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button ref={refClose} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary" onClick={handleClick}>Update</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className='container'>
            <h3 className='my-3'>Stock List</h3>
            <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="col">Symbol</div>
                        <div className="col">Demat</div>
                        <div className="col">Qty</div>
                        <div className="col">Price</div>
                        <div className="col">Exchange</div>
                        <div className="col">Type</div>
                        <div className="col text-end">Actions</div>
                </div>
                {stocks.map((stock) => (
                    <StockItem key={stock._id} stock={stock} updateStockDetails={updateStockDetails} /> // Use StockItem for each stock
                ))}
            </div>

            <AddStock onStockAdded={handleAddStock} /> {/* Use AddStock component */}
        </div>
    );
};

export default StockList;
