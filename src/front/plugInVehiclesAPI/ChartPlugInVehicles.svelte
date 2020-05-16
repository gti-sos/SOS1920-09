<script>

    import {
            pop
	} from "svelte-spa-router";
    
    import Button from "sveltestrap/src/Button.svelte";

    async function loadGraph(){
    
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
         /*
        { 
			"country": "Japan",
			"year": 2018,
			"pev-stock": 257363,
			"annual-sale": 52013,
			"cars-per-1000": 2.0
		}
        
        */
        Highcharts.chart('container', {
            chart: {
                zoomType: 'xy'
            },
            title: {
                text: 'Gráfica sobre datos de coches eléctricos.',
                align: 'left'
            },
            subtitle: {
                text: 'Datos sobre el año 2018:',
                align: 'left'
            },
            xAxis: [{
                categories: countries,
                crosshair: true
            }],
            yAxis: [{ // Primary yAxis
                labels: {
                    format: '{value} %',
                    style: {
                        color: Highcharts.getOptions().colors[2]
                    }
                },
                title: {
                    text: 'Coches cada 1000 personas',
                    style: {
                        color: Highcharts.getOptions().colors[2]
                    }
                },
                opposite: true

            }, { // Secondary yAxis
                gridLineWidth: 0,
                title: {
                    text: 'Ventas Acumuladas',
                    style: {
                        color: Highcharts.getOptions().colors[0]
                    }
                    
                },
                labels: {
                    format: '{value} unidades',
                    style: {
                        color: Highcharts.getOptions().colors[0]
                    }
                }

            }, { // Tertiary yAxis
                gridLineWidth: 0,
                title: {
                    text: 'Ventas anuales',
                    style: {
                        color: Highcharts.getOptions().colors[1]
                    }
                },
                labels: {
                    format: '{value} unidades',
                    style: {
                        color: Highcharts.getOptions().colors[1]
                    }
                },
                opposite: true
            }],
            tooltip: {
                shared: true
            },
            legend: {
                align: 'left',
                verticalAlign: 'bottom',
                y: 25,
                floating: true,
                backgroundColor:
                    Highcharts.defaultOptions.legend.backgroundColor || // theme
                    'rgba(255,255,255,0.25)'
            },
            series: [{
                name: 'Ventas acumuladas',
                type: 'column',
                yAxis: 1,
                data: pevStock,
                tooltip: {
                    valueSuffix: ' unidades'
                },

            }, {
                name: 'Ventas anuales',
                type: 'spline',
                yAxis: 2,
                data: annualSale,
                marker: {
                    enabled: false
                },
                dashStyle: 'shortdot',
                tooltip: {
                    valueSuffix: ' unidades'
                }

            }, {
                name: 'Coches cada 1000 personas',
                type: 'spline',
                data: carsPer1000,
                tooltip: {
                    valueSuffix: ' %'
                }
            }],
            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 500
                    },
                    chartOptions: {
                        legend: {
                            floating: false,
                            layout: 'horizontal',
                            align: 'center',
                            verticalAlign: 'bottom',
                            x: 0,
                            y: 0
                        },
                        yAxis: [{
                            labels: {
                                align: 'right',
                                x: 0,
                                y: -6
                            },
                            showLastLabel: false
                        }, {
                            labels: {
                                align: 'left',
                                x: 0,
                                y: -6
                            },
                            showLastLabel: false
                        }, {
                            visible: false
                        }]
                    }
                }]
            }
        });
       
    }
    
    </script>
    
        <svelte:head>
            <script src="https://code.highcharts.com/highcharts.js" on:load={loadGraph}></script>
            <script src="https://code.highcharts.com/modules/series-label.js" on:load={loadGraph}></script>
            <script src="https://code.highcharts.com/modules/exporting.js" on:load={loadGraph}></script>
            <script src="https://code.highcharts.com/modules/export-data.js" on:load={loadGraph}></script>
            <script src="https://code.highcharts.com/modules/accessibility.js" on:load={loadGraph}></script>
        </svelte:head>
    
    <main>
    
        <figure class="highcharts-figure">
            <div id="container"></div>
            <p>

            </p>
            <p class="highcharts-description">
                En esta sección de la api podemos observar una representación gráfica acerca de los datos que tenemos sobre cada país
                en relación con el uso de coches eléctricos, mostrando de azul las ventas acumuladas, de negro las ventas anuales y de verde
                el porcentaje de coches cada 1000 personas.
            </p>
        </figure>
        
        <Button outline color="secondary" on:click="{pop}"><i class="fas fa-arrow-circle-left"></i> Atrás</Button>
    
    </main>