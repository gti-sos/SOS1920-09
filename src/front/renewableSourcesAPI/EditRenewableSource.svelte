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
    let renewableSource = {};
    let updatedCountry = "";
    let updatedYear = 0;
    let updatedPercentageRe = 0.0;
    let updatedPercentageHydro = 0.0;
    let updatedPercentageWind = 0.0;

    onMount(getRenewableSource);

    async function getRenewableSource() {

        console.log("Fetching renewable source...");
        const res = await fetch("/api/v1/renewable-sources-stats/" + params.country + "/" + params.year);

        if (res.ok) {
            console.log("Ok:");
            const json = await res.json();
            renewableSource = json;
            updatedCountry = renewableSource.year;
            updatedYear = renewableSource.country;
            updatedPercentageRe = renewableSource["percentage-re-total"];
            updatedPercentageHydro = renewableSource["percentage-hydropower-total"];
            updatedPercentageWind = renewableSource["percentage-wind-power-total"];

            console.log("Received contact.");
        } else {
            console.log("ERROR!");
        }
    }


    async function updateRenewableSource() {

        console.log("Updating renewable source...");

        const res = await fetch("/api/v1/renewable-sources-stats/" + params.country + "/" + params.year, {
            method: "PUT",
            body: JSON.stringify({
                country: params.country,
                year: params.year,
                "percentage-re-total": updatedPercentageRe,
                "percentage-hydropower-total": updatedPercentageHydro,
                "percentage-wind-power-total": updatedPercentageWind
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (res) {
            getRenewableSource();
        });
    }
</script>
<main>
    <h3>Editar dato de energía renovable: <strong>{params.country}</strong> <strong>{params.year} </strong></h3>
    {#await renewableSource}
        Loading renewableSource...
    {:then renewableSource}
        <Table bordered>
            <thead>
                <tr>
					<th> País </th>
					<th> Año </th>
					<th> Porcentaje de uso de energías renovables </th>
					<th> Porcentaje de uso de energías hidroeléctricas sobre el total </th>
					<th> Porcentaje de uso de energías eólica </th>
					<th> Acciones </th>
				</tr>
            </thead>
            <tbody>
                <tr>
                    <td> {updatedCountry} </td>
                    <td> {updatedYear} </td>
                    <td> <input type="number" bind:value="{updatedPercentageRe}"> </td>
                    <td> <input type="number" placeholder="0.0" step="0.01" min="0" bind:value="{updatedPercentageHydro}"> </td>
                    <td> <input type="number" placeholder="0.0" step="0.01" min="0" bind:value="{updatedPercentageWind}"> </td>
                    <td> <Button outline color="primary" on:click={updateRenewableSource}> Actualizar </Button> </td>
                </tr>
        </tbody>
        </Table>
    {/await}

    <Button outline color="secondary" on:click="{pop}"> Atrás </Button>
</main>