<script>
	import Button from "sveltestrap/src/Button.svelte";
    import {
        pop
    } from "svelte-spa-router";
	
</script>


<main>

    <h1 class="display-4" style="text-align: center;" > Integraciones </h1>
    <div class="card-deck div-center">
        <div class="card border-dark mb-3" style="max-width: 18rem; display: inline-block;">
            <div class="card-header"><a class="btn btn-outline-dark"  role="button" href="#/integrationsPluginCars">Coches eléctricos</a> </div>
            <div class="card-body text-dark">
              <h5 class="card-title">Coches eléctricos</h5>
              <p class="card-text">Integraciones con la API de coches eléctricos.</p>
            </div>
          </div>


          <div class="card border-dark mb-3" style="max-width: 18rem; display: inline-block;">
            <div class="card-header"><a class="btn btn-outline-dark" role="button" href="#/integrationsRenewableSource">Energías renovables</a></div>
            <div class="card-body text-dark">
              <h5 class="card-title">Energías renovables</h5>
              <p class="card-text">Integraciones con la API de energías renovables.</p>
            </div>
          </div>

          <div class="card border-dark mb-3" style="max-width: 18rem; display: inline-block;">
            <div class="card-header"><a  class="btn btn-outline-dark" role="button" href="#/integrationsPrimaryEnergies">Energías primarias</a></div>
            <div class="card-body text-dark">
              <h5 class="card-title">Energías primarias</h5>
              <p class="card-text">Integraciones con la API de energías primarias.</p>
            </div>
          </div>
    </div>

    <p></p>
	
	<Button outline color="secondary" on:click="{pop}"><i class="fas fa-arrow-circle-left"></i> Atrás</Button>

</main>