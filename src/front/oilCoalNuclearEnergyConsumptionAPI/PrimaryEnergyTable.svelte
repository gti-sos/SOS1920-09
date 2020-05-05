<script>
	import { onMount } from "svelte";
	import Table from "sveltestrap/src/Table.svelte";
	import Button from "sveltestrap/src/Button.svelte";
	import Input from "sveltestrap/src/Input.svelte";
	import Label from "sveltestrap/src/Label.svelte";
	import FormGroup from "sveltestrap/src/FormGroup.svelte";
	import { Pagination, PaginationItem, PaginationLink } from 'sveltestrap';

	import {
		pop
	} from "svelte-spa-router";
	let oilEnergy = [];
	let newOilEnergy = {
		"country": "",
		"year": "",
		"oil-consumption": 0,
		"coal-consumption": 0,
		"nuclear-energy-consumption": 0
	};

	/* Select variables */
	let countries = [];
	let years = [];
	let currentCountry = "-";
	let currentYear = "-";



	let numberElementsPages = 10;
	let pages = [1];
	let currentPage = 1;
	let offset = 0;
	let moreData = true;

	onMount(getOilEnergy);
	onMount(getCountriesYears);	


	async function getCountriesYears() {
        const res = await fetch("/api/v1/oil-coal-nuclear-energy-consumption-stats");
 
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
			errorAlert=("Error interno al intentar obtener las ciudades y los años")
            console.log("ERROR!");
        }
    }


	async function getOilEnergy() {
        console.log("Fetching oil scoal stats..."); 
        const res = await fetch("/api/v1/oil-coal-nuclear-energy-consumption-stats?offset=" + numberElementsPages * offset + "&limit=" + numberElementsPages); 
        /* Asking for the following data */ 
        const next = await fetch("/api/v1/oil-coal-nuclear-energy-consumption-stats?offset=" + numberElementsPages * (offset + 1) + "&limit=" + numberElementsPages); 
 
        if (res.ok && next.ok) {
            console.log("Ok:");
            const json = await res.json();
            const jsonNext = await next.json();
            oilEnergy = json;
            
 
            /* Checking if we have run out of elements */ 
            if (jsonNext.length == 0) {
                moreData = false;
            } else {
                moreData = true;
            }
 
            console.log("Received " + oilEnergy.length + " oil coal stats.");
        } else {
			errorAlert=("Error interno al intentar obtener todos los elementos");
            console.log("ERROR!");
        }
    }


	async function insertOilEnergy() {
		console.log("Inserting oil coal consumption...");

		if (newOilEnergy.country == ""
			|| newOilEnergy.country == null
			|| newOilEnergy.year == ""
			|| newOilEnergy.year == null) {
			alert("Es obligatorio el campo País y año");

		} else {
			const res = await fetch("/api/v1/oil-coal-nuclear-energy-consumption-stats", {
				method: "POST",
				body: JSON.stringify(newOilEnergy),
				headers: {
					"Content-Type": "application/json"
				}
			}).then(function (res) {
				/* we can update it each time we insert*/
				if (res.ok){
					getOilEnergy();
					insertAlert();
				}else {
					errorAlert("No se han podido insetar los elementos");
				}
			});
		};
	}



	async function deleteOilEnergy(country, year) {
		console.log("Deleting oil coal consumption...");
		const res = await fetch("/api/v1/oil-coal-nuclear-energy-consumption-stats" + "/" + country + "/" + year, {
			method: "DELETE"
		}).then(function (res) {
			if (res.ok){
				getOilEnergy();
				getCountriesYears();
				deleteAlert();
			} else if (res.status==404){
				errorAlert("Se ha intentado borrar un dato inexistente");
			} else {
				errorAlert("Error interno al intentar borrar un elemento concreto");
			}
			
		});
	}

	async function deleteOilEnergys() {
		console.log("Deleting oil coal consumptions...");
		const res = await fetch("/api/v1/oil-coal-nuclear-energy-consumption-stats", {
			method: "DELETE"
		}).then(function (res) {
			if (res.ok){
				getOilEnergy();
				getCountriesYears();
				deleteAllAlert();
			}else {
				errorAlert=("Error al intentar borrar todos los elementos");
			}
			
		});
	}


	async function searchYears(country) {
		console.log("Searching years in country...");
		const res = await fetch("/api/v1/oil-coal-nuclear-energy-consumption-stats/" + country)

		if (res.ok) {
			const json = await res.json();
			oilEnergy = json;

			oilEnergy.map((d) => {
				return d.year;
			});

			console.log("Update years")
		} else {
			console.log("ERROR!")
		}




	}

	async function search(country, year) {
		console.log("Searching data: " + country + "and " + year);
		/* Checking if it fields is empty */
		var url = "/api/v1/oil-coal-nuclear-energy-consumption-stats";

		if (country != "-" && year != "-") {
			url = url + "?country=" + country + "&year=" + year;
		} else if (country != "-" && year == "-") {
			url = url + "?country=" + country;
		} else if (country == "-" && year != "-") {
			url = url + "?year=" + year;
		}

		const res = await fetch(url);

		if (res.ok) {
			console.log("OK:");
			const json = await res.json();
			oilEnergy = json;

			console.log("Found " + oilEnergy.length + "Oil Coal Energy.");
		} else {
			errorAlert=("Error interno al intentar realizar la búsqueda");
			console.log("ERROR!");
		}
	}

	function addOffset(increment) {
		offset += increment;
		currentPage += increment;
		getOilEnergy();
	}


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

	function errorAlert(error){
		clearAlert();
		var alert_element = document.getElementById("div_alert");
		alert_element.style = "position: fixed; top: 0px; top: 1%; width: 90%;";
		alert_element.className = " alert alert dismissible in alert-danger ";
		alert_element.innerHTML = "<strong>¡ERROR!</strong> ¡Ha ocurrido un error!" + error;

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
	<div role ="alert" id ="div_alert" style = "display: none;">
	</div>
	{#await oilEnergy}
		Loading oilEnergy...
	{:then oilEnergys}
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
			<Label for="selectYear">Año</Label>
			<Input type="select" name="selectYear" id="selectYear" bind:value = "{currentYear}">
				{#each years as year}
				<option>{year}</option>
				{/each}
				<option>-</option>
			</Input>
		</FormGroup>

		<Button outline color="secondary" on:click="{search(currentCountry, currentYear)}" class="button-search" > <i class="fas fa-search"></i> Buscar </Button>
		
		<Table bordered>
			<thead>
				<tr>
					<th>País</th>
					<th>Año</th>
					<th>Porcentaje de consumo de Gasolina</th>
					<th>Porcentaje de consumo de Carbón</th>
					<th>Porcentaje de consumo de Energía Nuclear</th>
					<th> Acciones </th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><Input placeholder="Ej. España" bind:value = "{newOilEnergy.country}" /></td>
					<td><Input required type="number" placeholder="Ej. 2020" bind:value = "{newOilEnergy.year}" /></td>
					<td><Input required type="number" step="0.01" min="0" bind:value = "{newOilEnergy['oil-consumption']}" /></td>
					<td><Input type="number" placeholder="0.0" step="0.01" min="0" bind:value = "{newOilEnergy['coal-consumption']}" /></td>
					<td><Input type="number" placeholder="0.0" step="0.01" min="0" bind:value = "{newOilEnergy['nuclear-energy-consumption']}" /></td>
					<td><Button outline color= "primary" on:click={insertOilEnergy}> <i class="far fa-edit"></i> Insertar</Button></td>
				</tr>

				{#each oilEnergys as oilEnergy}
					<tr>
						<td>
							<a href="#/oil-coal-nuclear-energy-consumption-stats/{oilEnergy.country}/{oilEnergy.year}"> 
							{oilEnergy.country}
						</a>
						</td>
						<td>{oilEnergy.year}</td>
					
						<td>{oilEnergy['oil-consumption']}</td>
						<td>{oilEnergy['coal-consumption']}</td>
						<td>{oilEnergy['nuclear-energy-consumption']}</td>
						<td><Button outline color= "danger" on:click = {deleteOilEnergy(oilEnergy.country,oilEnergy.year)}> <i class="fa fa-trash" aria-hidden="true"></i> Borrar</Button></td>
					</tr>
				{/each}
				<tr>
				</tr>
			</tbody>
		</Table>
	{/await}

	<Pagination style="float:right;" ariaLabel="Cambiar de página">
    
		
        <PaginationItem class = "{currentPage === 1 ? 'disabled' : ''}">
          <PaginationLink previous href="#/oilCoalNuclearEnergyConsumptionAPI" on:click="{() => addOffset(-1)}" />
        </PaginationItem>
		
		{#if currentPage != 1}
        <PaginationItem>
            <PaginationLink href="#/oilCoalNuclearEnergyConsumptionAPI" on:click="{() => addOffset(-1)}" >{currentPage - 1}</PaginationLink>
		</PaginationItem>
		{/if}

        <PaginationItem active>
            <PaginationLink href="#/oilCoalNuclearEnergyConsumptionAPI" >{currentPage}</PaginationLink>
		</PaginationItem>

		<!-- more elements...-->
		{#if moreData}
        <PaginationItem >
            <PaginationLink href="#/oilCoalNuclearEnergyConsumptionAPI" on:click="{() => addOffset(1)}">{currentPage + 1}</PaginationLink>
         </PaginationItem>
		 {/if}

        <PaginationItem class = "{moreData ? '' : 'disabled'}">
          <PaginationLink next href="#/oilCoalNuclearEnergyConsumptionAPI" on:click="{() => addOffset(1)}"/>
        </PaginationItem>
      
    </Pagination>

	
	<Button outline color="secondary" on:click="{pop}"> <i class="fas fa-arrow-circle-left"></i> Atrás</Button>
	<Button outline color= "danger" on:click = {deleteOilEnergys}> <i class="fa fa-trash" aria-hidden="true"></i> Borrar todo</Button>

</main>
