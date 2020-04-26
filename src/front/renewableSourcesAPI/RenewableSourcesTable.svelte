<script>
	import  {
		onMount
	}
	from "svelte";

	import {
        pop
    } from "svelte-spa-router";
	
	import Table from "sveltestrap/src/Table.svelte";
	import Button from "sveltestrap/src/Button.svelte";

	import Input from "sveltestrap/src/Input.svelte";
	import Label from "sveltestrap/src/Label.svelte";
	import FormGroup from "sveltestrap/src/FormGroup.svelte";
	
	let renewableSources = [];
	let newRenewableSource = {
		"country": "",
		"year": "",
		"percentage-re-total": 0.0,
		"percentage-hydropower-total": 0.0,
		"percentage-wind-power-total": 0.0
	};

	/* These variables are for the selects */
	let countries = [];
	let years = [];
	let currentCountry = "-";
	let currentYear = "-";

	onMount(getRenewableSources);

	async function getRenewableSources() {
		console.log("Fetching renewable sources stats...");
		const res = await fetch("/api/v1/renewable-sources-stats"); 

		if (res.ok) {
			console.log("Ok:");
			const json = await res.json();
			renewableSources = json;
			
			/* Getting the countries for the select */
			countries = json.map((d) => {
				return d.country;
			});
			/* Deleting duplicated countries */
			countries = Array.from(new Set(countries)); 

			
			/* Getting the years for the select */
			years = json.map((d) => {
					return d.year;
			});
			/* Deleting duplicated years */
			years = Array.from(new Set(years)); 

			

			console.log("Received " + renewableSources.length + " renewable sources stats.");
		} else {
			console.log("ERROR!");
		}
	}

	async function insertRenewableSources() {
		console.log("Inserting renewable sources stats...");

		/* Checking if the country and the year are not empty */
		if (newRenewableSource.country == ""
			|| newRenewableSource.country == null
			|| newRenewableSource.year == "" 
			|| newRenewableSource.year == null) {
			
				alert("Se debe incluir el nombre del país y el año obligatoriamente");

		} else {
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
	}

	async function deleteRenewableSource(country, year) {
		console.log("Deleting renewable resource...");
		const res = await fetch("/api/v1/renewable-sources-stats/" + country + "/" + year, {
			method: "DELETE"
		}).then(function (res) {
			getRenewableSources();
		});
	}

	async function deleteRenewableSources() {
		console.log("Deleting renewable resources...");
		const res = await fetch("/api/v1/renewable-sources-stats/", {
			method: "DELETE"
		}).then(function (res) {
			getRenewableSources();
		});
	}

	

	async function search(country, year) {
		console.log("Searching data: " + country + " and " + year);

		/* Checking if the fields are empty */
		var url = "/api/v1/renewable-sources-stats";

		if (country != "-" && year != "-") {
			url = url + "?country=" + country + "&year=" + year; 
		} else if (country != "-" && year == "-") {
			url = url + "?country=" + country;
		} else if (country == "-" && year != "-") {
			url = url + "?year=" + year;
		}

		const res = await fetch(url);

		if (res.ok) {
			console.log("Ok:");
			const json = await res.json();
			renewableSources = json;			

			console.log("Found " + renewableSources.length + " renewable sources stats.");
		} else {
			console.log("ERROR!");
		}
		
	}


</script>

<main>

	{#await renewableSources}
		Loading renewable sources...
	{:then renewableSources}
		
		<FormGroup> 
			<Label for="selectCountry"> Búsqueda por país </Label>
			<Input type="select" name="selectCountry" id="selectCountry" bind:value="{currentCountry}">
				{#each countries as country}
				<option>{country}</option>
				{/each}
				<option>-</option>
			</Input>
		</FormGroup>
				
		<FormGroup>
			<Label for="selectYear"> Año </Label>
			<Input type="select"  name="selectYear" id="selectYear" bind:value="{currentYear}">
				{#each years as year}
				<option>{year}</option>
				{/each}
				<option>-</option>
			</Input>
		</FormGroup>

		<Button outline color="secondary" on:click="{search(currentCountry, currentYear)}"> Buscar </Button>
		

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
					<td> <Input type="text" placeholder="Ej. Spain" bind:value="{newRenewableSource.country}" /> </td>
					<td> <Input type="number" placeholder="Ej. 2020" bind:value="{newRenewableSource.year}" /> </td>
					<td> <Input type="number" placeholder="0.0" step="0.01" min="0" bind:value="{newRenewableSource['percentage-re-total']}" /> </td>
					<td> <Input type="number" placeholder="0.0" step="0.01" min="0" bind:value="{newRenewableSource['percentage-hydropower-total']}" /> </td>
					<td> <Input type="number" placeholder="0.0" step="0.01" min="0" bind:value="{newRenewableSource['percentage-wind-power-total']}" /> </td>
					<td> <Button outline color="primary" on:click={insertRenewableSources}> Insertar </Button> </td>
				</tr>
				{#each renewableSources as renewableSource}
				<tr>
					<td>			
						<a href="#/renewable-sources-stats/{renewableSource.country}/{renewableSource.year}">		
							{renewableSource.country}
						</a>
					</td>
					<td> {renewableSource.year} </td>
					<td> {renewableSource['percentage-re-total']} </td>
					<td> {renewableSource['percentage-hydropower-total']} </td>
					<td> {renewableSource['percentage-wind-power-total']} </td>
					<td> <Button outline color="danger" on:click="{deleteRenewableSource(renewableSource.country, renewableSource.year)}"> Borrar </Button> </td>
				</tr>
				{/each}
			</tbody>
		</Table>
	{/await}


	<Button outline color="secondary" on:click="{pop}"> Atrás </Button>
	<Button outline on:click={deleteRenewableSources} color="danger"> Borrar todo </Button>
</main>