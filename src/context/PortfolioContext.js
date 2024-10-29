import React, { createContext, useState } from 'react';

const PortfolioContext = createContext();

const PortfolioProvider = ({ children }) => {
  const host = "http://localhost:5000";
    const portfolioslist = [];
    const [portfolios, setPortfolios] = useState(portfolioslist);

    // GET ALL
    const fetchallPortfolios = async () =>{
      const response = await fetch(`${host}/api/portfolio/fetchallportfolios`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem('token')
        }
      });
      const json = await response.json();
      setPortfolios(json);
    }

    // ADD
    const addPortfolio = async (name, relationship, pan) =>{
      const response = await fetch(`${host}/api/portfolio/addportfolio`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem('token')
        },
        body: JSON.stringify({ name, relationship, pan })
      });
      const json = await response.json();
      
      setPortfolios(portfolios.concat(json));
    }

    // DELETE
    const deletePortfolio = async (id) =>{
      const response = await fetch(`${host}/api/portfolio/deleteportfolio/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem('token')
        }
      });
      // eslint-disable-next-line
      const json = await response.json();

      setPortfolios(portfolios.filter(portfolio => portfolio._id !== id));
    }

    // EDIT
    const editPortfolio = async (id, name, relationship, pan) =>{
      const response =  await fetch(`${host}/api/portfolio/updateportfolio/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem('token')
        },
        body: JSON.stringify({ name, relationship, pan }),
      });
      // eslint-disable-next-line
      const json = await response.json();
      let newPortfolios = JSON.parse(JSON.stringify(portfolios))

      for(let index=0; index< newPortfolios.length; index++){
        const element = newPortfolios[index];
        if(element._id === id){
          newPortfolios[index].name = name;
          newPortfolios[index].relationship = relationship;
          newPortfolios[index].pan = pan;
          break;
        }
      }
      setPortfolios(newPortfolios)
    }

    return (
        <PortfolioContext.Provider value={{ portfolios, fetchallPortfolios, addPortfolio, deletePortfolio, editPortfolio }}>
            {children}
        </PortfolioContext.Provider>
    );
};

export { PortfolioProvider, PortfolioContext };
