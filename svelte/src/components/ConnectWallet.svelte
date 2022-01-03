<script>
	import { ethers } from 'ethers';
	export let account;
	export let chainID;
	export let fundraisers;
	export let web3Props;
	export let FundraiserFactoryABI;
	export let factoryAddress;
	// Attach Wallet if not already attached
	async function attachWallet() {
		//Get the provider, this time without ethereum object
		const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
		// Prompt user for account connections
		await provider.send('eth_requestAccounts', []);
		// Get the signer
		const signer = provider.getSigner();
		// Get the account
		account = await signer.getAddress();
		// Get the chainID
		chainID = await signer.getChainId();
		// if (account && chainID == 4) {
		const fundraiserFactoryContract = new ethers.Contract(
			factoryAddress,
			FundraiserFactoryABI.abi,
			signer
		);
		fundraisers = await fundraiserFactoryContract.fundraisers(100, 0);
		// update the props for the components
		web3Props = {
			fundraiserFactoryContract,
			signer,
			provider
		};
		// }
	}
</script>

{#if !account || chainID !== 4}
	<div
		class="min-w-screen h-screen fixed left-0 top-0 flex justify-center items-center inset-0 z-50 outline-none focus:outline-none bg-no-repeat bg-center bg-cover"
		id="modal-id"
		data-close
	>
		<div class="absolute bg-black opacity-80 inset-0 z-0" />
		<div class="w-full max-w-lg p-5 relative mx-auto my-auto rounded-xl shadow-lg bg-white">
			<div class="">
				<img
					alt="metamask"
					class="block h-auto w-full rounded-xl"
					src="/metamask-fox-wordmark-stacked.svg"
				/>
				<div class="text-center p-5 flex-auto justify-center">
					<h2 class="text-xl font-bold py-4 ">
						Please connect your wallet on the Rinkeby Test Network.
					</h2>
					{#if chainID !== 4 && chainID}
						<p class="text-sm text-gray-500 px-8" />
						<p>Network Name: Rinkeby Testnet</p>
						<p>New RPC URL: https://rinkeby.infura.io/</p>
						<p>Chain ID: 4</p>
						<p>Currency Symbol: ETH</p>
						<p>Block Explorer URL: https://rinkeby.etherscan.io</p>
					{/if}
				</div>
				<div class="p-3  mt-2 text-center space-x-4 md:block">
					<button
						class="mb-2 md:mb-0 bg-green-500 border px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-white rounded-full hover:shadow-lg hover:bg-green-600"
						on:click={attachWallet}>Attach Wallet</button
					>
				</div>
			</div>
		</div>
	</div>
{/if}
