import React, { useCallback, useEffect, useState } from 'react';
import { useWallet, WalletConnectButton, useCosmWasmClient } from '@sei-js/react';

const CONTRACT_ADDRESS = 'sei1cpvpswatmeqw7l3macl5cty645j8caa6znfnltq63yawwhutcntshys0yn'; // Replace with your NFT contract address

const Home = () => {
    const [nfts, setNfts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { connectedWallet, accounts } = useWallet();
    const { cosmWasmClient } = useCosmWasmClient();

    const fetchNFTs = useCallback(async () => {
        if (accounts.length > 0) {
            setLoading(true);
            setError('');
            try {
                const address = accounts[0].address;
                // Construct your query message based on your contract
                const queryMsg = { /* Your query message here */ };
                const response = await cosmWasmClient.queryContractSmart(CONTRACT_ADDRESS, queryMsg);
                setNfts(response.nfts); // Adjust this based on the actual response structure
            } catch (err) {
                console.error(err);
                setError('Failed to fetch NFTs');
            }
            setLoading(false);
        }
    }, [accounts, cosmWasmClient]);

    useEffect(() => {
        if (connectedWallet) {
            fetchNFTs();
        }
    }, [connectedWallet, fetchNFTs]);

    if (!connectedWallet) {
        return <WalletConnectButton />;
    }

    return (
        <div>
            <h1>My NFTs</h1>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>Error: {error}</p>
            ) : (
                <ul>
                    {nfts.map((nft, index) => (
                        <li key={index}>
                            <p>NFT Name: {nft.name}</p>
                            {/* Render more NFT details as needed */}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Home;
