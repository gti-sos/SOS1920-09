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

	import { Pagination, PaginationItem, PaginationLink } from 'sveltestrap';
	
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

	let numberElementsPages = 10;
	let offset = 0;
	let currentPage = 1;
	let moreData = true; 

	onMount(getRenewableSources);

	async function getRenewableSources() {
		console.log("Fetching renewable sources stats...");	
		const res = await fetch("/api/v1/renewable-sources-stats?offset=" + numberElementsPages * offset + "&limit=" + numberElementsPages); 
		/* Asking for the following data */ 
		const next = await fetch("/api/v1/renewable-sources-stats?offset=" + numberElementsPages * (offset + 1) + "&limit=" + numberElementsPages); 

		if (res.ok && next.ok) {
			console.log("Ok:");
			const json = await res.json();
			const jsonNext = await next.json();
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

			/* Checking if we have run out of elements */ 
			if (jsonNext.length == 0) {
				moreData = false;
			} else {
				moreData = true;
			}


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

	async function total () {


	}


	function addOffset (increment) {
		offset += increment;
		currentPage += increment;
		getRenewableSources();
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

	<Pagination style="float:right;" ariaLabel="Cambiar de página">


		<PaginationItem class="{currentPage === 1 ? 'disabled' : ''}">
		  <PaginationLink previous href="#/renewableSourcesAPI" on:click="{() => addOffset(-1)}" />
		</PaginationItem>
		
		<!-- If we are not in the first page-->
		{#if currentPage != 1}
		<PaginationItem>
			<PaginationLink href="#/renewableSourcesAPI" on:click="{() => addOffset(-1)}" >{currentPage - 1}</PaginationLink>
		</PaginationItem>
		{/if}
		<PaginationItem active>
			<PaginationLink href="#/renewableSourcesAPI" >{currentPage}</PaginationLink>
		</PaginationItem>

		<!-- If there are more elements-->
		{#if moreData}
		<PaginationItem >
			<PaginationLink href="#/renewableSourcesAPI" on:click="{() => addOffset(1)}">{currentPage + 1}</PaginationLink>
		</PaginationItem>
		{/if}

		<PaginationItem class="{moreData ? '' : 'disabled'}">
		  <PaginationLink next href="#/renewableSourcesAPI" on:click="{() => addOffset(1)}"/>
		</PaginationItem>

	</Pagination>

	<Button outline color="secondary" on:click="{pop}"> Atrás </Button>
	<Button outline on:click={deleteRenewableSources} color="danger"> Borrar todo </Button>
</main>