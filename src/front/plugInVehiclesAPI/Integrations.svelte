<script>
    import Button from "sveltestrap/src/Button.svelte";
    import {
        pop
    } from "svelte-spa-router";


    async function loadGraph(){
    
     /* Asking for the data to the back */
        const BASE_API_URL = "/api/v3/plugin-vehicles-stats";
        const BASE_API_URL_27 = "/api/v2/spc-stats";

        const resData = await fetch(BASE_API_URL);
        const resData27 = await fetch(BASE_API_URL_27);
        let MyData = await resData.json();   
        let Data27 = await resData27.json();  

        /* Getting the countries */
        /* Turning them into upper case because the integration needs it */
        let countries = Array.from(new Set(MyData.map((d) => {return d.country.toUpperCase();})));
        /* Mapping the data in the right format */
        /* The country must be an index of the array of countries */
        /*  
        Turning this:

        {
            "country": "COUNTRY",
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
            return [countries.indexOf(d.country.toUpperCase()), d.year, d["percentage-re-total"], d["percentage-hydropower-total"], d["percentage-wind-power-total"]]; 
        });
        

        /* To integrate the data, we find the Data in the integration wich match with the year and the country */
        MyData = MyData.filter((d) => { return Data27.find(d27 => d27.name == countries[d[0]] && parseInt(d27.year) == d[1])}).map((d) => {
            return [d[0], d[1], d[2], d[3], d[4],
                    Data7.find(d27 => d27.name == countries[d[0]] && parseInt(d27.year) == d[1])["TVegANDPrep"]
        ]; 
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
            Representación con el grupo x.
        </p>
    </figure>
    
    <button type="button"  class="btn btn-outline-dark" onclick="window.location.href='#/'"><i class="fas fa-chart-area"></i> 1</button>

    <Button outline color="secondary" on:click="{pop}"><i class="fas fa-arrow-circle-left"></i> Atrás</Button>
    
</main>