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
	
	onMount(getPluginVehicles);
	onMount(getCountriesYears);
 
    /* 
    This function get years and countries to put them into the selects.
	We call it just once in the onMount and each time we need to update the selects,
	but taking care we are asking for all the data
    */
    async function getCountriesYears() {
        const res = await fetch("/api/v1/plugin-vehicles-stats");
 
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
            console.log("ERROR!");
        }
	}

	async function getPluginVehicles(){
		console.log("Fetching plugin vehicles...");
		const res = await fetch("/api/v1/plugin-vehicles-stats?offset=" + numberElementsPages * offset + "&limit=" + numberElementsPages);
		const next = await fetch("/api/v1/plugin-vehicles-stats?offset=" + numberElementsPages * (offset + 1) + "&limit=" + numberElementsPages);
		// Asking for the following data

		if (res.ok && next.ok){
			console.log("OK:");
			const json = await res.json();
			const jsonNext = await next.json();
			pluginVehicles = json;

		// checking if we have run out of elements
		if(jsonNext.length == 0){
			moreData = false;
			
		}else{
			moreData = true;
		}

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
				/* If we want the select to be update each time we insert, uncoment the line below */
				//getCountriesYears();
			});
		}
	}

	async function deletePluginVehicles(country, year) {
		console.log("Deleting plugin vehicles...");
		const res = await fetch("/api/v1/plugin-vehicles-stats/" + country + "/" + year, {
			method: "DELETE"
		}).then(function (res) {
			getPluginVehicles();
			getCountriesYears();
		});
	}
	
	async function deletePluginVehiclesAll() {
		console.log("Deleting all plugin vehicles...");
		const res = await fetch("/api/v1/plugin-vehicles-stats", {
			method: "DELETE"
		}).then(function (res) {
			getPluginVehicles();
			getCountriesYears();
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
			url = url + "?year=" + year;
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

	async function addOffset(increment){
		offset += increment;
		currentPage += increment;
		getPluginVehicles();
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
            <PaginationLink href="#">{currentPage}</PaginationLink>
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
	<Button outline color="danger" on:click={deletePluginVehiclesAll} > <i class="fa fa-trash" aria-hidden="true"></i> Borrar todos</Button>

</main>