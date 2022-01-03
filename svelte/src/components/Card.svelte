<script>
	import { onMount } from 'svelte';
	import { ethers } from 'ethers';
	import { getETHPrice } from '../utils/getETHPrice';
	import FundraiserABI from '../contracts/Fundraiser.json';
	export let show;
	export let fundraiser;
	export let web3Props;
	export let fundraiserData;
	let name = '';
	let description = '';
	let imageURL = '';
	let raised = '';
	let custodian = '';
	let value = 0;
	let fundraiserContract;
	let balance = 0;
	onMount(async () => {
		try {
			value = await getETHPrice(web3Props);
			fundraiserContract = new ethers.Contract(fundraiser, FundraiserABI.abi, web3Props.signer);
			name = await fundraiserContract.name();
			description = await fundraiserContract.description();
			imageURL = await fundraiserContract.image();
			let val = await fundraiserContract.totalDonations();
			raised = ethers.utils.formatEther(val);
			custodian = await fundraiserContract.owner();
			const fundaddr = fundraiser.substr(2);
			balance = Number(ethers.utils.formatEther(await web3Props.provider.getBalance(fundraiser)));
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
				fundraiserContract: fundraiserContract,
				custodian: custodian,
				balance: balance
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
