import { useCallback, useEffect, useState } from 'react';
import { useCosmWasmClient, useSigningCosmWasmClient, useWallet, WalletConnectButton } from '@sei-js/react';
import { getQueryClient, getSigningClient } from '@sei-js/core';
const CONTRACT_ADDRESS = 'sei18g4g35mhy5s88nshpa6flvpj9ex6u88l6mhjmzjchnrfa7xr00js0gswru'; // (atlantic-2 example) sei18g4g35mhy5s88nshpa6flvpj9ex6u88l6mhjmzjchnrfa7xr00js0gswru
import { calculateFee } from '@cosmjs/stargate';

import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";

const createCosmWasmClient = async () => {
    const rpcEndpoint = "https://sei-rpc.polkachu.com"; // Replace with your network RPC endpoint
    const signer = ...; // Define the signer, depending on your authentication method
    
    return SigningCosmWasmClient.connectWithSigner(rpcEndpoint, signer);
};

// Home.tsx
const Home = () => {
    // Within any component that is a child of <SeiWalletProvider>
    const { offlineSigner, connectedWallet, accounts } = useWallet();
    return (
        <div>
            {!connectedWallet ? <WalletConnectButton /> : <p>connected to: {connectedWallet}</p>}
        </div>
    )
};

export default Home;