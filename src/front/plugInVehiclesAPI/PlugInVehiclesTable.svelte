<script>

	import { 
		onMount 
	} from "svelte";
	import {
        pop
    } from "svelte-spa-router";

	import Table from "sveltestrap/src/Table.svelte";
	import Button from "sveltestrap/src/Button.svelte";
	import Input from "sveltestrap/src/Input.svelte";
	import Label from "sveltestrap/src/Label.svelte";
	import Form from "sveltestrap/src/Form.svelte";
	import FormGroup from "sveltestrap/src/FormGroup.svelte";

	let pluginVehicles = [];
	let newPluginVehicles = {
		"country": "",
		"year": "",
		"pev-stock": 0,
		"annual-sale": 0,
		"cars-per-1000": 0.0
	};

	// These variables are for the selects.
	let countries = [];
	let years = [];
	let currentCountry = "-";
	let currentYear = "-";
	
	onMount(getPluginVehicles);

	async function getPluginVehicles(){
		console.log("Fetching plugin vehicles...");
		const res = await fetch("/api/v1/plugin-vehicles-stats");

		if (res.ok){
			console.log("OK:");
			const json = await res.json();
			pluginVehicles = json;

			// Getting the countries for the select
			countries = json.map((d) => {
			return d.country;
		});

		//Deleting duplicated countries
		countries = Array.from(new Set(countries));

		// Getting the years for the select
		years = json.map((d) => {

			return d.year;
		});

		//Deleting duplicated years
		years = Array.from(new Set(years));

			console.log("Received " +pluginVehicles.length+" plugin vehicles.");
		}else{
			console.log("ERROR!");
		}
	}

	async function insertPluginVehicles(){
		console.log("Inserting plugin vehicles...");
		if(newPluginVehicles.country == "" 
		|| newPluginVehicles.country == null 
		|| newPluginVehicles.year == "" 
		|| newPluginVehicles.year == null){

			alert("Se debe incluir el nombre del país y del año");
		}
		else{
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
	}

	async function deletePluginVehicles(country, year) {
		console.log("Deleting plugin vehicles...");
		const res = await fetch("/api/v1/plugin-vehicles-stats/" + country + "/" + year, {
			method: "DELETE"
		}).then(function (res) {
			getPluginVehicles();
		});
	}
	
	async function deletePluginVehiclesAll() {
		console.log("Deleting all plugin vehicles...");
		const res = await fetch("/api/v1/plugin-vehicles-stats", {
			method: "DELETE"
		}).then(function (res) {
			getPluginVehicles();
		});
	}

	async function search(country, year){
		console.log("Searching data: " + country + "and " + year);

		/* Checking if the fields are empty */
		var url = "/api/v1/plugin-vehicles-stats";

		if(country != "-" && year != "-"){
			url = url + "?country=" + country + "&year=" + year;
		}else if(country != "-" && year == "-"){
			url = url + "?country=" + country;
		}else if(country == "-" && year != "-"){
			url = url + "&year=" + year;
		}

		const res = await fetch(url);
		if (res.ok){
			console.log("OK:");
			const json = await res.json();
			pluginVehicles = json;
			
			console.log("Received " +pluginVehicles.length+" plugin vehicles.");
		}else{
			console.log("ERROR!");
		}
	}

</script>

<main>

	<FormGroup> 
		<Label for="selectCountry">Búsqueda por país </Label>
		<Input type="select" name="selectCountry" id="selectCountry" bind:value="{currentCountry}">
			{#each countries as country}
			<option>{country}</option>
			{/each}
			<option>-</option>
		</Input>
	</FormGroup>
	
	<FormGroup> 
		<Label for="selectYear">Búsqueda por años </Label>
		<Input type="select" name="selectYear" id="selectYear" bind:value="{currentYear}">
			{#each years as year}
			<option>{year}</option>
			{/each}
			<option>-</option>
		</Input>
	</FormGroup>

	<Button outline color="secondary" on:click="{search(currentCountry, currentYear)}">Buscar</Button>


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
					<td><Input placeholder="Ej. Spain" bind:value="{newPluginVehicles.country}" /></td>
					<td><Input placeholder="Ej. 2020" type="number" bind:value="{newPluginVehicles.year}" /></td>
					<td><Input type="number" bind:value="{newPluginVehicles['pev-stock']}" /></td>
					<td><Input type="number" bind:value="{newPluginVehicles['annual-sale']}" /></td>
					<td><Input type="number" placeholder="0.0" step="0.01" min="0" bind:value="{newPluginVehicles['cars-per-1000']}" /></td>
					<td> <Button outline color="primary" on:click={insertPluginVehicles}>Insertar</Button></td>
				</tr>
				{#each pluginVehicles as pluginVehicles}
					<tr>
						<td>
							<a href="#/plugin-vehicles-stats/{pluginVehicles.country}/{pluginVehicles.year}">
								{pluginVehicles.country}
							</a>
						</td>
						<td>{pluginVehicles.year}</td>
						<td>{pluginVehicles['pev-stock']}</td>
						<td>{pluginVehicles['annual-sale']}</td>
						<td>{pluginVehicles['cars-per-1000']}</td>
						<td><Button outline color="danger" on:click="{deletePluginVehicles(pluginVehicles.country, pluginVehicles.year)}">Borrar</Button></td>
					</tr>
				{/each}
			</tbody>
		</Table>
	{/await}

	<Button outline color="secondary" on:click="{pop}">Atrás</Button>
	<Button outline color="danger" on:click={deletePluginVehiclesAll} >Borrar todos</Button>

</main>