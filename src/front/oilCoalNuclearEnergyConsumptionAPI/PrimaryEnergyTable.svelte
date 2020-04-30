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

	async function getOilEnergy() {

		console.log("Fetching oil coal consumption...");
		const res = await fetch("/api/v1/oil-coal-nuclear-energy-consumption-stats?offset=" + numberElementsPages * offset + "&limit=" + numberElementsPages);
		const next = await fetch("/api/v1/oil-coal-nuclear-energy-consumption-stats?offset=" + numberElementsPages * (offset+1) + "&limit=" + numberElementsPages);
		
		if (res.ok && next.ok) {
			console.log("OK:");
			const json = await res.json();

			const jsonNext = await next.json();
			oilEnergy = json;

			/* getting countries */
			countries = json.map((d) => {
				return d.country;
			});
			countries = Array.from(new Set(countries));
			/* getting years */
			years = json.map((d) => {
				return d.year;
			});
			/* Deleting years */
			years = Array.from(new Set(years));

			console.log(jsonNext.length);
			/*  */
			if (jsonNext.length == 0){
				moreData = false;
			} else {
				moreData = true;
			}

			console.log("Received " + oilEnergy.length + "oil coal consumption.");
		}
		else {
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
				getOilEnergy();
			});
		};
	}



	async function deleteOilEnergy(country, year) {
		console.log("Deleting oil coal consumption...");
		const res = await fetch("/api/v1/oil-coal-nuclear-energy-consumption-stats" + "/" + country + "/" + year, {
			method: "DELETE"
		}).then(function (res) {
			getOilEnergy();
		});
	}

	async function deleteOilEnergys() {
		console.log("Deleting oil coal consumptions...");
		const res = await fetch("/api/v1/oil-coal-nuclear-energy-consumption-stats", {
			method: "DELETE"
		}).then(function (res) {
			getOilEnergy();
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
			console.log("ERROR!");
		}
	}

	async function addOffset(increment) {
		offset += increment;
		currentPage += increment;
		getOilEnergy();
	}







</script>



<main>

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
					<td><Button outline color= "primary" on:click= {insertOilEnergy}> <i class="far fa-edit"></i> Insertar</Button></td>
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
						<td><Button outline color= "danger" on:click = "{deleteOilEnergy(oilEnergy.country,oilEnergy.year)}"> <i class="fa fa-trash" aria-hidden="true"></i> Borrar</Button></td>
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