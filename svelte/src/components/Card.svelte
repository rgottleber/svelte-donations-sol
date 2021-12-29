<script>
	import { onMount } from 'svelte';
	import { ethers } from 'ethers';
	import FundraiserABI from '../contracts/Fundraiser.json';
	export let show;
	export let fundraiser;
	export let web3Props;
	export let fundraiserData;
	let name = '';
	let description = '';
	let imageURL = '';
	let raised = '';
	let value = 0;
	let fundraiserContract;
	onMount(async () => {
		try {
			const aggregatorV3InterfaceABI = [
				{
					inputs: [],
					name: 'decimals',
					outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
					stateMutability: 'view',
					type: 'function'
				},
				{
					inputs: [],
					name: 'description',
					outputs: [{ internalType: 'string', name: '', type: 'string' }],
					stateMutability: 'view',
					type: 'function'
				},
				{
					inputs: [{ internalType: 'uint80', name: '_roundId', type: 'uint80' }],
					name: 'getRoundData',
					outputs: [
						{ internalType: 'uint80', name: 'roundId', type: 'uint80' },
						{ internalType: 'int256', name: 'answer', type: 'int256' },
						{ internalType: 'uint256', name: 'startedAt', type: 'uint256' },
						{ internalType: 'uint256', name: 'updatedAt', type: 'uint256' },
						{ internalType: 'uint80', name: 'answeredInRound', type: 'uint80' }
					],
					stateMutability: 'view',
					type: 'function'
				},
				{
					inputs: [],
					name: 'latestRoundData',
					outputs: [
						{ internalType: 'uint80', name: 'roundId', type: 'uint80' },
						{ internalType: 'int256', name: 'answer', type: 'int256' },
						{ internalType: 'uint256', name: 'startedAt', type: 'uint256' },
						{ internalType: 'uint256', name: 'updatedAt', type: 'uint256' },
						{ internalType: 'uint80', name: 'answeredInRound', type: 'uint80' }
					],
					stateMutability: 'view',
					type: 'function'
				},
				{
					inputs: [],
					name: 'version',
					outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
					stateMutability: 'view',
					type: 'function'
				}
			];
			const addr = '0x8A753747A1Fa494EC906cE90E9f37563A8AF630e';
			const priceFeed = new ethers.Contract(addr, aggregatorV3InterfaceABI, web3Props.signer);
			let roundData = await priceFeed.latestRoundData();
			let decimals = await priceFeed.decimals();
			value = Number((roundData.answer.toString() / Math.pow(10, decimals)).toFixed(2));

			fundraiserContract = new ethers.Contract(fundraiser, FundraiserABI.abi, web3Props.signer);
			name = await fundraiserContract.name();
			description = await fundraiserContract.description();
			imageURL = await fundraiserContract.image();
			let val = await fundraiserContract.totalDonations();
			raised = ethers.utils.formatEther(val);
		} catch (e) {
			console.log(e);
		}
	});
</script>

<div class="my-1 px-1 w-full md:w-1/2 lg:my-4 lg:px-4 lg:w-1/3">
	<div
		class="overflow-hidden rounded-lg shadow-lg"
		on:click={() => {
			fundraiserData = {
				name: name,
				description: description,
				imageURL: imageURL,
				address: fundraiser,
				raised: raised,
				fundraiserContract: fundraiserContract
			};
			show = true;
		}}
	>
		<img alt="Placeholder" class="block max-h-48 w-full object-cover" src={imageURL} />
		<header class="flex items-center justify-between leading-tight p-2 md:p-4">
			<h1 class="text-lg">
				<a class="no-underline hover:underline text-black" href="/">{name}</a>
			</h1>
			<p class="text-gray-600 text-xs">
				<a class="no-underline hover:underline text-black" href="/">
					$ {(Number(raised) * value).toFixed(2)} USD
				</a>
			</p>
		</header>
	</div>
</div>
