<script>
    import Button from "sveltestrap/src/Button.svelte";
    import {
        pop
    } from "svelte-spa-router";


    async function loadGraph () {
        const BASE_API_URL = "/api/v2/renewable-sources-stats";

        const resData = await fetch(BASE_API_URL);
        let MyData = await resData.json();   



        let datachart = MyData.filter(d => d.year == 2016).map((d) => {return [d.country, d["percentage-re-total"]];})

        var chart = bb.generate({
            data: {
                columns: [],
                type: "gauge",
                onclick: function(d, i) {
                console.log("onclick", d, i);
            },
            },
            gauge: {},
            color: {
                pattern: [
                "#FF0000",
                "#F97600",
                "#F6C600",
                "#60B044"
                ],
                threshold: {
                values: [
                    30,
                    60,
                    90,
                    100
                ]
                }
            },
            size: {
                height: 180
            },
            bindto: "#gaugeChart"
        });

        /* Recursive function because settimeout doesnt work properly in loop  */
        function loop_charting (i) {

            setTimeout(function() {
                chart.load({
                    columns: [datachart[i]]
                });
                if (i < datachart.length) {
                    loop_charting (i + 1);
                }
            }, 1000);

            
        }

        loop_charting(0);

    }
    
    loadGraph();
    
    
    
</script>

<svelte:head>


   
</svelte:head>

<main>
    

    <div id="gaugeChart"></div>

    <p></p>
    <p>Gráfica utilizando billboard.js que representa el porcentaje de energía renovables por países de 2016.</p>
    <Button outline color="secondary" on:click="{pop}"> <i class="fas fa-arrow-circle-left"></i> Atrás </Button>
</main>