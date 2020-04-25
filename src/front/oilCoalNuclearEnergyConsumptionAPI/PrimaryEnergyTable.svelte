<script>

import {onMount} from "svelte";

import Table from "sveltestrap/src/Table.svelte";
import Button from "sveltestrap/src/Button.svelte";

let OilEnergy = [];
let newOilEnergy = {
	"country": "",
	"year" : 0,
	"oil-consumption": 0,
	"coal-consumption": 0,
	"nuclear-energy-consumption":0
};

onMount(getOilEnergy);


async function getOilEnergy(){
	
	console.log("Fetching oil coal consumption...");
	const res = await fetch("/api/v1/oil-coal-nuclear-energy-consumption-stats");


	if (res.ok){
		console.log("OK:");
		const json = await res.json();
		OilEnergy = json;
		console.log("Received " + OilEnergy.length +  "oil coal consumption.");
	} 
	
	else {
		console.log("ERROR!");
	}
}

async function insertOilEnergy(){

	console.log("Inserting oil coal consumption...");
	const res = await fetch("/api/v1/oil-coal-nuclear-energy-consumption-stats", {
		method: "POST",
		body: JSON.stringify(newOilEnergy),
		headers: {
			"Content-Type": "application/json"
		}
	});
}

</script>


<main>

	{#await OilEnergy}
		Loading OilEnergy...
	{:then OilEnergys}
		<Table bordered>
			<thead>
				<tr>
					<th>País</th>
					<th>Año</th>
					<th>Porcentaje de consumpo de Gasolina</th>
					<th>Porcentaje de consumpo de Carbón</th>
					<th>Porcentaje de consumpo de Energía Nuclear</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><input bind:value = "{newOilEnergy.country}"></td>
					<td><input bind:value = "{newOilEnergy.year}"></td>
					<td><input bind:value = "{newOilEnergy['oil-consumption']}"></td>
					<td><input bind:value = "{newOilEnergy['coal-consumption']}"></td>
					<td><input bind:value = "{newOilEnergy['nuclear-energy-consumption']}"></td>
					<td><Button outline color= "primary" on:click= {insertOilEnergy}>Insertar</Button></td>
				</tr>

				{#each OilEnergys as OilEnergy}
					<tr>
						<td>{newOilEnergy.country}</td>
						<td>{newOilEnergy.year}</td>
						<td>{newOilEnergy['oil-consumption']}</td>
						<td>{newOilEnergy['coal-consumption']}</td>
						<td>{newOilEnergy['nuclear-energy-consumption']}</td>
						<td><Button outline color= "danger">Borrar</Button></td>
					</tr>
				{/each}
			</tbody>
		</Table>
	{/await}


</main>