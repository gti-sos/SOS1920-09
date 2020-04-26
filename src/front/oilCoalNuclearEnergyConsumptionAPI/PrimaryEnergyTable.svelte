<script>
	import { onMount } from "svelte";
	import Table from "sveltestrap/src/Table.svelte";
	import Button from "sveltestrap/src/Button.svelte";
	import Input from "sveltestrap/src/Input.svelte";
	import Label from "sveltestrap/src/Label.svelte";
	import FormGroup from "sveltestrap/src/FormGroup.svelte";

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
	let currentCountry= "-";
	let currentYear= "-";



	onMount(getOilEnergy);

	async function getOilEnergy() {

		console.log("Fetching oil coal consumption...");
		const res = await fetch("/api/v1/oil-coal-nuclear-energy-consumption-stats");
		if (res.ok) {
			console.log("OK:");
			const json = await res.json();
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
			years = Array.from(new Set(years));

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


	async function searchYears(country){
        console.log("Searching years in country...");
		const res = await fetch("/api/v1/oil-coal-nuclear-energy-consumption-stats/" + country)
		
		if (res.ok){
            const json = await res.json();
			oilEnergy = json;
			
			oilEnergy.map((d)=>{
			return d.year;
			});

			console.log("Update years")
		}else {
			console.log("ERROR!")
		}
		
	
	
       
    }

	async function search(country, year){
        console.log("Searching data: " + country + "and " + year);
		/* Checking if it fields is empty */
		var url = "/api/v1/oil-coal-nuclear-energy-consumption-stats";

		if(country != "-" && year != "-") {
			url = url + "?country=" + country+ "&year=" + year;
		}else if(country != "-" && year == "-"){
			url = url + "?country=" + country;
		} else if(country == "-" && year != "-"){
			url = url + "?year=" + year;
		} 
		
		const res = await fetch(url);

        if (res.ok){
            console.log("OK:");
            const json = await res.json();
            oilEnergy = json;
            
            console.log("Found " + oilEnergy.length+"Oil Coal Energy.");
        }else{
            console.log("ERROR!");
        }
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

		<Button outline color="secondary" on:click="{search(currentCountry, currentYear)}">Buscar</Button>
		
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
					<td><Input required placeholder="Ej. 2020" bind:value = "{newOilEnergy.year}" /></td>
					<td><Input required type="number" step="0.01" min="0" bind:value = "{newOilEnergy['oil-consumption']}" /></td>
					<td><Input type="number" placeholder="0.0" step="0.01" min="0" bind:value = "{newOilEnergy['coal-consumption']}" /></td>
					<td><Input type="number" placeholder="0.0" step="0.01" min="0" bind:value = "{newOilEnergy['nuclear-energy-consumption']}" /></td>
					<td><Button outline color= "primary" on:click= {insertOilEnergy}>Insertar</Button></td>
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
						<td><Button outline color= "danger" on:click = "{deleteOilEnergy(oilEnergy.country,oilEnergy.year)}">Borrar</Button></td>
					</tr>
				{/each}
				<tr>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
				</tr>
			</tbody>
		</Table>
	{/await}
	<Button outline color="secondary" on:click="{pop}">Atrás</Button>
	<Button outline color= "danger" on:click = {deleteOilEnergys}>Borrar todo</Button>

</main>