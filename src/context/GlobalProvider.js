import React from 'react';
import { StocksProvider } from './StocksContext';
import { MFProvider } from './MfContext';
import { PortfolioProvider } from './PortfolioContext';
import { FDProvider } from './FDContext';

const GlobalProvider = ({ children }) => {
    return (
        <FDProvider>
        <StocksProvider>
            <MFProvider>
                <PortfolioProvider>
                    {children}
                </PortfolioProvider>
            </MFProvider>
        </StocksProvider>
        </FDProvider>
    );
};

export default GlobalProvider;
