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

	const BASE_API_URL = "/api/v2/renewable-sources-stats";
	
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
	let currentPage = 1; /* We could use just one variable offset or currentPage, we leave both */
	let moreData = true; 

	onMount(() => { getRenewableSources(currentCountry, currentYear); });
	onMount(getCountriesYears);

	/* 
	This function get years and countries to put them into the selects.
	We call it just once in the onMount and each time we need to update the selects,
	but taking care we are asking for all the data.
	*/
	async function getCountriesYears() {
		const res = await fetch(BASE_API_URL);

		/* Getting the countries for the select */
		if (res.ok) {
			const json = await res.json();

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

			console.log("Counted " + countries.length + "countries and " + years.length + "years.");

		} else {
			errorAlert("Error interno al intentar obtener las ciudades y los años");
			console.log("ERROR!");
		}
	}

	async function getRenewableSources(country, year) {
		console.log("Fetching renewable sources stats...");	
		/* Checking if the fields are empty */
		var url = BASE_API_URL + "?limit=" + numberElementsPages;

		if (country != "-" && year != "-") {
			url = url + "&country=" + country + "&year=" + year;
		} else if (country != "-" && year == "-") {
			url = url + "&country=" + country;
		} else if (country == "-" && year != "-") {
			url = url + "&year=" + year;
		}

		const res = await fetch(url + "&offset=" + numberElementsPages * offset ); 
		/* Asking for the following data for the pagination */ 
		const next = await fetch(url + "&offset=" + numberElementsPages * (offset + 1)); 

		if (res.ok && next.ok) {
			console.log("Ok:");
			const json = await res.json();
			const jsonNext = await next.json();
			renewableSources = json;
			
			/* Checking if we have run out of elements */ 
			if (jsonNext.length == 0) {
				moreData = false;
			} else {
				moreData = true;
			}

			console.log("Received " + renewableSources.length + " renewable sources stats.");
		} else {
			errorAlert("Error interno al intentar obtener todos los datos");
			console.log("ERROR!");
		}
	}

	async function loadInitialRenewableSources() {
		console.log("Loading initial renewable sources stats...");	
		const res = await fetch(BASE_API_URL + "/loadInitialData").then(function(res) {
				if (res.ok) {
					console.log("Ok");
					/* Putting the current year and the country to remove the search */
					currentYear = "-";
					currentCountry = "-";
					getRenewableSources(currentCountry, currentYear);
					getCountriesYears();
					initialDataAlert();
				} else {
					errorAlert("Error interno al intentar obtener los datos iniciales");
					console.log("ERROR!");
				}
			}); 

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
			const res = await fetch(BASE_API_URL, {
				method: "POST",
				body: JSON.stringify(newRenewableSource),
				headers: {
					"Content-Type": "application/json"
				}
			}).then(function(res) {
				if (res.ok) {
					/* If we want the select to be updated each time we insert, uncomment the line below */
					/*getCountriesYears();*/
					getRenewableSources(currentCountry, currentYear);
					insertAlert();
				} else {
					errorAlert("Error interno al intentar insertar un elemento");
				}
				
				
			}); 
		}
	}

	async function deleteRenewableSource(country, year) {
		console.log("Deleting renewable resource...");
		const res = await fetch(BASE_API_URL + "/" + country + "/" + year, {
			method: "DELETE"
		}).then(function (res) {
			if (res.ok) {
				getRenewableSources(currentCountry, currentYear);
				/* If we want to delete the entry in the select, uncomment the line below */
				/* We decided to conserve the option because we find it more logic */
				/* getCountriesYears(); */
				deleteAlert();
			} else if (res.status == 404) {
				errorAlert("Se ha intentado borrar un elemento inexistente.");
			} else {
				errorAlert("Error interno al intentar borrar un elemento concreto");
			}
		});
	}

	async function deleteRenewableSources() {
		console.log("Deleting renewable resources...");
		const res = await fetch(BASE_API_URL + "/", {
			method: "DELETE"
		}).then(function (res) {
			if (res.ok) {
				/* To put the correct number in pagination */
				setOffset(0);
				currentYear = "-";
				currentCountry = "-";
				getRenewableSources(currentCountry, currentYear);
				getCountriesYears();
				deleteAllAlert();
			} else {
				errorAlert("Error interno al intentar borrar todos los elementos");
			}
		});
	}

	function search (country, year) {
		setOffset(0);
		getRenewableSources(country, year);
	}

	function setOffset (newOffset) {
		offset = newOffset;
		currentPage = newOffset + 1;
	}

	function addOffset (increment) {
		offset += increment;
		currentPage += increment;
		getRenewableSources(currentCountry, currentYear);
	}
	

	/* These functions are for the alerts */ 
	function insertAlert() {
		clearAlert();
		var alert_element = document.getElementById("div_alert");
		alert_element.style = "position: fixed; top: 0px; top: 1%; width: 90%;";
		alert_element.className = "alert alert-dismissible in alert-success ";
		alert_element.innerHTML = "<strong>¡Dato insertado!</strong> El dato ha sido insertado correctamente";
		
		setTimeout(() => {
			clearAlert();
		}, 3000);
	}
	
	function deleteAlert() {
		clearAlert();
		var alert_element = document.getElementById("div_alert");
		alert_element.style = "position: fixed; top: 0px; top: 1%; width: 90%;";
		alert_element.className = "alert alert-dismissible in alert-danger ";
		alert_element.innerHTML = "<strong>¡Dato borrado!</strong> El dato ha sido borrado correctamente";
		
		setTimeout(() => {
			clearAlert();
		}, 3000);
	}

	function deleteAllAlert() {
		clearAlert();
		var alert_element = document.getElementById("div_alert");
		alert_element.style = "position: fixed; top: 0px; top: 1%; width: 90%;";
		alert_element.className = "alert alert-dismissible in alert-danger ";
		alert_element.innerHTML = "<strong>¡Datos borrados!</strong> Todos los datos han sido borrados correctamente";
		
		setTimeout(() => {
			clearAlert();
		}, 3000);
	}

	function initialDataAlert() {
		clearAlert();
		var alert_element = document.getElementById("div_alert");
		alert_element.style = "position: fixed; top: 0px; top: 1%; width: 90%;";
		alert_element.className = "alert alert-dismissible in alert-warning ";
		alert_element.innerHTML = "<strong>¡Datos iniciales!</strong> Se han generado datos iniciales correctamente ";
		
		setTimeout(() => {
			clearAlert();
		}, 3000);
	}

	function errorAlert(error) {
		clearAlert();
		var alert_element = document.getElementById("div_alert");
		alert_element.style = "position: fixed; top: 0px; top: 1%; width: 90%;";
		alert_element.className = "alert alert-dismissible in alert-danger ";
		alert_element.innerHTML = "<strong>¡ERROR!</strong> ¡Ha ocurrido un error! " + error;
		
		setTimeout(() => {
			clearAlert();
		}, 3000);
	}

	function clearAlert () {
		var alert_element = document.getElementById("div_alert");
		alert_element.style = "display: none; ";
		alert_element.className = "alert alert-dismissible in";
		alert_element.innerHTML = "";
	}

