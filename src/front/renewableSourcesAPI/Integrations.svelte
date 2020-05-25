<script>
    import Button from "sveltestrap/src/Button.svelte";
    import {
        pop
    } from "svelte-spa-router";

    async function loadGraph7() {
            
            /* Asking for the data to the back */
            const BASE_API_URL = "/api/v4/renewable-sources-stats";
            const BASE_API_URL_7 = "/api/v2/foodsImports";

            const resData = await fetch(BASE_API_URL);
            const resData7 = await fetch(BASE_API_URL_7);
            let MyData = await resData.json();   
            let Data7 = await resData7.json();  
    
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
            MyData = MyData.filter((d) => { return Data7.find(d7 => d7.name == countries[d[0]] && parseInt(d7.year) == d[1])}).map((d) => {
                console.log(d);
                return [d[0], d[1], d[2], d[3], d[4],
                        Data7.find(d7 => d7.name == countries[d[0]] && parseInt(d7.year) == d[1])["TVegANDPrep"]
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
            
            /* Setting the chart */
            Highcharts.chart('container-7', {
                chart: {
                    type: 'spline',
                    parallelCoordinates: true,
                    parallelAxes: {
                        lineWidth: 3
                    }
                },
                title: {
                    text: 'Energías renovables e importaciones'
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
                        'Porcentaje de uso de energías eólica',
                        'Vegetales y preparados'
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
                },
                {
                    min: 0,
                    tooltipValueFormat: '{value}'
                }],
                colors: ['rgba(129, 131, 202, 0.8)'],
                series: ChartData
            });
        }
    
        loadGraph7();
</script>

<main>
    <div class="row">
        <div class="col-4">
          <div class="list-group" id="list-tab" role="tablist">
            <a class="list-group-item list-group-item-action active" id="list-home-list" data-toggle="list" href="#list-7" role="tab" aria-controls="home">Integración con 7</a>
            <a class="list-group-item list-group-item-action" id="list-profile-list" data-toggle="list" href="#list-27" role="tab" aria-controls="profile">Integración con 27</a>
            <a class="list-group-item list-group-item-action" id="list-profile-list" data-toggle="list" href="#list-5" role="tab" aria-controls="profile">Integración con 5</a>
            <a class="list-group-item list-group-item-action" id="list-profile-list" data-toggle="list" href="#list-4" role="tab" aria-controls="profile">Integración con 4</a>
            <a class="list-group-item list-group-item-action" id="list-profile-list" data-toggle="list" href="#list-22" role="tab" aria-controls="profile">Integración con 22</a>
            <a class="list-group-item list-group-item-action" id="list-profile-list" data-toggle="list" href="#list-28" role="tab" aria-controls="profile">Integración con 28</a>

        </div>
        </div>
        <div class="col-8">
          <div class="tab-content" id="nav-tabContent">
            <div class="tab-pane fade show active" id="list-7" role="tabpanel" aria-labelledby="list-home-list">
                <figure class="highcharts-figure">
                    <div id="container-7"></div>
                    <p class="highcharts-description">
                        Integración con el grupo 7, la integración está realizada con la importaciones de vegetales y preparados.
                    </p>
                </figure>
            </div>
            <div class="tab-pane fade" id="list-27" role="tabpanel" aria-labelledby="list-profile-list">
                <figure class="highcharts-figure">
                    <div id="container-27"></div>
                    <p class="highcharts-description">
                        Integra la 27.
                    </p>
                </figure>
            </div>
            <div class="tab-pane fade" id="list-5" role="tabpanel" aria-labelledby="list-profile-list">
                <figure class="highcharts-figure">
                    <div id="container-27"></div>
                    <p class="highcharts-description">
                        Integra la 5.
                    </p>
                </figure>
            </div>
            <div class="tab-pane fade" id="list-4" role="tabpanel" aria-labelledby="list-profile-list">
                <figure class="highcharts-figure">
                    <div id="container-27"></div>
                    <p class="highcharts-description">
                        Integra la 4.
                    </p>
                </figure>
            </div>
            <div class="tab-pane fade" id="list-22" role="tabpanel" aria-labelledby="list-profile-list">
                <figure class="highcharts-figure">
                    <div id="container-27"></div>
                    <p class="highcharts-description">
                        Integra la 22.
                    </p>
                </figure>
            </div>
            <div class="tab-pane fade" id="list-28" role="tabpanel" aria-labelledby="list-profile-list">
                <figure class="highcharts-figure">
                    <div id="container-27"></div>
                    <p class="highcharts-description">
                        Integra la 28.
                    </p>
                </figure>
            </div>
          </div>
        </div>
      </div>
    <Button outline color="secondary" on:click="{pop}"> <i class="fas fa-arrow-circle-left"></i> Atrás </Button>
</main>