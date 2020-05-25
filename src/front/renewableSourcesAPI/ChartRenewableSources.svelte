<script>
    import Button from "sveltestrap/src/Button.svelte";
    import {
        pop
    } from "svelte-spa-router";
    
    async function loadGraph() {
            
        /* Asking for the data to the back */
        const BASE_API_URL = "/api/v2/renewable-sources-stats";

        const resData = await fetch(BASE_API_URL);
        let MyData = await resData.json();   

        /* Getting the countries */
        let countries = Array.from(new Set(MyData.map((d) => {return d.country;})));
        /* Mapping the data in the right format */
        /* The country must be an index of the array of countries */
        /*  
        Turning this:

        {
            "country": "Country",
            "year": 2000,
            "percentage-re-total": 0.0,
            "percentage-hydropower-total": 0.0,
            "percentage-wind-power-total": 0.0
        }

        into this:

        [0, 2000, 0.0, 0.0, 0.0]
        The first 0 is the index of "Country" in the array of countries
        
        */
        MyData = MyData.map((d) => {
            return [countries.indexOf(d.country), d.year, d["percentage-re-total"], d["percentage-hydropower-total"], d["percentage-wind-power-total"]]; 
        });


        
        /* 
        The following array turn this:
        [0, 2000, 0.0, 0.0, 0.0]

        into this:

        {name: "Country", data: [0, 2000, 0.0, 0.0, 0.0]}
        That is how the chart needs it
         */
        let ChartData = MyData.map(function (set, i) {
            return {
                name: countries[set[0]],
                data: set,
                shadow: false
            };
        });
        
        /* Setting the chart */
        Highcharts.chart('container', {
            chart: {
                type: 'spline',
                parallelCoordinates: true,
                parallelAxes: {
                    lineWidth: 3
                }
            },
            title: {
                text: 'Energías renovables'
            },
            plotOptions: {
                series: {
                    animation: false,
                    marker: {
                        enabled: false,
                        states: {
                            hover: {
                                enabled: false
                            }
                        }
                    },
                    states: {
                        hover: {
                            halo: {
                                size: 0
                            }
                        }
                    },
                    events: {
                        mouseOver: function () {
                            this.group.toFront();
                        }
                    }
                }
            },
            tooltip: {
                pointFormat: '<span style="color:{point.color}">\u25CF</span>' +
                    '{series.name}: <b>{point.formattedValue}</b><br/>'
            },
            xAxis: {
                categories: [
                    'País',
                    'Año',
                    'Porcentaje de uso de energías renovables',
                    'Porcentaje de uso de energías hidroeléctricas',
                    'Porcentaje de uso de energías eólica'
                ],
                offset: 10
            },
            yAxis: [
            {
                categories: countries,
                tooltipValueFormat: '{value}'
            },
            {
                min: 2000,
                tooltipValueFormat: '{value}'
            }, {
                min: 0,
                tooltipValueFormat: '{value} %'
            }, {
                min: 0,
                tooltipValueFormat: '{value} %'
            }],
            colors: ['rgba(129, 131, 202, 0.8)'],
            series: ChartData
        });
    }

    loadGraph();
</script>

<svelte:head>

    
</svelte:head>

<main>
    
    <figure class="highcharts-figure">
        <div id="container"></div>
        <p class="highcharts-description">
            Gráfica que representa los datos de las energías renovables por países.
        </p>
    </figure>

    <p></p>
    <Button outline color="secondary" on:click="{pop}"> <i class="fas fa-arrow-circle-left"></i> Atrás </Button>
</main>