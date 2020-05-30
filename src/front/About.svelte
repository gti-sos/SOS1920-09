<script>
	import Button from "sveltestrap/src/Button.svelte";
    import {
        pop
    } from "svelte-spa-router";
	
</script>


<main>

    <h2> Vídeos explicativos </h2>
    <div class="card-deck">
        <div class="card">
            <div class="embed-responsive embed-responsive-16by9 video">
                <iframe title="Vídeo 1" class="embed-responsive-item video" src="https://www.youtube.com/embed/zpOULjyy-n8?rel=0" allowfullscreen></iframe>
            </div>
          <div class="card-body">
            <h5 class="card-title">Energías renovables</h5>
            <p class="card-text">Vídeo explicativo que recorre las funcionalidades de la web centrado en la API de energías renovables.</p>
          </div>
        </div>

        <div class="card">
            <div class="embed-responsive embed-responsive-16by9 video">
                <iframe title="Vídeo 2" class="embed-responsive-item video" src="https://www.youtube.com/embed/zpOULjyy-n8?rel=0" allowfullscreen></iframe>
            </div>
          <div class="card-body">
            <h5 class="card-title">Energías primarias</h5>
            <p class="card-text">Vídeo explicativo que recorre las funcionalidades de la web centrado en la API de energías primarias.</p>
          </div>
        </div>

        <div class="card">
            <div class="embed-responsive embed-responsive-16by9 video">
                <iframe title="Vídeo 3" class="embed-responsive-item video" src="https://www.youtube.com/embed/zpOULjyy-n8?rel=0" allowfullscreen></iframe>
            </div>
          <div class="card-body">
            <h5 class="card-title">Coches eléctricos</h5>
            <p class="card-text">Vídeo explicativo que recorre las funcionalidades de la web centrado en la API de coches eléctricos.</p>
          </div>
        </div>
    </div>
    
    
    
    

    <p></p>
	<Button outline color="secondary" on:click="{pop}"><i class="fas fa-arrow-circle-left"></i> Atrás</Button>

</main>