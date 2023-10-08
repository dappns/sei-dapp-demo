import { useCallback, useEffect, useState } from 'react';
import { useCosmWasmClient, useSigningCosmWasmClient, useWallet, WalletConnectButton } from '@sei-js/react';
import { getQueryClient, getSigningClient } from '@sei-js/core';
const CONTRACT_ADDRESS = 'sei18g4g35mhy5s88nshpa6flvpj9ex6u88l6mhjmzjchnrfa7xr00js0gswru'; // (atlantic-2 example) sei18g4g35mhy5s88nshpa6flvpj9ex6u88l6mhjmzjchnrfa7xr00js0gswru
import { calculateFee } from '@cosmjs/stargate';
function Home() {
	const [count, setCount] = useState();
	const [error, setError] = useState('');
	const [txHash, setTxHash] = useState('')
	const [isIncrementing, setIsIncrementing] = useState(false);
	const [balance, setBalance] = useState('');
	const [signedMessage, setSignedMessage]  = useState('')
	const [verifyMessage, setVerifyMessage] = useState('false')
	const REST_RPC_URL = "https://rest.atlantic-2.seinetwork.io/"
	const RPC_URL = "https://rpc.atlantic-2.seinetwork.io/"

	// Helpful hook for getting the currently connected wallet and chain info
	const { connectedWallet, accounts, offlineSigner } = useWallet();
	const { signingCosmWasmClient: signingClient } = useSigningCosmWasmClient();
	// For querying cosmwasm smart contracts
	// const { cosmWasmClient: queryClient } = useCosmWasmClient();
	// For executing messages on cosmwasm smart contracts

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


	useEffect(() => {
		console.log("fetch balance,");
	    fetchBalance()
	}, [connectedWallet]);

	
	const signArbitraryTest = async () => {
		var SENDER_ADDRESS = accounts[0].address
		var res = await connectedWallet.signArbitrary("atlantic-2", SENDER_ADDRESS, "hello")
		console.log("signed ----- is: ", res);
		setSignedMessage(JSON.stringify(res))
	}

	const verifyArbitraryTest = async () => {
		var SENDER_ADDRESS = accounts[0].address
		var res = await connectedWallet.verifyArbitrary("atlantic-2", SENDER_ADDRESS, "hello", signedMessage)
		console.log("verified ----- is: ", res);
		setVerifyMessage(String(res))
	}

	const disableTest = async() => {
		var SENDER_ADDRESS = accounts[0].address
		var res = await connectedWallet.disconnect("atlantic-2", SENDER_ADDRESS, "hello")
		console.log("signed----- is: ", res);
		// setSignedMessage(JSON.stringify(res))
	}

	const senToken = async ()  =>  {
		var SENDER_ADDRESS = accounts[0].address
		var DESTINATION_ADDRESS = accounts[0].address
		const signingClient = await getSigningClient(RPC_URL, offlineSigner);
		const SEND_AMOUNT = "1000";
        const amount = { amount: SEND_AMOUNT, denom: "usei" };

        const sendMsg = {
            typeUrl: "/cosmos.bank.v1beta1.MsgSend",
            value: {
              fromAddress: SENDER_ADDRESS,
              toAddress: DESTINATION_ADDRESS,
              amount: [amount],
            },
          };
          
          
        const gasEstimation = await signingClient.simulate(SENDER_ADDRESS, [sendMsg], "");
        var res = parseInt((gasEstimation * 12 / 10).toString())

        var calculate = calculateFee(res, "0.1usei")
		try {
			console.log("send tokens")
			// const sendResponse = await signingClient.sendTokens(SENDER_ADDRESS, DESTINATION_ADDRESS, [amount], { amount: [ { amount: '8411', denom: 'usei' } ], gas: '84103' });
			// console.log(sendResponse.transactionHash);
			// setTxHash(sendResponse.transactionHash)
			var res = await signingClient.sign(SENDER_ADDRESS,[],{ amount: [ { amount: '8411', denom: 'usei' } ], gas: '84103' });
			console.log(res)
		} catch(err) {
			console.log("error", err);
			setError(err.toString())
		}
	}

	

	// Helpful component for wallet connection
	if (!connectedWallet) return <WalletConnectButton />;

	return (
	    <div>
		<h1>Count is: {count ? count : '---'}</h1>
		<p>address is: {JSON.stringify(accounts[0])}</p>
		<p>balance is {balance}</p>
		<p>tx hash: ${txHash}</p>
		<p>signed message: ${signedMessage}</p>
		<p>verified message: ${verifyMessage}</p>
		<button onClick={senToken}>
		    send token
		</button>
		<p>--</p>
		<button onClick={signArbitraryTest}>
		signArbitraryTest
		</button>
		<p>--</p>
		<button onClick={verifyArbitraryTest}>
		verifyArbitraryTest
		</button>
		<p>--</p>
		<button onClick={disableTest}>
		disable
		</button>
		{error && <p style={{ color: 'red' }}>{error}</p>}
	    </div>
	);
}

export default Home;