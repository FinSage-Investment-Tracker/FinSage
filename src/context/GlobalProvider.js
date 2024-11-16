import React from 'react';
import { StockProvider } from './StockContext';
import { MFProvider } from './MfContext';
import { PortfolioProvider } from './PortfolioContext';
import { FDProvider } from './FDContext';
import { UserProvider } from './UserContext';
import { GoldProvider } from './GoldContext';

const GlobalProvider = ({ children }) => {
    return (
        <GoldProvider>
        <UserProvider>
        <FDProvider>
        <StockProvider>
            <MFProvider>
                <PortfolioProvider>
                    {children}
                </PortfolioProvider>
            </MFProvider>
        </StockProvider>
        </FDProvider>
        </UserProvider>
        </GoldProvider>
    );
};

export default GlobalProvider;
