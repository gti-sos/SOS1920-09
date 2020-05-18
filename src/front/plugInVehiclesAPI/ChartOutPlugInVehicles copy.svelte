<script>

    import {
            pop
    } from "svelte-spa-router";
    
    import Button from "sveltestrap/src/Button.svelte";

    async function loadGraph () {

        const BASE_API_URL = "/api/v2/plugin-vehicles-stats";
        let MyData = [];

        const resData = await fetch(BASE_API_URL);
        MyData = await resData.json();
       
        let countries = [];
        let pevStock = [];
        let annualSale = [];
        let carsPer1000 = [];

        MyData.forEach((data) => {
            let country = data.country;
            let year = data.year;
            let p = data["pev-stock"];
            let a = data["annual-sale"];
            let c = data["cars-per-1000"];
            
            if (data.year == 2018) {
                countries.push(country);
                pevStock.push(p);
                annualSale.push(a);
                carsPer1000.push(c);
            }
        });

        new RGraph.SVG.Line({
            id: 'chart-container',
            data: carsPer1000,
            options: {
                backgroundColor: '#eee',
                backgroundGridColor: 'blue',
                backgroundGridVlinesCount: 20,
                backgroundGridLinewidth: 1,
                colors: ['black'],
                tickmarksStyle: 'filledcircle',
                xaxis: true,
                yaxis: true,
                yaxisScaleUnitsPost: '%',
                textSize: 9,
                xaxisLabels: countries
            }
        
        // Use the trace() animation to show the chart and add some responsive capability
        }).trace().responsive([
            {maxWidth: 900, width:450,height:200,options:{linewidth: 2,tickmarksSize: 5}},
            {maxWidth: null,width:600,height:250,options:{linewidth: 3,tickmarksSize: 6}}
        ]);
    
    }

</script>

<svelte:head>

    <script src="libraries/RGraph.svg.common.core.js" on:load={loadGraph}></script>
    <script src="libraries/RGraph.svg.line.js" on:load={loadGraph}></script>


</svelte:head>

<main>

    <div style="width: 750px; height: 250px" id="chart-container"></div>
    <p></p>
    <p>Representación gráfica realizada con RGraph que nos muestra el porcentaje de coches electricos en el año 2018</p>
    <Button outline color="secondary" on:click="{pop}"><i class="fas fa-arrow-circle-left"></i> Atrás</Button>

</main>