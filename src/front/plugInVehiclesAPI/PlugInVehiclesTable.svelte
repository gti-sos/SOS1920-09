<script>

	import { 
		onMount 
	} from "svelte";

	import Table from "sveltestrap/src/Table.svelte";
	import Button from "sveltestrap/src/Button.svelte";

	let pluginVehicles = [];
	let newPluginVehicles = {
		"country": "",
		"year": 0,
		"pev-stock": 0,
		"annual-sale": 0,
		"cars-per-1000": 0.0
	};

	onMount(getPluginVehicles);

	async function getPluginVehicles(){
		
		console.log("Fetching plugin vehicles...");
		const res = await fetch("/api/v1/plugin-vehicles-stats");

		if (res.ok){
			console.log("OK:");
			const json = await res.json();
			pluginVehicles = json;
			console.log("Received " +pluginVehicles.length+" plugin vehicles.");
		}else{
			console.log("ERROR!");
		}
	}

	async function insertPluginVehicles(){

		console.log("Inserting plugin vehicles...");
		const res = await fetch("/api/v1/plugin-vehicles-stats", {
			method: "POST",
			body: JSON.stringify(newPluginVehicles),
			headers:{
				"Content-Type": "application/json"
			}
		}).then(function (res){
			getPluginVehicles();
		});

	}

</script>

<main>
	
	{#await pluginVehicles}
		Loading plugin vehicles...
	{:then pluginVehicles}

		<Table bordered>
			<thead>
				<tr>
					<th>País</th>
					<th>Año</th>
					<th>Ventas acumuladas</th>
					<th>Salario anual</th>
					<th>Porcentaje de coches cada 1000 personas</th>
					<th>Acciones</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><input bind:value="{newPluginVehicles.country}"></td>
					<td><input bind:value="{newPluginVehicles.year}"></td>
					<td><input bind:value="{newPluginVehicles['pev-stock']}"></td>
					<td><input bind:value="{newPluginVehicles['annual-sale']}"></td>
					<td><input bind:value="{newPluginVehicles['cars-per-1000']}"></td>
					<td> <Button outline color="primary" on:click={insertPluginVehicles}>Insertar</Button></td>
				</tr>
				{#each pluginVehicles as pluginVehicles}
					<tr>
						<td>{pluginVehicles.country}</td>
						<td>{pluginVehicles.year}</td>
						<td>{pluginVehicles['pev-stock']}</td>
						<td>{pluginVehicles['annual-sale']}</td>
						<td>{pluginVehicles['cars-per-1000']}</td>
						<td><Button outline color="danger">Borrar</Button></td>
					</tr>
				{/each}
			</tbody>
			
		</Table>
	{/await}
	
</main>