<script>
import {onMount} from "svelte";
import Table from "sveltestrap/src/Table.svelte";
import Button from "sveltestrap/src/Button.svelte";
let oilEnergy = [];
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
		oilEnergy = json;
		console.log("Received " + oilEnergy.length +  "oil coal consumption.");
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
	}).then(function(res) {
		getOilEnergy(); 
	}); 
}
async function deleteOilEnergy(country,year){
console.log("Deleting oil coal consumption...");
const res = await fetch("/api/v1/oil-coal-nuclear-energy-consumption-stats" + "/" + country + "/" + year, {
	method: "DELETE"
}).then(function(res) {
		getOilEnergy(); 
	}); 
}
</script>


<main>

	{#await oilEnergy}
		Loading oilEnergy...
	{:then oilEnergys}
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
					<td><input type="number" bind:value = "{newOilEnergy.year}"></td>
					<td><input type="number" placeholder="0.0" step="0.01" min="0" bind:value = "{newOilEnergy['oil-consumption']}"></td>
					<td><input type="number" placeholder="0.0" step="0.01" min="0" bind:value = "{newOilEnergy['coal-consumption']}"></td>
					<td><input type="number" placeholder="0.0" step="0.01" min="0" bind:value = "{newOilEnergy['nuclear-energy-consumption']}"></td>
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
			</tbody>
		</Table>
	{/await}


</main>