</script>



<main>
	<!-- This div is for the alerts -->
	<div role="alert" id="div_alert" style="display: none;">
	</div>
	{#await renewableSources}
		Loading renewable sources...
	{:then renewableSources}
		
		<FormGroup> 
			<Label for="selectCountry"> Búsqueda por país </Label>
			<Input type="select" name="selectCountry" id="selectCountry" bind:value="{currentCountry}">
				
				{#each countries as country}
				<!-- The if to conserve the option selected after search and delete -->
				{#if country == currentCountry}
				<option selected="selected">{country}</option>
				{:else}
				<option>{country}</option>
				{/if}
				{/each}
				<option>-</option>
			</Input>
		</FormGroup>
				
		<FormGroup>
			<Label for="selectYear"> Año </Label>
			<Input type="select"  name="selectYear" id="selectYear" bind:value="{currentYear}">
				{#each years as year}
				<!-- The if to conserve the option selected after search and delete -->
				{#if year == currentYear}
				<option selected="selected">{year}</option>
				{:else}
				<option>{year}</option>
				{/if}
				{/each}
				<option>-</option>
			</Input>
		</FormGroup>

		<Button outline color="secondary" on:click="{search(currentCountry, currentYear)}" class="button-search" > <i class="fas fa-search"></i> Buscar </Button>
		

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
					<td> <Button outline color="primary" on:click={insertRenewableSources}> <i class="far fa-edit"></i> Insertar </Button> </td>
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
					<td> <Button outline color="danger" on:click="{deleteRenewableSource(renewableSource.country, renewableSource.year)}" > <i class="fa fa-trash" aria-hidden="true"></i> Borrar </Button> </td>
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
	
	<Button outline color="secondary" on:click="{pop}"> <i class="fas fa-arrow-circle-left"></i> Atrás </Button>
	<Button outline color="warning" on:click={loadInitialRenewableSources} > <i class="fas fa-cloud-upload-alt" aria-hidden="true"></i> Cargar datos iniciales </Button>
	<Button outline color="danger" on:click={deleteRenewableSources} > <i class="fa fa-trash" aria-hidden="true"></i> Borrar todo </Button>
	
</main>

