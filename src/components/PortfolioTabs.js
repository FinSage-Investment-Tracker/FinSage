import React from 'react'
import { Link } from "react-router-dom";

const PortfolioTabs = () => {
  return (
    <>
        <ul class="nav nav-tabs">
        <li class="nav-item">
            <Link class="nav-link active" aria-current="page" to="#" >Stocks</Link> 
        </li>
        <li class="nav-item">
            <Link class="nav-link" to="#" >mf</Link> 
        </li>
        <li class="nav-item">
            <Link class="nav-link" to="#" >Fixed Deposit</Link> 
        </li>
        <li class="nav-item">
            <Link class="nav-link" aria-disabled="true" to="#" >Gold</Link> 
        </li>
        </ul>
    </>
  )
}

export default PortfolioTabs