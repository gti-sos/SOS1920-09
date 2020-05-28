<script>
    import Button from "sveltestrap/src/Button.svelte";
    import {
        pop
    } from "svelte-spa-router";

    async function loadGraph4(){
    
    const BASE_API_URL = "https://sos1920-04.herokuapp.com/api/v1/traffic_accidents";
    let MyData = [];
     
    const resData = await fetch(BASE_API_URL);
    MyData = await resData.json();
   
   /* let countries = [];
    let pevStock = [];
    let annualSale = [];
    let carsPer1000 = [];
    */

    let provincies = [];
    let accidentWithVictims = [];
    let mortalAccident = [];
    let death = [];

    MyData.forEach((data) => {
        let province = data.province;
        let year = data.year;
        let acc = data.accidentWithVictims;
        let mor = data.mortalAccident;
        let dea = data.death;

       /* let country = data.country;
        let year = data.year;
        let p = data["pev-stock"];
        let a = data["annual-sale"];
        let c = data["cars-per-1000"];
        */
        
        
    

        if (data.year == 2018) {
            provincies.push(province);
            accidentWithVictims.push(acc);
            mortalAccident.push(mor);
            death.push(dea);
        }
    });
     /*
    { 
        "country": "Japan",
        "year": 2018,
        "pev-stock": 257363,
        "annual-sale": 52013,
        "cars-per-1000": 2.0
            province:"Almeria",
			year: 2018,
			accidentWithVictims: 1194,
			mortalAccident: 27,
			death: 27,
			hospitalizedWounded: 111,
			notHospitalizedWounded: 1780
    }
    
    */
    Highcharts.chart('container', {
        chart: {
            zoomType: 'xy'
        },
        title: {
            text: 'Gráfica sobre datos de accidentes de tráfico.',
            align: 'left'
        },
        subtitle: {
            text: 'Datos sobre el año 2018:',
            align: 'left'
        },
        xAxis: [{
            categories: provincies,
            crosshair: true
        }],
        yAxis: [{ // Primary yAxis
            labels: {
                format: '{value} unidades',
                style: {
                    color: Highcharts.getOptions().colors[2]
                }
            },
            title: {
                text: 'Accidentes Mortales',
                style: {
                    color: Highcharts.getOptions().colors[2]
                }
            },
            opposite: true

        }, { // Secondary yAxis
            gridLineWidth: 0,
            title: {
                text: 'Accidentes con Víctimas',
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
                text: 'Personas Fallecidas',
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
            name: 'Accidentes con Víctimas',
            type: 'column',
            yAxis: 1,
            data: accidentWithVictims,
            tooltip: {
                valueSuffix: ' unidades'
            },

        }, {
            name: 'Personas Fallecidas',
            type: 'spline',
            yAxis: 2,
            data: death,
            marker: {
                enabled: false
            },
            dashStyle: 'shortdot',
            tooltip: {
                valueSuffix: ' unidades'
            }

        }, {
            name: 'Accidentes Mortales',
            type: 'spline',
            data: mortalAccident,
            tooltip: {
                valueSuffix: ' unidades'
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
loadGraph4();


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
            <a class="list-group-item list-group-item-action" id="list-profile-list" data-toggle="list" href="#list-ext" role="tab" aria-controls="profile">Integración con API externa</a>

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
                    <div id="container-5"></div>
                    <p class="highcharts-description">
                        Integra la 5.
                    </p>
                </figure>
            </div>
            <div class="tab-pane fade" id="list-4" role="tabpanel" aria-labelledby="list-profile-list">
                <figure class="highcharts-figure">
                    <div id="container-4"></div>
                    <p class="highcharts-description">
                        Integra la 4.
                    </p>
                </figure>
            </div>
            <div class="tab-pane fade" id="list-22" role="tabpanel" aria-labelledby="list-profile-list">
                <figure class="highcharts-figure">
                    <div id="container-22"></div>
                    <p class="highcharts-description">
                        Integra la 22.
                    </p>
                </figure>
            </div>
            <div class="tab-pane fade" id="list-28" role="tabpanel" aria-labelledby="list-profile-list">
                <figure class="highcharts-figure">
                    <div id="container-28"></div>
                    <p class="highcharts-description">
                        Integra la 28.
                    </p>
                </figure>
            </div>
            <div class="tab-pane fade" id="list-ext" role="tabpanel" aria-labelledby="list-profile-list">
                <figure class="highcharts-figure">
                    <div id="container-ext"></div>
                    <p class="highcharts-description">
                        Integración con la una API externa que proporciona el área (en kilómetros cuadrados) de los países.
                    </p>
                </figure>
            </div>
          </div>
        </div>
      </div>
    <Button outline color="secondary" on:click="{pop}"> <i class="fas fa-arrow-circle-left"></i> Atrás </Button>
</main>