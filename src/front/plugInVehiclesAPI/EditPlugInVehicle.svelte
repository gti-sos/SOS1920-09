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
    let pluginVehicles = {};
    let updatedCountry = "";
    let updatedYear = 0;
    let updatedPevStock = 0;
    let updatedAnnualSale = 0;
    let updatedCarsPerPeople = 0.0;

    onMount(getPluginVehicles);

    async function getPluginVehicles() {

        console.log("Fetching plugin vehicle...");
        const res = await fetch("/api/v1/plugin-vehicles-stats/" + params.country + "/" + params.year);

        if (res.ok) {

            console.log("Ok:");
            const json = await res.json();
            pluginVehicles = json;
            updatedCountry = pluginVehicles.country;
            updatedYear = pluginVehicles.year;
            updatedPevStock = pluginVehicles["pev-stock"];
            updatedAnnualSale = pluginVehicles["annual-sale"];
            updatedCarsPerPeople = pluginVehicles["cars-per-1000"];
            console.log("Received plugin vehicle.");
        } else {
            console.log("ERROR!");
        }
    }


    async function updatedPluginVehicles() {

        console.log("Updating plugin vehicles...");

        const res = await fetch("/api/v1/plugin-vehicles-stats/" + params.country + "/" + params.year, {
            method: "PUT",
            body: JSON.stringify({
                country: params.country,
                year: params.year,
                "pev-stock": updatedPevStock,
			    "annual-sale": updatedAnnualSale,
			    "cars-per-1000": updatedCarsPerPeople
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (res) {
            getPluginVehicles();
        });

    }

</script>
<main>
    <h3>Editar Dato de coche eléctrico:  <strong>{params.country}</strong> <strong>{params.year}</strong></h3>
    {#await pluginVehicles}
        Loading pluginVehicles...
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
                    <td>{updatedCountry}</td>
                    <td>{updatedYear}</td>
                    <td><input type="number" bind:value="{updatedPevStock}"></td>
                    <td><input type="number" bind:value="{updatedAnnualSale}"></td>
                    <td><input type="number" bind:value="{updatedCarsPerPeople}"></td>
                    <td> <Button outline  color="primary" on:click={updatedPluginVehicles}>Actualizar</Button> </td>
                </tr>
        </tbody>
        </Table>
    {/await}
    <Button outline color="secondary" on:click="{pop}">Atrás</Button>
</main>