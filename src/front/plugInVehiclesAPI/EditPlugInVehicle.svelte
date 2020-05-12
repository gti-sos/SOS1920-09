<script>
    import {
        onMount
    } from "svelte";

    import {
        pop
    } from "svelte-spa-router";

    import Input from "sveltestrap/src/Input.svelte";
    import Table from "sveltestrap/src/Table.svelte";
    import Button from "sveltestrap/src/Button.svelte";

    const BASE_API_URL = "/api/v2/plugin-vehicles-stats";

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
        const res = await fetch(BASE_API_URL + "/" + params.country + "/" + params.year);

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

        const res = await fetch(BASE_API_URL + "/" + params.country + "/" + params.year, {
            method: "PUT",
            body: JSON.stringify({
                country: params.country,
                year: parseInt(params.year),
                "pev-stock": updatedPevStock,
			    "annual-sale": updatedAnnualSale,
			    "cars-per-1000": updatedCarsPerPeople
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (res) {
            if(res.ok){
                updateAlert();
                getPluginVehicles();
            }
            else if(res.status == 404){
                errorAlert("Se ha intentado borrar un elemento inexistente");
            }
            else{
                errorAlert("");
            }
        });

    }

    function errorAlert(error){
		clearAlert();
		var alert_element = document.getElementById("div_alert");
		alert_element.style = "position: fixed; top: 0px; top: 1%; width: 90%;";
		alert_element.className = " alert alert dismissible in alert-danger ";
		alert_element.innerHTML = "<strong>¡ERROR!</strong> ¡Ha ocurrido un error! " + error;

		setTimeout(() => {
			clearAlert();
		}, 3000);
    }

    function updateAlert(){
		clearAlert();
		var alert_element = document.getElementById("div_alert");
		alert_element.style = "position: fixed; top: 0px; top: 1%; width: 90%;";
		alert_element.className = " alert alert dismissible in alert-info ";
		alert_element.innerHTML = "<strong>¡Dato actualizado!</strong> El dato ha sido actualizado correctamente!";

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
    <!-- This div is for the alerts -->
	<div role="alert" id="div_alert" style="display: none;">
	</div>
    <h2  style="text-align: center;"><small> Editar dato de coche eléctrico: </small></h2>
    <h2  style="text-align: center; margin-bottom: 2%;"><small><strong>{params.country}</strong> - <strong>{params.year}</strong></small></h2>

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
                    <td><Input type="number" bind:value="{updatedPevStock}"/></td>
                    <td><Input type="number" bind:value="{updatedAnnualSale}"/></td>
                    <td><Input type="number" bind:value="{updatedCarsPerPeople}"/></td>
                    <td> <Button outline color="primary" on:click={updatedPluginVehicles}> <i class="fas fa-pencil-alt"></i> Actualizar</Button> </td>
                </tr>
        </tbody>
        </Table>
    {/await}
    <Button outline color="secondary" on:click="{pop}"><i class="fas fa-arrow-circle-left"></i> Atrás</Button>
</main>