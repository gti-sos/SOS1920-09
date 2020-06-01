<script>

	import { 
		onMount 
	} from "svelte";
	import {
        pop
	} from "svelte-spa-router";
	import { 
		Pagination, PaginationItem, PaginationLink 
	} from 'sveltestrap';

	import Table from "sveltestrap/src/Table.svelte";
	import Button from "sveltestrap/src/Button.svelte";
	import Input from "sveltestrap/src/Input.svelte";
	import Label from "sveltestrap/src/Label.svelte";
	import Form from "sveltestrap/src/Form.svelte";
	import FormGroup from "sveltestrap/src/FormGroup.svelte";

	const BASE_API_URL = "/api/v3/plugin-vehicles-stats";

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

	
	let numberElementsPages = 10;
	let pages = [1];
	let offset = 0;
	let currentPage = 1; // We could use just one variable offset on currentPage, we leave both
	let moreData = true;
	
	onMount(() => { getPluginVehicles(currentCountry,currentYear); });
	onMount(getCountriesYears);
 
    /* 
    This function get years and countries to put them into the selects.
	We call it just once in the onMount and each time we need to update the selects,
	but taking care we are asking for all the data
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
			errorAlert("Error interno al intentar obtener los paises y años!");
            console.log("ERROR!");
        }
	}

	async function getPluginVehicles(country, year){
		console.log("Fetching plugin vehicles...");

		/* Checking if the fields are empty */
		var url = BASE_API_URL + "?limit=" + numberElementsPages;

		if(country != "-" && year != "-"){
			url = url + "&country=" + country + "&year=" + year;
		}else if(country != "-" && year == "-"){
			url = url + "&country=" + country;
		}else if(country == "-" && year != "-"){
			url = url + "&year=" + year;
		}

		const res = await fetch(url + "&offset=" + numberElementsPages * offset );
		// Asking for the following data of pagination
		const next = await fetch(url + "&offset=" + numberElementsPages * (offset + 1));

		if (res.ok && next.ok){
			console.log("OK:");
			const json = await res.json();
			const jsonNext = await next.json();
			pluginVehicles = json;

			// checking if we have run out of elements
			if(jsonNext.length == 0){
				moreData = false;
			
			}
			else{
				moreData = true;
			}

			console.log("Received " +pluginVehicles.length+" plugin vehicles.");
		}
		else{
			errorAlert("Error interno al intentar obtener todos los datos!");
			console.log("ERROR!");
		}
	}

	async function loadInitialPluginVehicles(){
		console.log("Loading initial plugin vehicles stats...");
		deletePluginVehiclesAll();
		const res = await fetch(BASE_API_URL + "/loadInitialData").then(function (res){
				if(res.ok){

					// Putthin the current year and the country to remove search. 
					console.log("OK:");
					currentCountry = "-";
					currentYear = "-";
					getPluginVehicles(currentCountry,currentYear);
					getCountriesYears();
					initialDataAlert();
				}
				else{
					errorAlert("Error interno al intentar obtener todos los datos iniciales!");
					console.log("ERROR!");
				}
		});
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
			const res = await fetch(BASE_API_URL, {
				method: "POST",
				body: JSON.stringify(newPluginVehicles),
				headers:{
					"Content-Type": "application/json"
				}
			}).then(function (res){
				
				if(res.ok){
				 //If we not want the select to be update each time we insert, uncoment the line below
					getCountriesYears();
					getPluginVehicles(currentCountry,currentYear);
					insertAlert();
				}
				else if (res.status == 409) {
					alert("¡Ya existe ese dato en nuestra base de datos!");
				}
				else{
					errorAlert("Error interno al intentar insertar un elemento.")
				}
			});
		}
	}

	async function deletePluginVehicles(country, year) {
		console.log("Deleting plugin vehicles...");
		const res = await fetch(BASE_API_URL + "/" + country + "/" + year, {
			method: "DELETE"
		}).then(function (res) {
			if(res.ok){
				deleteAlert();
				getPluginVehicles(currentCountry,currentYear);
			}
			else if (res.status == 404){
				errorAlert("Se ha intentado borrar un elemento inexistente");
			}
			else{
				errorAlert("Error interno al intentar borrar un elemento concreto");
			}
		});
	}
	
	async function deletePluginVehiclesAll() {
		console.log("Deleting all plugin vehicles...");
		const res = await fetch(BASE_API_URL, {
			method: "DELETE"
		}).then(function (res) {
			if(res.ok){
				// To put the correct number in pagination
				setOffset(0);
				currentCountry = "-";
				currentYear = "-";
				getPluginVehicles(currentCountry,currentYear);
				getCountriesYears();
				deleteAllAlert();
			}
			else{
				errorAlert("Error interno al intentar borrar todos los elementos.")
			}
			
		});
	}

	function search(currentCountry, currentYear){
		setOffset(0);
		getPluginVehicles(currentCountry,currentYear);
	}

	// Pagination always go first page.
	async function setOffset(newtOffset){
		offset = newtOffset;
		currentPage = newtOffset + 1;
	}

	async function addOffset(increment){
		offset += increment;
		currentPage += increment;
		getPluginVehicles(currentCountry,currentYear);
	}

	//These function are for the alerts

	function insertAlert(){
		clearAlert();
		var alert_element = document.getElementById("div_alert");
		alert_element.style = "position: fixed; top: 0px; top: 1%; width: 90%;";
		alert_element.className = " alert alert dismissible in alert-success ";
		alert_element.innerHTML = "<strong>¡Dato insertado!</strong> El dato ha sido insertado correctamente!";

		setTimeout(() => {
			clearAlert();
		}, 3000);
	}

	function deleteAlert(){
		clearAlert();
		var alert_element = document.getElementById("div_alert");
		alert_element.style = "position: fixed; top: 0px; top: 1%; width: 90%;";
		alert_element.className = " alert alert dismissible in alert-danger ";
		alert_element.innerHTML = "<strong>¡Dato borrado!</strong> El dato ha sido borrado correctamente!";

		setTimeout(() => {
			clearAlert();
		}, 3000);
	}

	function deleteAllAlert(){
		clearAlert();
		var alert_element = document.getElementById("div_alert");
		alert_element.style = "position: fixed; top: 0px; top: 1%; width: 90%;";
		alert_element.className = " alert alert dismissible in alert-danger ";
		alert_element.innerHTML = "<strong>¡Datos borrados!</strong> Todos los datos han sido borrados correctamente!";

		setTimeout(() => {
			clearAlert();
		}, 3000);
	}

	function initialDataAlert(error){
		clearAlert();
		var alert_element = document.getElementById("div_alert");
		alert_element.style = "position: fixed; top: 0px; top: 1%; width: 90%;";
		alert_element.className = " alert alert dismissible in alert-warning ";
		alert_element.innerHTML = "<strong>¡Datos cargados!</strong> Todos los datos iniciales han sido cargados correctamente!";

		setTimeout(() => {
			clearAlert();
		}, 3000);
    }

	function errorAlert(error){
		clearAlert();
		var alert_element = document.getElementById("div_alert");
		alert_element.style = "position: fixed; top: 0px; top: 1%; width: 90%;";
		alert_element.className = " alert alert dismissible in alert-danger ";
		alert_element.innerHTML = "<strong>¡ERROR!</strong> ¡Ha ocurrido un error! " + error;

		setTimeout(() => {
			clearAlert();
		}, 3000);
    }

	function clearAlert(){
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
	<FormGroup> 
		<Label for="selectCountry">Búsqueda por país </Label>
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
		<Label for="selectYear">Búsqueda por años </Label>
		<Input type="select" name="selectYear" id="selectYear" bind:value="{currentYear}">
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

	<Button outline color="secondary" on:click="{search(currentCountry, currentYear)}" class="button-search">  <i class="fas fa-search"></i> Buscar</Button>


	{#await pluginVehicles}
		Loading plugin vehicles...
	{:then pluginVehicles}

		<Table bordered>
			<thead>
				<tr>
					<th>País</th>
					<th>Año</th>
					<th>Ventas acumuladas</th>
					<th>Ventas anuales</th>
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
					<td> <Button outline color="primary" on:click={insertPluginVehicles}> <i class="far fa-edit"></i> Insertar</Button></td>
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
						<td><Button outline color="danger" on:click="{deletePluginVehicles(pluginVehicles.country, pluginVehicles.year)}"> <i class="fa fa-trash" aria-hidden="true"></i> Borrar</Button></td>
					</tr>
				{/each}
			</tbody>
		</Table>
	{/await}

	<Pagination style="float:right;" ariaLabel="Cambiar de página">
        <PaginationItem class="{currentPage === 1 ? 'disabled' : ''}">
          <PaginationLink previous href="#/plugInVehiclesAPI" on:click="{() => addOffset(-1)}" />
        </PaginationItem>
		
		<!-- If we are not in the first page-->
		{#if currentPage != 1}
        <PaginationItem>
            <PaginationLink previous href="#/plugInVehiclesAPI" on:click="{() => addOffset(-1)}">{currentPage - 1}</PaginationLink>
		</PaginationItem>
		{/if}
        <PaginationItem active>
            <PaginationLink href="#/plugInVehiclesAPI">{currentPage}</PaginationLink>
		</PaginationItem>
		<!-- If there are more elements-->
		{#if moreData}
        <PaginationItem >
            <PaginationLink previous href="#/plugInVehiclesAPI" on:click="{() => addOffset(1)}">{currentPage + 1}</PaginationLink>
         </PaginationItem>
		{/if}
		
        <PaginationItem class="{moreData === true ? '' : 'disabled'}">
          <PaginationLink next href="#/plugInVehiclesAPI" on:click="{() => addOffset(1)}" />
        </PaginationItem>
    </Pagination>

	<Button outline color="secondary" on:click="{pop}"><i class="fas fa-arrow-circle-left"></i> Atrás</Button>
	<Button outline color="warning" on:click={loadInitialPluginVehicles}> <i class="fa fa-cloud-upload-alt" aria-hidden="true"></i> Cargar datos iniciales</Button>
	<Button outline color="danger" on:click={deletePluginVehiclesAll}> <i class="fa fa-trash" aria-hidden="true"></i> Borrar todos</Button>

</main>