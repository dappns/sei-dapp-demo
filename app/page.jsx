'use client';
import { SeiWalletProvider } from '@sei-js/react';
import Home from './home.jsx';

function App() {
    return (
    	// Set up SeiWalletProvider for easy wallet connection and to use hooks in @sei-js/react
        <SeiWalletProvider
	    chainConfiguration={{
	        chainId: 'pacific-1',
          restUrl: 'https://sei-rpc.polkachu.com',
          rpcUrl: 'https://sei-rpc.polkachu.com'
	    }}
	    wallets={['leap','keplr', 'fin','compass','falcon','coin98']}>
	        <Home />
      </SeiWalletProvider>
    );
}

export default App;
