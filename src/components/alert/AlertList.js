import React, { useContext, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { StockContext } from '../../context/StockContext';

const AlertList = () => {

const {alerts, fetchAlerts, deleteAlert } = useContext(StockContext);
const navigate = useNavigate();

useEffect(() => {
    if (localStorage.getItem('token')) {
        fetchAlerts();
    } else {
        navigate("/login");
    }
    // eslint-disable-next-line
}, []);

  return (
    <div className='container'>
        <h3 className='my-3'>Alerts</h3>
        {alerts.length === 0 ? (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100px' }}>
                <h3 className="text-muted">No Active Alerts</h3>
            </div>
        ) : (
            <>
            {alerts.map((item) => (
            <div className="card w-100 mb-3" style={{ padding: '15px' }} key={item._id}>
            <div className="d-flex justify-content-between align-items-center">
                <div className='col' >{item.symbol}, when {item.condition} than {item.alertPrice}</div>
                <button className="btn btn-link p-0 col text-end"><i className="fas fa-trash-alt text-danger" onClick={()=>{deleteAlert(item._id)}} ></i></button>
            </div>
            </div>
            ))}
            </>
        )}


    </div>
  )
}

export default AlertList