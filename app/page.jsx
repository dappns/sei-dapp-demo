'use client';
import { SeiWalletProvider } from '@sei-js/react';
import Home from './home.jsx';

function App() {
    return (
    	// Set up SeiWalletProvider for easy wallet connection and to use hooks in @sei-js/react
        <SeiWalletProvider
	    chainConfiguration={{
	        chainId: 'atlantic-2',
          restUrl: 'https://rest.atlantic-2.seinetwork.io',
          rpcUrl: 'https://rpc.atlantic-2.seinetwork.io'
	    }}
	    wallets={['leap','keplr', 'fin','compass','falcon','coin98']}>
	        <Home />
      </SeiWalletProvider>
    );
}

export default App;
