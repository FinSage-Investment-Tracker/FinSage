import React from 'react'

const FDItem = ({fd, sellFD}) => {
  return (
    <>
    <div className="card w-100 mb-3" style={{ padding: '15px' }}>
        <div className="d-flex justify-content-between align-items-center">
            <div className="col">{fd.name}</div>
            <div className="col">{fd.bank}</div>
            <div className="col">{fd.amount}</div>
            <div className="col">{fd.interest}% p.a</div>
            <button type="button" className="btn btn-danger" onClick={() => sellFD(fd)} >Withdraw</button>
        </div>
    </div>
    </>
  )
}

export default FDItem