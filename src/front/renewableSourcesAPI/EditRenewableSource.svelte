<script>
    import {
        onMount
    } from "svelte";

    import {
        pop
    } from "svelte-spa-router";


    import Table from "sveltestrap/src/Table.svelte";
    import Button from "sveltestrap/src/Button.svelte";
	import Input from "sveltestrap/src/Input.svelte";

    const BASE_API_URL = "/api/v2/renewable-sources-stats";

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
        const res = await fetch(BASE_API_URL + "/" + params.country + "/" + params.year);

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

        const res = await fetch(BASE_API_URL + "/" + params.country + "/" + params.year, {
            method: "PUT",
            body: JSON.stringify({
                country: params.country,
                year: parseInt(params.year),
                "percentage-re-total": updatedPercentageRe,
                "percentage-hydropower-total": updatedPercentageHydro,
                "percentage-wind-power-total": updatedPercentageWind
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (res) {
            if (res.ok) {
                getRenewableSource();
                updateAlert();
			} else if (res.status == 404) {
				errorAlert("Se ha intentado borrar un elemento inexistente.");
			} else {
				errorAlert("");
			}
        });
    }

    function errorAlert(error) {
		clearAlert();
		var alert_element = document.getElementById("div_alert");
		alert_element.style = "position: fixed; top: 0px; top: 1%; width: 90%;";
		alert_element.className = "alert alert-dismissible in alert-danger ";
		alert_element.innerHTML = "<strong>¡ERROR!</strong> ¡Ha ocurrido un error! " + error;
		
		setTimeout(() => {
			clearAlert();
		}, 3000);
    }
    
    function updateAlert() {
		clearAlert();
		var alert_element = document.getElementById("div_alert");
		alert_element.style = "position: fixed; top: 0px; top: 1%; width: 90%;";
		alert_element.className = "alert alert-dismissible in alert-info ";
		alert_element.innerHTML = "<strong>¡Dato actualizado!</strong> El dato ha sido actualizado correctamente";
		
		setTimeout(() => {
			clearAlert();
		}, 3000);
    }
    
    function clearAlert () {
		var alert_element = document.getElementById("div_alert");
		alert_element.style = "display: none; ";
		alert_element.className = "alert alert-dismissible in";
		alert_element.innerHTML = "";
	}
</script>
<main>
    <!-- This div is for the alerts -->
	<div role="alert" id="div_alert" style="display: none;">
	</div>
    <h2  style="text-align: center;"><small> Editar dato de energía renovable: </small></h2>
    <h2  style="text-align: center; margin-bottom: 2%;"><small><strong>{params.country}</strong> - <strong>{params.year}</strong></small></h2>
    
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
                    <td> <Input type="number" bind:value="{updatedPercentageRe}"/> </td>
                    <td> <Input type="number" placeholder="0.0" step="0.01" min="0" bind:value="{updatedPercentageHydro}"/> </td>
                    <td> <Input type="number" placeholder="0.0" step="0.01" min="0" bind:value="{updatedPercentageWind}"/> </td>
                    <td> <Button outline color="primary" on:click={updateRenewableSource} > <i class="fas fa-pencil-alt"></i> Actualizar </Button> </td>
                </tr>
        </tbody>
        </Table>
    {/await}

    <Button outline color="secondary" on:click="{pop}"> <i class="fas fa-arrow-circle-left"></i> Atrás </Button>
</main>