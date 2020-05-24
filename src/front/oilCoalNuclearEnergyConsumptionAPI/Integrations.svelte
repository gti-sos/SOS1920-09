<script>
    import Button from "sveltestrap/src/Button.svelte";
    import {
        pop
    } from "svelte-spa-router";

</script>

<main>
    <button type="button"  class="btn btn-outline-dark" onclick="window.location.href='#/'"><i class="fas fa-chart-area"></i> 1</button>

    <Button outline color="secondary" on:click="{pop}"> <i class="fas fa-arrow-circle-left"></i> Atrás </Button>
</main>