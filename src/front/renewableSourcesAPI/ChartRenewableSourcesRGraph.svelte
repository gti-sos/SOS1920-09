<script>
    import Button from "sveltestrap/src/Button.svelte";
    import {
        pop
    } from "svelte-spa-router";

    

    async function loadGraph () {

        const BASE_API_URL = "/api/v2/renewable-sources-stats";

        const resData = await fetch(BASE_API_URL);
        let MyData = await resData.json();   

        /* Getting the countries */
        let countries = Array.from(new Set(MyData.filter(d => d.year == 2016).map((d) => {return d.country;})));

        let percentageRenewable = Array.from(new Set(MyData.filter(d => d.year == 2016).map((d) => {return d["percentage-re-total"];})));

        let labels = countries;

        // Create the Pie chart, set the donut variant and the rest of the
        // configuration. The variant property is what sets the chart to
        // be a Donut chart instead of a regular Pie chart.
        new RGraph.Pie({
            id: 'cvs',
            data: percentageRenewable,
            options: {
                shadow: true,
                shadowOffsetx: 0,
                shadowOffsety: 5,
                shadowColor: '#aaa',
                variant: 'donut3d',
                labels: labels,
                labelsSticksLength: 15,
                labelsSticksLinewidth: 2,
                textAccessible: false,
                colorsStroke: 'transparent'
            }
        }).draw().responsive([
            {maxWidth: 1200,width:1000,height:400,options:{radius: 90,labels: null,title: '(Click for labels)',tooltips:labels}},
            {maxWidth: null,width:1000,height:600,options:{radius: 100,labelsList: true, labels:labels,title:'',tooltips:null}}
        ]);
        
        
    }
    
</script>

<svelte:head>
    <script src="libraries/RGraph.common.core.js" on:load={loadGraph} ></script>
    <script src="libraries/RGraph.pie.js" on:load={loadGraph} ></script>
</svelte:head>

<main>
    

    <canvas id="cvs">
        [No canvas support]
    </canvas>
    <p></p>
    <p>Gráfica hecha con RGraph que representa el porcentaje de energía renovables por países de 2016.</p>
    <Button outline color="secondary" on:click="{pop}"> <i class="fas fa-arrow-circle-left"></i> Atrás </Button>
</main>