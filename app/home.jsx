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
			console.log(accounts);
			if(accounts.length > 0) {
				const queryClient = await getQueryClient(REST_RPC_URL);
				var balanceInfo = await queryClient.cosmos.bank.v1beta1.allBalances({
					address: accounts[0].address
				});
				setBalance(JSON.stringify(balanceInfo.balances))
			}
		}, [accounts])

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
			console.log("fetch balance,");
		    fetchBalance()
		}, [connectedWallet]);

    useEffect(() => {
        if (connectedWallet) {
            fetchNFTs();
        }
    }, [connectedWallet, fetchNFTs]);

    const queryNftsForAddress = async (address) => {
		    // Assuming you have a function to create a CosmWasm client
		    const client = await createCosmWasmClient();
		    
		    // Replace with actual contract query
		    const nfts = await client.queryContractSmart("sei1cpvpswatmeqw7l3macl5cty645j8caa6znfnltq63yawwhutcntshys0yn", {
		        owner: address,
		        // Additional query parameters as needed
		    });

		    return nfts;
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