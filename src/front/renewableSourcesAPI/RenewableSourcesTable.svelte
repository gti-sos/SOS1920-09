<script>
	import  {
		onMount
	}
		 from "svelte";;

	import Table from "sveltestrap/src/Table.svelte";
	import Button from "sveltestrap/src/Button.svelte";

	
	let renewableSources = [];
	let newRenewableSource = {
		"country": "",
		"year": 0,
		"percentage-re-total": 0.0,
		"percentage-hydropower-total": 0.0,
		"percentage-wind-power-total": 0.0
	};

	onMount(getRenewableSources);

	async function getRenewableSources() {
		console.log("Fetching renewable sources stats...");
		const res = await fetch("/api/v1/renewable-sources-stats"); 

		if (res.ok) {
			console.log("Ok:");
			const json = await res.json();
			renewableSources = json;
			console.log("Received " + renewableSources.length + " renewable sources stats.");
		} else {
			console.log("ERROR!");
		}
	}

	async function insertRenewableSources() {
		console.log("Inserting renewable sources stats...");
		const res = await fetch("/api/v1/renewable-sources-stats", {
			method: "POST",
			body: JSON.stringify(newRenewableSource),
			headers: {
				"Content-Type": "application/json"
			}
		}).then(function(res) {
			getRenewableSources(); 
		}); 
	}

</script>

<main>
	{#await renewableSources}
		Loading renewable sources...
	{:then renewableSources}
		<Table bordered>
			<thead>
				<tr>
					<th> País </th>
					<th> Año </th>
					<th> Porcentaje de uso de energías renovables </th>
					<th> Porcentaje de uso de energías hidroeléctricas sobre el total </th>
					<th> Porcentaje de uso de energías eólica </th>
					<th> Acciones </th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td> <input bind:value="{newRenewableSource.country}"> </td>
					<td> <input bind:value="{newRenewableSource.year}"> </td>
					<td> <input bind:value="{newRenewableSource['percentage-re-total']}"> </td>
					<td> <input bind:value="{newRenewableSource['percentage-hydropower-total']}"> </td>
					<td> <input bind:value="{newRenewableSource['percentage-wind-power-total']}"> </td>
					<td> <Button outline color="primary" on:click={insertRenewableSources}> Insertar </Button> </td>
				</tr>
				{#each renewableSources as renewableSource}
				<tr>
					<td> {renewableSource.country} </td>
					<td> {renewableSource.year} </td>
					<td> {renewableSource['percentage-re-total']} </td>
					<td> {renewableSource['percentage-hydropower-total']} </td>
					<td> {renewableSource['percentage-wind-power-total']} </td>
					<td> <Button outline color="danger"> Borrar </Button> </td>
				</tr>
				{/each}
			</tbody>
		</Table>
	{/await}
</main>