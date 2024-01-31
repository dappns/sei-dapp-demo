import { useCallback, useEffect, useState } from 'react';
import { useCosmWasmClient, useSigningCosmWasmClient, useWallet, WalletConnectButton } from '@sei-js/react';
import { getQueryClient, getSigningClient } from '@sei-js/core';
const CONTRACT_ADDRESS = 'sei18g4g35mhy5s88nshpa6flvpj9ex6u88l6mhjmzjchnrfa7xr00js0gswru'; // (atlantic-2 example) sei18g4g35mhy5s88nshpa6flvpj9ex6u88l6mhjmzjchnrfa7xr00js0gswru
import { calculateFee } from '@cosmjs/stargate';



const Home = () => {
    // State variables
    const [balance, setBalance] = useState('');
    const [error, setError] = useState('');
    const [nfts, setNfts] = useState([]);
    const [loadingNFTs, setLoadingNFTs] = useState(false); // State to indicate loading status

    // Wallet hooks
    const { connectedWallet, accounts } = useWallet();

    // Fetch balance
    const fetchBalance = useCallback(async () => {
        // ... existing fetchBalance logic
    }, [accounts]);

    // Fetch NFTs
    const fetchNFTs = useCallback(async () => {
        if (accounts.length > 0) {
            setLoadingNFTs(true);
            const walletAddress = accounts[0].address;
            console.log(`Fetching NFTs for address: ${walletAddress}`);
            try {
                const fetchedNfts = await queryNftsForAddress(walletAddress);
                console.log('Fetched NFTs:', fetchedNfts);
                setNfts(fetchedNfts);
            } catch (err) {
                console.error('Error fetching NFTs:', err);
                setError(err.message);
            }
            setLoadingNFTs(false);
        }
    }, [accounts]);

    // useEffects
    useEffect(() => {
        // ... existing useEffect for balance
    }, [connectedWallet, fetchBalance]);

    useEffect(() => {
        if (connectedWallet) {
            fetchNFTs();
        }
    }, [connectedWallet, fetchNFTs]);

    // Placeholder function to query NFTs
    const queryNftsForAddress = async (address) => {
        // Implement actual NFT fetching logic here
        return []; // Return an array of NFT objects
    };

    // UI Rendering
    return (
        <div>
            {/* Existing UI elements */}
            <h1>Balance: {balance}</h1>
            <h2>My NFTs:</h2>
            {loadingNFTs ? (
                <p>Loading NFTs...</p>
            ) : nfts.length > 0 ? (
                <ul>
                    {nfts.map((nft, index) => (
                        <li key={index}>
                            <p>NFT Name: {nft.name}</p>
                            {/* Render more NFT details as needed */}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No NFTs found.</p>
            )}
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            {!connectedWallet && <WalletConnectButton />}
        </div>
    );
};

export default Home;