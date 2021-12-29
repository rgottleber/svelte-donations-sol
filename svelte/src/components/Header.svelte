<!-- component -->
<script>
	export let showAdd;
</script>

<div class="flex-1 flex flex-col">
	<nav class="px-4 flex justify-between bg-white h-16 border-b-2">
		<ul class="flex items-center">
			<!-- add button -->
			<li>
				<h1 class="pl-8 lg:pl-0 text-gray-700">Give On Chain</h1>
			</li>
		</ul>

		<!-- to bar right  -->
		<ul class="flex items-center">
			<li class="h-10 w-10">
				<button
					on:click={() => {
						showAdd = true;
					}}
				>
					<img class="h-full w-full mx-auto" src="/donate-solid.svg" alt="Add Fundraiser" />
				</button>
			</li>
		</ul>
	</nav>
</div>
