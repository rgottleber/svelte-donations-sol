<script>
	import { fade } from 'svelte/transition';
	export let web3Props;
	export let showAdd;
	export let fundraisers;
	let imgURL;
	let title;
	let description;
	$: creating = false;
	async function createFundraiser() {
		let txn = await web3Props.fundraiserFactoryContract.createFundraiser(
			title,
			imgURL,
			description,
			web3Props.signer.getAddress()
		);
		creating = true;
		await txn.wait();
		creating = false;
		showAdd = false;
		fundraisers = await web3Props.fundraiserFactoryContract.fundraisers(100, 0);
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
			showAdd = false;
		}}
	/>
	{#if !creating}
		<div class="w-full max-w-lg p-5 relative mx-auto my-auto rounded-xl shadow-lg bg-white">
			<h1 class="text-3xl font-black text-center p-5">Create A New Fundraiser</h1>
			<div class="p-3">
				<input
					type="url"
					class="w-full bg-grey-lighter text-grey-darker py-2 font-normal rounded text-grey-darkest border border-grey-lighter font-bold"
					bind:value={imgURL}
					placeholder="  Image URL"
				/>
			</div>
			<div class="p-3">
				<input
					type="text"
					class="w-full bg-grey-lighter text-grey-darker py-2 font-normal rounded text-grey-darkest border border-grey-lighter font-bold"
					bind:value={title}
					placeholder="  Fundraiser Title"
				/>
			</div>
			<div class="p-3">
				<textarea
					type="textarea"
					class="w-full h-52 bg-grey-lighter text-grey-darker py-2 font-normal rounded text-grey-darkest border border-grey-lighter font-bold"
					bind:value={description}
					placeholder="  Fundraiser Description"
				/>
			</div>
			<div class="p-3  mt-2 text-center space-x-4 md:block">
				<button
					class="mb-2 md:mb-0 bg-white px-5 py-2 text-sm shadow-sm font-medium tracking-wider border text-gray-600 rounded-full hover:shadow-lg hover:bg-gray-100"
					on:click={() => {
						showAdd = false;
					}}
				>
					Cancel
				</button>
				<button
					class="mb-2 md:mb-0 bg-green-500 border px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-white rounded-full hover:shadow-lg hover:bg-green-600"
					on:click={() => {
						createFundraiser();
					}}>Create</button
				>
			</div>
		</div>
	{:else}
		<div class="w-full max-w-lg p-5 relative mx-auto my-auto rounded-xl shadow-lg bg-white">
			<h1 class="text-3xl font-black text-center p-5">Creating a new fundraiser.</h1>
		</div>
	{/if}
</div>
