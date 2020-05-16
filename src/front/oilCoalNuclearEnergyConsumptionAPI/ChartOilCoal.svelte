<script>
    import Button from "sveltestrap/src/Button.svelte";
    import {
        pop
    } from "svelte-spa-router";
    
    function getPointCategoryName(point, dimension) {
        var series = point.series,
            isY = dimension === 'y',
            axis = series[isY ? 'yAxis' : 'xAxis'];
        return axis.categories[point[isY ? 'y' : 'x']];
    }
    
    async function loadGraph() {
        const BASE_API_URL = "/api/v2/oil-coal-nuclear-energy-consumption-stats";

        const resData = await fetch(BASE_API_URL);
        let Data = await resData.json();   

        let countries = Array.from(new Set(Data.map((d) => {return d.country;})));
        
        let years = Array.from(new Set(Data.map((d) => {return d.year;})));
        

        /*
            Spain => ["Spain", 0, 0]
            Canada => ["Canada", 1, 0]
        */
        let countriesPosition = [];
        for (let i = 0; i < countries.length; i++) {
            countriesPosition.push([countries[i], i, 0]);
        }
        
        let DataChart = [];
        years.forEach((y) => {
            countries.forEach((c) => {
                    let data = Data.find(d => d.country == c && d.year == y);
                    if (Data.find(d => d.country == c && d.year == y)) {
                        DataChart.push([countries.indexOf(c), years.indexOf(y), data["oil-consumption"]]);
                    } else {
                        DataChart.push([countries.indexOf(c), years.indexOf(y), null]);
                    }
            
            });
            
        });
            
        
        console.log(years);
        console.log(DataChart);
    
        Highcharts.chart('container', {
        
            chart: {
                type: 'heatmap',
                marginTop: 80,
                marginBottom: 80,
                plotBorderWidth: 1
            },
        
        
            title: {
                text: 'Porcentaje de consumo de Carbón por Año'
            },
        
            xAxis: {
                categories: countries
            },
        
            yAxis: {
                categories: years,
                title: null,
                reversed: true
            },
        
            accessibility: {
                point: {
                    descriptionFormatter: function (point) {
                        var ix = point.index + 1,
                            xName = getPointCategoryName(point, 'x'),
                            yName = getPointCategoryName(point, 'y'),
                            val = point.value;
                        return ix + '. ' + xName + ' sales ' + yName + ', ' + val + '.';
                    }
                }
            },
        
            colorAxis: {
                min: 0,
                minColor: '#FFFFFF',
                maxColor: Highcharts.getOptions().colors[0]
            },
        
            legend: {
                align: 'right',
                layout: 'vertical',
                margin: 0,
                verticalAlign: 'top',
                y: 25,
                symbolHeight: 280
            },
        
            tooltip: {
                formatter: function () {
                    return '<b>' + getPointCategoryName(this.point, 'x') + '</b> sold <br><b>' +
                        this.point.value + '</b> consumo de carbón <br><b>' + getPointCategoryName(this.point, 'y') + '</b>';
                }
            },
        
            series: [{
                name: 'Sales per employee',
                borderWidth: 1,
                data: DataChart,
                dataLabels: {
                    enabled: true,
                    color: '#000000'
                }
            }],
        
            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 500
                    },
                    chartOptions: {
                        yAxis: {
                            labels: {
                                formatter: function () {
                                    return this.value.charAt(0);
                                }
                            }
                        }
                    }
                }]
            }
        
        });
    }

    
</script>

<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"  on:load={loadGraph}></script>
    <script src="https://code.highcharts.com/modules/heatmap.js"  on:load={loadGraph}></script>
    <script src="https://code.highcharts.com/modules/exporting.js"  on:load={loadGraph}></script>
    <script src="https://code.highcharts.com/modules/export-data.js"  on:load={loadGraph}></script>
    <script src="https://code.highcharts.com/modules/accessibility.js"  on:load={loadGraph}></script>
    
    
</svelte:head>

<main>
    
    <figure class="highcharts-figure">
        <div id="container"></div>
        <p class="highcharts-description">
        </p>
    </figure>

    <Button outline color="secondary" on:click="{pop}"> <i class="fas fa-arrow-circle-left"></i> Atrás </Button>

</main>