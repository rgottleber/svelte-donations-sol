<script>
	import { fade } from 'svelte/transition';
	import { ethers } from 'ethers';
	import { getETHPrice } from '../utils/getETHPrice';
	export let web3Props;
	export let show;
	let donation;
	let donating = false;
	export let fundraiserData;
	function handleKeyUp(event) {
		if (window.getSelection().toString() !== '') {
			return;
		}
		// ignore arrow keys
		let arrows = [38, 40, 37, 39];
		if (arrows.includes(event.keyCode)) {
			return;
		}
		let input = event.target.value.replace(/[\D\s._-]+/g, '');
		input = input ? parseInt(input, 10) : 0;
		event.target.value = input === 0 ? '' : input.toLocaleString('en-US');
	}
	async function makeDonation() {
		if (donation.value === '') {
			return;
		}
		let value = await getETHPrice(web3Props);

		let donationValue = ethers.utils.parseEther((donation / value).toFixed(18).toString());
		let txn = await fundraiserData.fundraiserContract.donate({ value: donationValue });
		donating = true;
		await txn.wait();
	}
</script>

<div
	class="min-w-screen h-screen fixed left-0 top-0 flex justify-center items-center inset-0 z-50 outline-none focus:outline-none bg-no-repeat bg-center bg-cover"
	id="modal-id"
	data-close
	transition:fade={{ duration: 150 }}
>
	<div
		class="absolute bg-black opacity-80 inset-0 z-0"
		on:click={() => {
			show = false;
			donating = false;
		}}
	/>
	{#if !donating}
		<div class="w-full max-w-lg p-5 relative mx-auto my-auto rounded-xl shadow-lg bg-white">
			<div class="">
				<img
					alt="Placeholder"
					class="block h-auto w-full rounded-xl"
					src={fundraiserData.imageURL}
				/>
				<div class="text-center p-5 flex-auto justify-center">
					<h2 class="text-xl font-bold py-4 ">{fundraiserData.name}</h2>
					<p class="text-sm text-gray-500 px-8">{fundraiserData.description}</p>
					<div class="flex flex-row justify-center pt-6">
						<span
							class="flex items-center bg-grey-lighter rounded rounded-r-none px-3 font-bold text-grey-darker"
							>$</span
						>
						<input
							type="text"
							step="any"
							class="bg-grey-lighter text-grey-darker py-2 font-normal rounded text-grey-darkest border border-grey-lighter font-bold"
							bind:value={donation}
							on:keyup={handleKeyUp}
							placeholder="Donation Amount"
						/>
					</div>
				</div>
				<div class="p-3  mt-2 text-center space-x-4 md:block">
					<button
						class="mb-2 md:mb-0 bg-white px-5 py-2 text-sm shadow-sm font-medium tracking-wider border text-gray-600 rounded-full hover:shadow-lg hover:bg-gray-100"
						on:click={() => {
							show = false;
						}}
					>
						Cancel
					</button>
					<button
						class="mb-2 md:mb-0 bg-green-500 border px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-white rounded-full hover:shadow-lg hover:bg-green-600 disabled:bg-gray-500"
						on:click={makeDonation}>Donate</button
					>
				</div>
			</div>
		</div>
	{:else}
		<div class="w-full max-w-lg p-5 relative mx-auto my-auto rounded-xl shadow-lg bg-white">
			<img alt="Placeholder" class="block h-auto w-full rounded-xl" src={fundraiserData.imageURL} />
			<div class="text-center p-5 flex-auto justify-center">
				<h2 class="text-xl font-bold py-4 ">Thank you for donating!</h2>
			</div>
			<button
				class="mb-2 md:mb-0 bg-green-500 border px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-white rounded-full hover:shadow-lg hover:bg-green-600"
				on:click={() => {
					donating = false;
					show = false;
				}}>Done</button
			>
		</div>
	{/if}
</div>
