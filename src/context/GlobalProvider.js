import React from 'react';
import { StocksProvider } from './StocksContext';
import { MFProvider } from './MfContext';
import { PortfolioProvider } from './PortfolioContext';

const GlobalProvider = ({ children }) => {
    return (
        <StocksProvider>
            <MFProvider>
                <PortfolioProvider>
                    {children}
                </PortfolioProvider>
            </MFProvider>
        </StocksProvider>
    );
};

export default GlobalProvider;
