<script>
	import Button from "sveltestrap/src/Button.svelte";
    import {
        pop
    } from "svelte-spa-router";
	
</script>


<main>

    <h2> Integraciones </h2>

    <a class="btn btn-primary"  role="button" href="#/integrationsPluginCars">Coches eléctricos</a>
    <p></p>
    <a class="btn btn-primary" role="button" href="#/integrationsRenewableSource">Energías renovables</a>
    <p></p>
    <a  class="btn btn-primary" role="button" href="#/integrationsPrimaryEnergies">Energías primarias</a>
    <p></p>
	
	<Button outline color="secondary" on:click="{pop}"><i class="fas fa-arrow-circle-left"></i> Atrás</Button>

</main>