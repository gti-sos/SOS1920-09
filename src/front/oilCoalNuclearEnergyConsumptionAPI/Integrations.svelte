<script>
    import Button from "sveltestrap/src/Button.svelte";
    import {
        pop
    } from "svelte-spa-router";

        
   
    
async function loadGraph4(){
    
    const BASE_API_URL = "https://sos1920-04.herokuapp.com/api/v1/traffic_accidents/";
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

        provincies.push(province);
        accidentWithVictims.push(acc);
        mortalAccident.push(mor);
        death.push(dea);
       
    });
     /*
    { 
        province:"Almeria",
		year: 2018,
		accidentWithVictims: 1194,
		mortalAccident: 27,
		death: 27,
		hospitalizedWounded: 111,
		notHospitalizedWounded: 1780
    }
    
    */
    Highcharts.chart('container-4', {
        chart: {
            zoomType: 'xy'
        },
        title: {
            text: 'Gráfica sobre datos de accidentes de tráfico.',
            align: 'left'
        },
        subtitle: {
            text: 'Datos sobre el año 2015-2018:',
            align: 'left'
        },
        xAxis: [{
            categories: provincies,
            crosshair: true
        }],
        yAxis: [{ // Primary yAxis
            labels: {
                format: '{value} casos',
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
                format: '{value} casos',
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
                valueSuffix: ' Personas'
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
                valueSuffix: ' Personas'
            }

        }, {
            name: 'Accidentes Mortales',
            type: 'spline',
            data: mortalAccident,
            tooltip: {
                valueSuffix: ' Personas'
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

async function loadGraph2(){
    
    const BASE_API_URL = "/api/v2/evolution-of-cycling-routes";
    
    let MyData = [];
     
     const resData = await fetch(BASE_API_URL);
     MyData = await resData.json();
    
    /* let countries = [];
     let pevStock = [];
     let annualSale = [];
     let carsPer1000 = [];
     */
 
     let provincies = [];
     let metropolitans= [];
     let urbans = [];
     let rests = [];
  
 
     MyData.forEach((data) => {
         let province = data.province;
         let year = data.year;
         let metr = data.metropolitan;
         let urb = data.urban;
         let res = data.rest;
        
        if(data.year == 2015){
        provincies.push(province);
        metropolitans.push(metr);
        urbans.push(urb);
        rests.push(res);
        
        }
   
     });
      /* 
    {   province: "almeria",
        year: 2015,
        metropolitan: 77.6,
        urban: 53.2, rest: 24.3
    }
     */
     Highcharts.chart('container-2', {
         chart: {
             zoomType: 'xy'
         },
         title: {
             text: 'Gráfica sobre datos de accidentes de tráfico.',
             align: 'left'
         },
         subtitle: {
             text: 'Datos sobre el año 2015:',
             align: 'left'
         },
         xAxis: [{
             categories: provincies,
             crosshair: true
         }],
         yAxis: [{ // Primary yAxis
             labels: {
                 format: '{value} km',
                 style: {
                     color: Highcharts.getOptions().colors[2]
                 }
             },
             title: {
                 text: 'Metropolitano',
                 style: {
                     color: Highcharts.getOptions().colors[2]
                 }
             },
             opposite: true
 
         }, { // Secondary yAxis
             gridLineWidth: 0,
             title: {
                 text: 'Urbano',
                 style: {
                     color: Highcharts.getOptions().colors[0]
                 }
                 
             },
             labels: {
                 format: '{value} km',
                 style: {
                     color: Highcharts.getOptions().colors[0]
                 }
             }
 
         }, { // Tertiary yAxis
             gridLineWidth: 0,
             title: {
                 text: 'Resto',
                 style: {
                     color: Highcharts.getOptions().colors[1]
                 }
             },
             labels: {
                 format: '{value} km',
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
             name: 'Urbano',
             type: 'column',
             yAxis: 1,
             data: urbans,
             tooltip: {
                 valueSuffix: ' Personas'
             },
 
         }, {
             name: 'Resto',
             type: 'spline',
             yAxis: 2,
             data: rests,
             marker: {
                 enabled: false
             },
             dashStyle: 'shortdot',
             tooltip: {
                 valueSuffix: ' Personas'
             }
 
         }, {
             name: 'Metropolitano',
             type: 'spline',
             data: metropolitans,
             tooltip: {
                 valueSuffix: ' Personas'
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

async function loadGraph12(){
    
    const BASE_API_URL = "http://sos1920-12.herokuapp.com/api/v1/drug_offences";
    
    let MyData = [];
     
     const resData = await fetch(BASE_API_URL);
     MyData = await resData.json();
    
    /*  country: "Portugal",
	    year: 2014,
		cannabis_offences: 11836,
		offences_use: 7417,
		offences_supply:4419
    */
    let countries = [];
    let cannabisoffences = [];
    let offencesuse = [];
    let offences_supply= [];

   
 
    MyData.forEach((data) => {
         
        let country = data.country;
        let year = data.year;
        let cannoffen = data.cannabis_offences;
        let offuse= data.offences_use;
        let offsup = data.offences_supply;
        
        if (data.year == 2017 || data.year == 2016 ){
        countries.push(country);
        cannabisoffences.push(cannoffen);
        offencesuse.push(offuse);
        offences_supply.push(offsup);
        
        }
       
     });
      /* 
    {   province: "almeria",
        year: 2015,
        metropolitan: 77.6,
        urban: 53.2, rest: 24.3
    }
     */
     Highcharts.chart('container-12', {
         chart: {
             zoomType: 'xy'
         },
         title: {
             text: 'Gráfica sobre datos relacionados con asesinatos y consumo de cannabis.',
             align: 'left'
         },
         subtitle: {
             text: 'Datos comprendidos entre 2016 y 2017:',
             align: 'left'
         },
         xAxis: [{
             categories: countries,
             crosshair: true
         }],
         yAxis: [{ // Primary yAxis
             labels: {
                 format: '{value} casos',
                 style: {
                     color: Highcharts.getOptions().colors[2]
                 }
             },
             title: {
                 text: 'Delitos relacionados con el Cannabis',
                 style: {
                     color: Highcharts.getOptions().colors[2]
                 }
             },
             opposite: true
 
         }, { // Secondary yAxis
             gridLineWidth: 0,
             title: {
                 text: 'Delitos relacionados con el tráfico de Cannabis',
                 style: {
                     color: Highcharts.getOptions().colors[0]
                 }
                 
             },
             labels: {
                 format: '{value} casos',
                 style: {
                     color: Highcharts.getOptions().colors[0]
                 }
             }
 
         }, { // Tertiary yAxis
             gridLineWidth: 0,
             title: {
                 text: 'Delitos relacionadso con el uso de Cannabis',
                 style: {
                     color: Highcharts.getOptions().colors[1]
                 }
             },
             labels: {
                 format: '{value} km',
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
             name: 'Tráfico',
             type: 'column',
             yAxis: 1,
             data: offences_supply,
             tooltip: {
                 valueSuffix: ' casos'
             },
 
         }, {
             name: 'Uso',
             type: 'spline',
             yAxis: 2,
             data: offencesuse,
             marker: {
                 enabled: false
             },
             dashStyle: 'shortdot',
             tooltip: {
                 valueSuffix: ' casos'
             }
 
         }, {
             name: 'Total',
             type: 'spline',
             data: cannabisoffences,
             tooltip: {
                 valueSuffix: ' casos'
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

async function loadGraph01(){
    
    const BASE_API_URL = "http://sos1920-01.herokuapp.com/api/v2/poverty-stats";
    
    let MyData = [];
     
     const resData = await fetch(BASE_API_URL);
     MyData = await resData.json();
    
    /*     
        country: "spain",
        year: 2010,
        poverty_prp:9551,
        poverty_pt:8763,
        poverty_ht:18402
    */
    let countries = [];
    let povertyprp = [];
    let povertypt = [];
    let povertyht= [];

   
 
    MyData.forEach((data) => {
         
        let country = data.country;
        let year = data.year;
        let prp = data.poverty_prp;
        let pt= data.poverty_pt;
        let ht = data.poverty_ht;
        
        if (data.year == 2015 || data.year == 2017){
        countries.push(country);
        povertyprp.push(prp);
        povertypt.push(pt);
        povertyht.push(ht);
        
        }
       
     });
      /* 
    {   province: "almeria",
        year: 2015,
        metropolitan: 77.6,
        urban: 53.2, rest: 24.3
    }
     */
     Highcharts.chart('container-01', {
         chart: {
             zoomType: 'xy'
         },
         title: {
             text: 'Gráfica sobre datos relacionados con la pobreza.',
             align: 'left'
         },
         subtitle: {
             text: 'Datos de 2015 y 2017:',
             align: 'left'
         },
         xAxis: [{
             categories: countries,
             crosshair: true
         }],
         yAxis: [{ // Primary yAxis
             labels: {
                 format: '{value} personas',
                 style: {
                     color: Highcharts.getOptions().colors[2]
                 }
             },
             title: {
                 text: 'Personas en riesgo de pobreza',
                 style: {
                     color: Highcharts.getOptions().colors[2]
                 }
             },
             opposite: true
 
         }, { // Secondary yAxis
             gridLineWidth: 0,
             title: {
                 text: 'Umbral de ingreso minimo por persona',
                 style: {
                     color: Highcharts.getOptions().colors[0]
                 }
                 
             },
             labels: {
                 format: '{value} euros',
                 style: {
                     color: Highcharts.getOptions().colors[0]
                 }
             }
 
         }, { // Tertiary yAxis
             gridLineWidth: 0,
             title: {
                 text: 'Umbral de ingreso minimo por hogar',
                 style: {
                     color: Highcharts.getOptions().colors[1]
                 }
             },
             labels: {
                 format: '{value} euros',
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
             name: 'Umbral por persona',
             type: 'column',
             yAxis: 1,
             data: povertypt,
             tooltip: {
                 valueSuffix: ' euros'
             },
 
         }, {
             name: 'Personas con pobreza',
             type: 'spline',
             yAxis: 2,
             data: povertyprp,
             marker: {
                 enabled: false
             },
             dashStyle: 'shortdot',
             tooltip: {
                 valueSuffix: ' personas'
             }
 
         }, {
             name: 'Umbral por Hogar',
             type: 'spline',
             data: povertyht,
             tooltip: {
                 valueSuffix: ' euros'
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
loadGraph2();
loadGraph12();
loadGraph01();




</script>



<main>
    <div class="row">
        <div class="col-4">
          <div class="list-group" id="list-tab" role="tablist">
            <a class="list-group-item list-group-item-action active" id="list-home-list" data-toggle="list" href="#list-4" role="tab" aria-controls="home">Integración con 4</a>
            <a class="list-group-item list-group-item-action" id="list-profile-list" data-toggle="list" href="#list-2" role="tab" aria-controls="profile">Integración con 2</a>
            <a class="list-group-item list-group-item-action" id="list-profile-list" data-toggle="list" href="#list-12" role="tab" aria-controls="profile">Integración con 12</a>
            <a class="list-group-item list-group-item-action" id="list-profile-list" data-toggle="list" href="#list-01" role="tab" aria-controls="profile">Integración con 1</a>
            <a class="list-group-item list-group-item-action" id="list-profile-list" data-toggle="list" href="#list-22" role="tab" aria-controls="profile">Integración con 22</a>
            <a class="list-group-item list-group-item-action" id="list-profile-list" data-toggle="list" href="#list-28" role="tab" aria-controls="profile">Integración con 28</a>
            <a class="list-group-item list-group-item-action" id="list-profile-list" data-toggle="list" href="#list-ext" role="tab" aria-controls="profile">Integración con API externa</a>

        </div>
        </div>
        <div class="col-8">
          <div class="tab-content" id="nav-tabContent">
            <div class="tab-pane fade show active" id="list-4" role="tabpanel" aria-labelledby="list-home-list">
                <figure class="highcharts-figure">
                    <div id="container-4"></div>
                    <p class="highcharts-description">
                      Integración con la 4
                    </p>
                </figure>
            </div>
            <div class="tab-pane fade" id="list-2" role="tabpanel" aria-labelledby="list-profile-list">
                <figure class="highcharts-figure">
                    <div id="container-2"></div>
                    <p class="highcharts-description">
                        Integración con la 2.
                    </p>
                </figure>
            </div>
            <div class="tab-pane fade" id="list-12" role="tabpanel" aria-labelledby="list-profile-list">
                <figure class="highcharts-figure">
                    <div id="container-12"></div>
                    <p class="highcharts-description">
                        Integración con la 12.
                    </p>
                </figure>
            </div>
            <div class="tab-pane fade" id="list-01" role="tabpanel" aria-labelledby="list-profile-list">
                <figure class="highcharts-figure">
                    <div id="container-01"></div>
                    <p class="highcharts-description">
                        Integra la 1.
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
                    <div class="container my-5 text-center">
                        <button class="btn btn-danger w-100" onclick="traer()">Obtener</button>
                        <div class="mt-5" id="container-ext">
                        </div>
                    </div>
                </figure>
            </div>
          </div>
        </div>
      </div>
    <Button outline color="secondary" on:click="{pop}"> <i class="fas fa-arrow-circle-left"></i> Atrás </Button>
</main>