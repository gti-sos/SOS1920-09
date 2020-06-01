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

    const BASE_API_URL = "/api/v3/oil-coal-nuclear-energy-consumption-stats";

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
        const res = await fetch(BASE_API_URL + "/" + params.country + "/" + params.year);

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

        const res = await fetch(BASE_API_URL  + "/" + params.country + "/" + params.year, {
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
            if (res.ok) {
                getOilCoal();
                updateAlert();
            } else if (res.status == 404){
                errorAlert=("Se ha intentado borrar un elemento inexistente.");
            }else {
                errorAlert=("");
            }
           
        });
    }

    
	function errorAlert(error){
		clearAlert();
		var alert_element = document.getElementById("div_alert");
		alert_element.style = "position: fixed; top: 0px; top: 1%; width: 90%;";
		alert_element.className = " alert alert dismissible in alert-danger ";
		alert_element.innerHTML = "<strong>¡ERROR!</strong> ¡Ha ocurrido un error!" + error;

		setTimeout(() => {
			clearAlert();
		}, 3000);
	}


    function updateAlert(){
		clearAlert();
		var alert_element = document.getElementById("div_alert");
		alert_element.style = "position: fixed; top: 0px; top: 1%; width: 90%;";
		alert_element.className = " alert alert dismissible in alert-info ";
		alert_element.innerHTML = "<strong>¡Datos actualizado!</strong> El dato se ha actualizado correctamente!";

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
    <div role ="alert" id ="div_alert" style = "display: none;">
	</div>
    <h2  style="text-align: center;"><small> Editar datos Energías primarias: </small></h2>
    <h2  style="text-align: center; margin-bottom: 2%;"><small><strong>{params.country}</strong> - <strong>{params.year}</strong></small></h2>
    {#await oilCoal}
        Loading oilCoal...
    {:then oilCoal}
        <Table bordered>
            <thead>
				<tr>
					<th>País</th>
					<th>Año</th>
					<th>Consumo de Gasolina</th>
					<th>Consumo de Carbón</th>
                    <th>Consumo de Energía Nuclear</th>
                    <th> Acciones </th>
				</tr>
			</thead>
            <tbody>
                <tr>
                    <td>{updatedCountry}</td>
                    <td>{updatedYear}</td>
                    <td><Input type="number" bind:value="{updatedOilConsumption}"/></td>
                    <td><Input type="number" placeholder="0.0" step="0.01" min="0"  bind:value="{updatedCoalConsumption}"/></td>
                    <td><Input type="number" placeholder="0.0" step="0.01" min="0"  bind:value="{updatedNuclearEnergyConsumption}"/></td>
                    <td> <Button outline  color="primary" on:click={updateOilCoal}> <i class="fas fa-pencil-alt"></i> Actualizar</Button> </td>
                </tr>
        </tbody>
        </Table>
    {/await}
    <Button outline color="secondary" on:click="{pop}"><i class="fas fa-arrow-circle-left"></i> Atrás</Button>
</main>