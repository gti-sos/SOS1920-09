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
        const res = await fetch("/api/v1/oil-coal-nuclear-energy-consumption-stats/" + params.country + "/" + paramas.year);

        if (res.ok) {
            console.log("Ok:");
            const json = await res.json();
            contact = json;
            updatedCountry = oilCoal.country;
            updatedYear = oilCoal.year;
            updatedOilConsumption = oilCoal["oil-consumption"];
            updatedCoalConsumption = oilCoal["coal-consumption"];
            updateupdatedNuclearEnergyConsumption = oilCoal["nuclear-energy-consumption"];
            console.log("Received contact.");
        } else {
            console.log("ERROR!" + errorMsg);
        }
    }


    async function updateOilCoal() {

        console.log("Updating Oil Coal...");

        const res = await fetch("/api/v1//oil-coal-nuclear-energy-consumption-stats//" + params.country + "/" + paramas.year, {
            method: "PUT",
            body: JSON.stringify({
                updatedCountry: params.country,
                updatedYear: params.year,
                "oil-consumption" : updatedOilConsumption,
                "coal-consumption" : updatedCoalConsumption,
                "nuclear-energy-consumption": updateupdatedNuclearEnergyConsumption

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
					<th>Porcentaje de consumpo de Gasolina</th>
					<th>Porcentaje de consumpo de Carbón</th>
					<th>Porcentaje de consumpo de Energía Nuclear</th>
				</tr>
			</thead>
            <tbody>
                <tr>
                    <td>{updatedCountry}</td>
                    <td>{updatedYear}</td>
                    <td><input bind:value="{updatedOilConsumption}"></td>
                    <td><input bind:value="{updatedCoalConsumption}"></td>
                    <td><input bind:value="{updateupdatedNuclearEnergyConsumption}"></td>
                    
                    <td> <Button outline  color="primary" on:click={updateOilCoal}>Actualizar</Button> </td>
                </tr>
        </tbody>
        </Table>
    {/await}
    <Button outline color="secondary" on:click="{pop}">Atrás</Button>
</main>