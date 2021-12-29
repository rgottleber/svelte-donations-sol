<script>
	import Card from '../components/Card.svelte';
	import Header from '../components/Header.svelte';
	import Fundraiser from '../components/Fundraiser.svelte';
	import AddFundraiser from '../components/AddFundraiser.svelte';
	import ConnectWallet from '../components/ConnectWallet.svelte';
	import FundraiserFactoryABI from '../contracts/FundraiserFactory.json';
	import Layout from './__layout.svelte';
	import { onMount } from 'svelte';
	const factoryAddress = '0x8C1478E0cdcFd3e1d625243F4a6d9399f4ce95dE';
	let web3Props = {};
	$: show = false;
	$: showAdd = false;
	$: account = null;
	$: chainID = null;
	$: fundraisers = [];
	$: fundraiserData = {};
</script>

<Header bind:showAdd />
{#if !account || chainID !== 4}
	<ConnectWallet
		bind:account
		bind:chainID
		bind:fundraisers
		bind:web3Props
		{FundraiserFactoryABI}
		{factoryAddress}
	/>
{:else}
	{#if show}
		<Fundraiser bind:show bind:fundraiserData {web3Props} />
	{/if}
	{#if showAdd}
		<AddFundraiser bind:showAdd bind:fundraisers {web3Props} />
	{/if}
	<div class="container my-12 mx-auto px-4 md:px-12">
		<div class="flex flex-wrap -mx-1 lg:-mx-4">
			{#each fundraisers as fundraiser}
				<Card bind:show {fundraiser} {web3Props} bind:fundraiserData />
			{/each}
		</div>
	</div>
{/if}
