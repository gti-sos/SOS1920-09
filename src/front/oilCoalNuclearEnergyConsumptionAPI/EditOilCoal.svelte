<script>
    import {
        onMount
    } from "svelte";

    import {
        pop
    } from "svelte-spa-router";


    import Table from "sveltestrap/src/Table.svelte";
    import Button from "sveltestrap/src/Button.svelte";

    export let params = {};
    let oilCoal = {};
    let updatedCountry = "";
    let updatedYear = 0.0;
    let updatedOilConsumption = 0.0;
    let updatedCoalConsumption = 0.0;
    let updatedNuclearEnergyConsumption = 0.0;


    onMount(getOilCoal);

    async function getOilCoal() {

        console.log("Fetching oilCoal...");
        const res = await fetch("/api/v1/oil-coal-nuclear-energy-consumption-stats/" + params.country + "/" + params.year);

        if (res.ok) {
            console.log("Ok:");
            const json = await res.json();
            oilCoal = json;
            updatedCountry = oilCoal.country;
            updatedYear = oilCoal.year;
            updatedOilConsumption = oilCoal["oil-consumption"];
            updatedCoalConsumption = oilCoal["coal-consumption"];
            updatedNuclearEnergyConsumption = oilCoal["nuclear-energy-consumption"];
            console.log("Received contact.");
        } else {
            console.log("ERROR!");
        }
    }


    async function updateOilCoal() {

        console.log("Updating Oil Coal...");

        const res = await fetch("/api/v1/oil-coal-nuclear-energy-consumption-stats/" + params.country + "/" + params.year, {
            method: "PUT",
            body: JSON.stringify({
                country: params.country,
                year: parseInt(params.year),
                "oil-consumption": updatedOilConsumption,
                "coal-consumption": updatedCoalConsumption,
                "nuclear-energy-consumption": updatedNuclearEnergyConsumption

            }),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (res) {
            getOilCoal();
        });



    }
</script>
<main>
    <h3>Editar datos Energías primarias: <strong>{params.country}</strong> <strong>{params.year}</strong> </h3>
    {#await oilCoal}
        Loading oilCoal...
    {:then oilCoal}
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
                    <td>{updatedCountry}</td>
                    <td>{updatedYear}</td>
                    <td><input type="number" bind:value="{updatedOilConsumption}"></td>
                    <td><input type="number" placeholder="0.0" step="0.01" min="0"  bind:value="{updatedCoalConsumption}"></td>
                    <td><input type="number" placeholder="0.0" step="0.01" min="0"  bind:value="{updatedNuclearEnergyConsumption}"></td>
                    <td> <Button outline  color="primary" on:click={updateOilCoal}>Actualizar</Button> </td>
                </tr>
        </tbody>
        </Table>
    {/await}
    <Button outline color="secondary" on:click="{pop}">Atrás</Button>
</main>