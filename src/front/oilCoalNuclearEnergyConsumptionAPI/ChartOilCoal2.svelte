<!-- <script>
    import Button from "sveltestrap/src/Button.svelte";
    import {
        pop
    } from "svelte-spa-router";

    

    async function loadGraph () {

        const BASE_API_URL = "/api/v2/oil-coal-nuclear-energy-consumption-stats";

        const resData = await fetch(BASE_API_URL);
        let MyData = await resData.json();   

        
        let countries = Array.from(new Set(MyData.filter(d => d.year == 2016).map((d) => {return d.country;})));
        let labels = countries;
        oilconsumption = Array.from(new Set(Data.map((d) => {return d["oil-consumption"];})));;
     
        new Chartist.Bar('.ct-chart', {
        labels: labels,
        series: oilconsumption
        },
         {
            distributeSeries: true
        });
    
    }
 
</script>

<svelte:head>
    <script src="bower_components/chartist/dist/chartist.min.js" on:load={loadGraph}></script>
    <link rel="stylesheet"
    href="bower_components/chartist/dist/chartist.min.css">
</svelte:head>

<main>
    <p>Gráfica por países del consumo de gasolina en 2016</p>
    <Button outline color="secondary" on:click="{pop}"> <i class="fas fa-arrow-circle-left"></i> Atrás </Button>
</main>
-->