<script>
    import Button from "sveltestrap/src/Button.svelte";
    import {
        pop
    } from "svelte-spa-router";

        
   
    
async function loadGraph4(){
    
    const BASE_API_URL = "/api/v1/traffic_accidents/";
    let MyData = [];
     
    const resData = await fetch(BASE_API_URL);
    MyData = await resData.json();
   
    await fetch(BASE_API_URL + "/", {
                method: "DELETE"
            }).then(async function (resDelete) {
                if (resDelete.ok) {
                    console.log("Deleted data 4...");
                    const res = await fetch(BASE_API_URL + "/loadInitialData").then(async function(resLoad) {
                            if (resLoad.ok) {
                                console.log("Loaded initial data 4...");
                                
                            } else {
                                console.log("ERROR obtaining initial data 4...");
                            }
                    }); 

                } else {
                    console.log("ERROR deleting data 4...");
                }
            });

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
    
    const BASE_API_URL = "https://sos1920-01.herokuapp.com/api/v1/poverty-stats";
    
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

async function loadGraphExt1(){
        console.log("Loading external api");
        
        const BASE_API_URL  = "/api/v2/oil-coal-nuclear-energy-consumption-stats";
        const BASE_API_URL_External01 = "https://restcountries.eu/rest/v2/all?fields=name;area;population";

        const resData = await fetch(BASE_API_URL);
        const resDataExternal01 = await fetch(BASE_API_URL_External01);
        let MyData = await resData.json();
        let DataExternal01 = await resDataExternal01.json();
        console.log(DataExternal01);
        console.log(MyData);

            
            let dataPrimary = MyData.map((d) => {
                let res = {
                    name: d.country + " - " + d.year,
                    value: d["oil-consumption"]
                };
                return res;
            });

            let dataAPIExternal01 = DataExternal01.filter((d) => {return d.area > 5000000;}).map((d) =>  {
            let res = {
                name:  d.name + " - " + d.population,
                value: d.area
            };
            return res;
        });
        
        
		let datos = 
        [
            {
                name: "Millones de toneladas de petróleo.",
                data: dataPrimary
            },
            {
                name: "Area por País y Población.",
                data: dataAPIExternal01
            }
        ];

        Highcharts.chart('container-ext', {
			chart: {
				type: 'packedbubble',
				height: '100%'
			},
			title: {
				text: 'Relacion Consumo de petroleo por Países junto con Países y su Poblacion con un area meno que 250.'
			},
			tooltip: {
				useHTML: true,
				pointFormat: '<b>{point.name}:</b> {point.value}'
			},
			plotOptions: {
				packedbubble: {
					minSize: '30%',
					maxSize: '120%',
					zMin: 0,
					zMax: 1000,
					layoutAlgorithm: {
						splitSeries: false,
						gravitationalConstant: 0.02
					},
					dataLabels: {
						enabled: true,
						format: '{point.name}',
						filter: {
							property: 'y',
							operator: '>',
							value: 250
						},
						style: {
							color: 'black',
							textOutline: 'none',
							fontWeight: 'normal'
						}
					}
				}
			},
			series: datos
		});
    }

async function loadGraph05(){
        console.log("Loading api 05");
        
        const BASE_API_URL  = "/api/v2/oil-coal-nuclear-energy-consumption-stats";
        const BASE_API_URL_05 = "https://sos1920-05.herokuapp.com/api/v1/health_public";

        const resData = await fetch(BASE_API_URL);
        const resData05 = await fetch(BASE_API_URL_05);
        let MyData = await resData.json();
        let Data05 = await resData05.json();
        console.log(Data05);
        console.log(MyData);

            
            let dataPrimary = MyData.filter((d) => {return d.year==2016}).map((d) => {
                let res = {
                    name: d.country + " - " + "Consumo de energía nuclear",
                    value: d["nuclear-energy-consumption"]
                };
                return res;
            });

            let dataAPIExternal01 = Data05.filter((d) => {return d.year==2016;}).map((d) =>  {
            let res = {
                name:  d.country + " - " + "Gasto Público",
                value: d.public_spending
            };
            return res;
        });
        
        
		let datos = 
        [
            {
                name: "Consumo de energía nuclear expresada en millones de toneladas en el año 2016.",
                data: dataPrimary
            },
            {
                name: "Gasto Público del País en el año 2016.",
                data: dataAPIExternal01
            }
        ];

        Highcharts.chart('container-05', {
			chart: {
				type: 'packedbubble',
				height: '100%'
			},
			title: {
				text: 'Relacion Consumo de energía nuclear por Países en el año 2016 junto con el gasto Publico de un País en 2016.'
			},
			tooltip: {
				useHTML: true,
				pointFormat: '<b>{point.name}:</b> {point.value}'
			},
			plotOptions: {
				packedbubble: {
					minSize: '30%',
					maxSize: '120%',
					zMin: 0,
					zMax: 1000,
					layoutAlgorithm: {
						splitSeries: false,
						gravitationalConstant: 0.02
					},
					dataLabels: {
						enabled: true,
						format: '{point.name}',
						filter: {
							property: 'y',
							operator: '>',
							value: 250
						},
						style: {
							color: 'black',
							textOutline: 'none',
							fontWeight: 'normal'
						}
					}
				}
			},
			series: datos
		});
    }

async function loadGraph10(){
        console.log("Loading api 10");
        
        const BASE_API_URL  = "/api/v3/oil-coal-nuclear-energy-consumption-stats";
        const BASE_API_URL_05 = "https://sos1920-10.herokuapp.com/api/v2/global-divorces";

        const resData = await fetch(BASE_API_URL);
        const resData10 = await fetch(BASE_API_URL_05);
        let MyData = await resData.json();
        let Data10 = await resData10.json();
        console.log(Data10);
        console.log(MyData);

            
            let dataPrimary = MyData.filter((d) => {return d.year == 2017}).map((d) => {
                let res = {
                    name: d.country + " - " + "Consumo de energía nuclear",
                    value: d["coal-consumption"]
                };
                return res;
            });

            let dataAPI10 = Data10.filter((d) => {return d.year==2017;}).map((d) =>  {
            let res = {
                name:  d.country + " - " + "Numero de divorcios",
                value: d.divorce
            };
            return res;
        });
        
        
		let datos = 
        [
            {
                name: "Consumo de carbón expresada en millones de toneladas en el año 2016.",
                data: dataPrimary
            },
            {
                name: "Estadística de divorcios Globales.",
                data: dataAPI10
            }
        ];

        Highcharts.chart('container-10', {
			chart: {
				type: 'packedbubble',
				height: '100%'
			},
			title: {
				text: 'Relacion Consumo de carbón por Países en el año 2017 junto con el numero de divorcios por países en 2017.'
			},
			tooltip: {
				useHTML: true,
				pointFormat: '<b>{point.name}:</b> {point.value}'
			},
			plotOptions: {
				packedbubble: {
					minSize: '30%',
					maxSize: '120%',
					zMin: 0,
					zMax: 1000,
					layoutAlgorithm: {
						splitSeries: false,
						gravitationalConstant: 0.02
					},
					dataLabels: {
						enabled: true,
						format: '{point.name}',
						filter: {
							property: 'y',
							operator: '>',
							value: 250
						},
						style: {
							color: 'black',
							textOutline: 'none',
							fontWeight: 'normal'
						}
					}
				}
			},
			series: datos
		});
    }

async function loadGraph23(){
    
  
    const BASE_API_23 = "https://sos1920-23.herokuapp.com/api/v2/offworks-stats";
    let Data23 = [];

    const resData23 = await fetch(BASE_API_23);
    Data23 = await resData23.json();
   
   
   /* let countries = [];
    let pevStock = [];
    let annualSale = [];
    let carsPer1000 = [];
    */

    let communities = [];
    let accidents= [];
    let sicks= [];
    let numberzon= [];
  
    Data23.forEach((data) => {
        let community = data.community;
        let year = data.year;
        let accide = data.accident;
        let sic = data.sick;
        let num = data.numberzone;
        
        communities.push(community);
        accidents.push(accide);
        sicks.push(sic);
        numberzon.push(num);
       
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
    Highcharts.chart('container-23', {
        chart: {
            zoomType: 'xy'
        },
        title: {
            text: 'Datos sobre el tipo de bajas de trabajo durante el año 2008 por Comunidades Autónomas.',
            align: 'left'
        },
        subtitle: {
            text: '',
            align: 'left'
        },
        xAxis: [{
            categories: communities,
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
                text: 'Baja por Enfermedad',
                style: {
                    color: Highcharts.getOptions().colors[2]
                }
            },
            opposite: true

        }, { // Secondary yAxis
            gridLineWidth: 0,
            title: {
                text: 'Baja por Accidente',
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
                text: 'Baja por numero de zonas',
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            },
            labels: {
                format: '{value} casos',
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
            name: 'Baja por Accidente',
            type: 'column',
            yAxis: 1,
            data: accidents,
            tooltip: {
                valueSuffix: ' casos'
            },

        }, {
            name: 'Baja por Enfermedad',
            type: 'spline',
            yAxis: 2,
            data: sicks,
            marker: {
                enabled: false
            },
            dashStyle: 'shortdot',
            tooltip: {
                valueSuffix: ' casos'
            }

        }, {
            name: 'Numero de Zonas',
            type: 'spline',
            data: numberzon,
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
    
async function loadGraph26(){
        console.log("Loading api 26");
        
        const BASE_API_URL  = "/api/v3/oil-coal-nuclear-energy-consumption-stats";
        const BASE_API_URL_26 = "http://sos1920-26.herokuapp.com/api/v2/global-transfers";

        const resData = await fetch(BASE_API_URL);
        const resData26 = await fetch(BASE_API_URL_26);
        let MyData = await resData.json();
        let Data26 = await resData26.json();
        console.log(Data26);
        console.log(MyData);

            
            let dataPrimary = MyData.filter((d) => {return d.year == 2016}).map((d) => {
                let res = {
                    name: d.country + " - " + "consumo de gasolina",
                    value: d["oil-consumption"]
                };
                return res;
            });

            let dataAPI26 = Data26.filter((d) => {return d.year==2018;}).map((d) =>  {
            let res = {
                name:  d.country + " - " + d.team,
                value: d.signing
            };
            return res;
        });
        
        
		let datos = 
        [
            {
                name: "Consumo de gasolina expresada en millones de toneladas en el año 2016.",
                data: dataPrimary
            },
            {
                name: "Estadística de numero de fichajes por equipo y País en 2018.",
                data: dataAPI26
            }
        ];

        Highcharts.chart('container-26', {
			chart: {
				type: 'packedbubble',
				height: '100%'
			},
			title: {
				text: 'Relacion Consumo de carbón por Países en el año 2017 junto con mercado de fichajes por equipo en 2018.'
			},
			tooltip: {
				useHTML: true,
				pointFormat: '<b>{point.name}:</b> {point.value}'
			},
			plotOptions: {
				packedbubble: {
					minSize: '30%',
					maxSize: '120%',
					zMin: 0,
					zMax: 1000,
					layoutAlgorithm: {
						splitSeries: false,
						gravitationalConstant: 0.02
					},
					dataLabels: {
						enabled: true,
						format: '{point.name}',
						filter: {
							property: 'y',
							operator: '>',
							value: 250
						},
						style: {
							color: 'black',
							textOutline: 'none',
							fontWeight: 'normal'
						}
					}
				}
			},
			series: datos
		});
    }

async function loadGraphExt2(){

    const BASE_API_URL = "https://parallelum.com.br/fipe/api/v1/carros/marcas";
    const resData = await fetch(BASE_API_URL);
    let Data = await resData.json(); 
    let nomes = Array.from(new Set(Data.map((d) => {return d.nome;})));
    let codigos = Array.from(new Set(Data.map((d) => {return d.codigo;})));
    var ctx = document.getElementById('container-ext2');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: nomes,
            datasets: [{
                label: 'Marcas de Coches ordenados alfabéticamente y código',
                data: codigos,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(123, 13, 132, 0.2)',
                    'rgba(189, 162, 235, 0.2)',
                    'rgba(255, 65, 186, 0.1)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(53, 101, 200, 0.3)',
                    'rgba(25, 159, 64, 0.2)',
                    'rgba(255,0,0,0.3)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(123, 13, 132, 0.2)',
                    'rgba(189, 162, 235, 0.2)',
                    'rgba(255, 65, 186, 0.1)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(53, 101, 200, 0.3)',
                    'rgba(25, 159, 64, 0.2)',
                    'rgba(255,0,0,0.3)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(123, 13, 132, 0.2)',
                    'rgba(189, 162, 235, 0.2)',
                    'rgba(255, 65, 186, 0.1)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(53, 101, 200, 0.3)',
                    'rgba(25, 159, 64, 0.2)',
                    'rgba(255,0,0,0.3)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(123, 13, 132, 0.2)',
                    'rgba(189, 162, 235, 0.2)',
                    'rgba(255, 65, 186, 0.1)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(53, 101, 200, 0.3)',
                    'rgba(25, 159, 64, 0.2)',
                    'rgba(255,0,0,0.3)'
                ],
                borderColor: [
                'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(123, 13, 132, 0.2)',
                    'rgba(189, 162, 235, 0.2)',
                    'rgba(255, 65, 186, 0.1)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(53, 101, 200, 0.3)',
                    'rgba(25, 159, 64, 0.2)',
                    'rgba(255,0,0,0.3)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(123, 13, 132, 0.2)',
                    'rgba(189, 162, 235, 0.2)',
                    'rgba(255, 65, 186, 0.1)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(53, 101, 200, 0.3)',
                    'rgba(25, 159, 64, 0.2)',
                    'rgba(255,0,0,0.3)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(123, 13, 132, 0.2)',
                    'rgba(189, 162, 235, 0.2)',
                    'rgba(255, 65, 186, 0.1)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(53, 101, 200, 0.3)',
                    'rgba(25, 159, 64, 0.2)',
                    'rgba(255,0,0,0.3)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(123, 13, 132, 0.2)',
                    'rgba(189, 162, 235, 0.2)',
                    'rgba(255, 65, 186, 0.1)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(53, 101, 200, 0.3)',
                    'rgba(25, 159, 64, 0.2)',
                    'rgba(255,0,0,0.3)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
    }

async function loadGraphExt28(){

const BASE_API_URL  = "/api/v3/oil-coal-nuclear-energy-consumption-stats";
        const BASE_API_URL_28 = "/api/v1/ppas";

        const resData = await fetch(BASE_API_URL);
        const resData28 = await fetch(BASE_API_URL_28);
        let MyData = await resData.json();
        let Data28 = await resData28.json();
        console.log(Data28);
        console.log(MyData);

let oil = Array.from(new Set(MyData.map((d) => {return d["oil-consumption"];})));

let paridad = Array.from(new Set(Data28.map((d) => {return d.ppa_per_capita;})));

var ctx = document.getElementById('container-28');
var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: paridad,
        datasets: [{
            label: 'Paridad de poder adquisitivo en el año 2016 junto con el consumo de gasolina.',
            data: oil,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(123, 13, 132, 0.2)'
            ],
            borderColor: [
            'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(123, 13, 132, 0.2)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});
}

async function loadGraph21(){
    

        const BASE_API_URL  = "/api/v3/oil-coal-nuclear-energy-consumption-stats";
        const BASE_API_URL_21 = "https://sos1920-21.herokuapp.com/api/v2/traffic-injuries";
        await fetch(BASE_API_URL_21 + "/loadInitialData").then(async function(resLoad) {
                            if (resLoad.ok) {
                                console.log("Loaded initial data 21...");
                                
                            } else {
                                console.log("ERROR obtaining initial data 21...");
                            }
                    }); 

                
        const resData = await fetch(BASE_API_URL);
        const resData21 = await fetch(BASE_API_URL_21);
        let MyData = await resData.json();
        let Data21 = await resData21.json();
        console.log(Data21);
        console.log(MyData);

let coal = Array.from(new Set(MyData.map((d) => {return d["coal-consumption"];})));

let accidents = Array.from(new Set(Data21.map((d) => {return d.accident;})));

var ctx = document.getElementById('container-21');
var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: accidents,
        datasets: [{
            label: 'Numero de accidentes desde el año 2016 al 2018 junto con el consumo de carbón.',
            data: coal,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(123, 13, 132, 0.2)'
            ],
            borderColor: [
            'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(123, 13, 132, 0.2)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});
}

loadGraph4();
loadGraph2();
loadGraph12();
loadGraph01();
loadGraphExt1();
loadGraph05();
loadGraph10();
loadGraph23();
loadGraph26();
loadGraphExt2();
loadGraphExt28();
loadGraph21();



</script>

<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/highcharts-more.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js"></script>

    <script src="https://code.jquery.com/jquery-3.1.1.min.js"></script>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/highcharts-more.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js"></script>

</svelte:head>


<main>
    <div class="row">
        <div class="col-4">
          <div class="list-group" id="list-tab" role="tablist">
            <a class="list-group-item list-group-item-action active" id="list-home-list" data-toggle="list" href="#list-4" role="tab" aria-controls="home">Integración con 4</a>
            <a class="list-group-item list-group-item-action" id="list-profile-list" data-toggle="list" href="#list-2" role="tab" aria-controls="profile">Integración con 2</a>
            <a class="list-group-item list-group-item-action" id="list-profile-list" data-toggle="list" href="#list-12" role="tab" aria-controls="profile">Integración con 12</a>
            <a class="list-group-item list-group-item-action" id="list-profile-list" data-toggle="list" href="#list-01" role="tab" aria-controls="profile">Integración con 1</a>
            <a class="list-group-item list-group-item-action" id="list-profile-list" data-toggle="list" href="#list-ext" role="tab" aria-controls="profile">Integración API Externa 1</a>
            <a class="list-group-item list-group-item-action" id="list-profile-list" data-toggle="list" href="#list-05" role="tab" aria-controls="profile">Integración con 5</a>
            <a class="list-group-item list-group-item-action" id="list-profile-list" data-toggle="list" href="#list-10" role="tab" aria-controls="profile">Integración con 10</a>
            <a class="list-group-item list-group-item-action" id="list-profile-list" data-toggle="list" href="#list-23" role="tab" aria-controls="profile">Integración con 23</a>
            <a class="list-group-item list-group-item-action" id="list-profile-list" data-toggle="list" href="#list-26" role="tab" aria-controls="profile">Integración con 26</a>
            <a class="list-group-item list-group-item-action" id="list-profile-list" data-toggle="list" href="#list-ext2" role="tab" aria-controls="profile">Integración con API Externa 2</a>
            <a class="list-group-item list-group-item-action" id="list-profile-list" data-toggle="list" href="#list-28" role="tab" aria-controls="profile">Integración con 28</a>
            <a class="list-group-item list-group-item-action" id="list-profile-list" data-toggle="list" href="#list-21" role="tab" aria-controls="profile">Integración con 21</a>


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
            <div class="tab-pane fade" id="list-ext" role="tabpanel" aria-labelledby="list-profile-list">
                <figure class="highcharts-figure">
                    <div id="container-ext"></div>
                    <p class="highcharts-description">
                        Integración de API externa 
                        <a href="https://restcountries.eu/rest/v2/all?fields=name;area;population">Link de la API</a>
                    </p>
                </figure>
            </div>
            <div class="tab-pane fade" id="list-05" role="tabpanel" aria-labelledby="list-profile-list">
                <figure class="highcharts-figure">
                    <div id="container-05"></div>
                    <p class="highcharts-description">
                        Integra la 5.
                    </p>
                </figure>
            </div>
            <div class="tab-pane fade" id="list-10" role="tabpanel" aria-labelledby="list-profile-list">
                <figure class="highcharts-figure">
                    <div id="container-10"></div>
                    <p class="highcharts-description">
                        Integra la 10.
                    </p>
                </figure>
            </div>
            <div class="tab-pane fade" id="list-23" role="tabpanel" aria-labelledby="list-profile-list">
                <figure class="highcharts-figure">
                    <div id="container-23"></div>
                    <p class="highcharts-description">
                        Integra la 23.
                    </p>
                </figure>
            </div>
            <div class="tab-pane fade" id="list-26" role="tabpanel" aria-labelledby="list-profile-list">
                <figure class="highcharts-figure">
                    <div id="container-26"></div>
                    <p class="highcharts-description">
                        Integra la 26.
                    </p>
                </figure>
            </div>
            <div class="tab-pane fade" id="list-ext2" role="tabpanel" aria-labelledby="list-profile-list">
                <figure class="highcharts-figure">
                    <canvas id="container-ext2" width="3" height="1"></canvas>
                    <div id="container-ext2"></div>
                    <p class="highcharts-description">
                        Integra la Externa 2.
                        <a href="https://parallelum.com.br/fipe/api/v1/carros/marcas">Link de la API</a>
                    </p>
                </figure>
            </div>
            <div class="tab-pane fade" id="list-28" role="tabpanel" aria-labelledby="list-profile-list">
                <figure class="highcharts-figure">
                    <canvas id="container-28" width="3" height="1"></canvas>
                    <div id="container-28"></div>
                    <p class="highcharts-description">
                        Integra la 28.
                    </p>
                </figure>
            </div>
            <div class="tab-pane fade" id="list-21" role="tabpanel" aria-labelledby="list-profile-list">
                <figure class="highcharts-figure">
                    <canvas id="container-21" width="3" height="1"></canvas>
                    <div id="container-21"></div>
                    <p class="highcharts-description">
                        Integra la 21.
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