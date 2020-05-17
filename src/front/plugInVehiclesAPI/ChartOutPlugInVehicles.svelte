<script>

    import {
            pop
    } from "svelte-spa-router";
    
    import Button from "sveltestrap/src/Button.svelte";

</script>


<main>
    
    <Button outline color="secondary" on:click="{pop}"><i class="fas fa-arrow-circle-left"></i> Atrás</Button>

</main>