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
                    text: 'Energías renovables e importaciones de vegetales'
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

        async function loadGraph4() {
            console.log("Loading 4");
            /* Asking for the data to the back */
            const BASE_API_URL = "/api/v4/renewable-sources-stats";
            
            const BASE_API_URL_4 = "https://sos1920-04.herokuapp.com/api/v1/vehicles";


            /* All of this to delete and load the initial data from the other api */
            await fetch(BASE_API_URL_4 + "/", {
                method: "DELETE"
            }).then(async function (resDelete) {
                if (resDelete.ok) {
                    console.log("Deleted data 4...");
                    const res = await fetch(BASE_API_URL_4 + "/loadInitialData").then(async function(resLoad) {
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

            const resData = await fetch(BASE_API_URL);
            const resData4 = await fetch(BASE_API_URL_4);

            let MyData = await resData.json();   
            let Data4 = await resData4.json();  
    
            /* Getting the countries */
            /* Turning them into upper case because the integration needs it */
            let countries = Array.from(new Set(MyData.map((d) => {return d.country;})));
            let provinces = Array.from(new Set(Data4.map((d) => {return d.province;})));

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
           /* In the filter we put Spain to get only the Spain data and the years that are present in both APIs */
            MyData = MyData.filter((d) => { return d.country == "Spain" && Data4.find(d4 => d4.year == d.year)}).map((d) => {
                return [countries.indexOf(d.country), d.year, d["percentage-re-total"], d["percentage-hydropower-total"], d["percentage-wind-power-total"]]; 
            });

            let ModifiedData = [];
            for (let i = 0; i < MyData.length; i++) {
                Data4.filter(d => d.year == MyData[i][1]).forEach((dataMatchesYear) => {
                    ModifiedData.push([MyData[i][0], provinces.indexOf(dataMatchesYear.province), MyData[i][1], MyData[i][2], MyData[i][3], MyData[i][4], dataMatchesYear["car"]]);

                });   
                
                
            }

    
            
            /* 
            The following array turn this:
            [0, 2000, 0.0, 0.0, 0.0]
    
            into this:
    
            {name: "Country", data: [0, 2000, 0.0, 0.0, 0.0]}
            That is how the chart needs it
             */
            let ChartData = ModifiedData.map(function (set, i) {
                return {
                    name: countries[set[0]],
                    data: set,
                    shadow: false
                };
            });
            
            /* Setting the chart */
            Highcharts.chart('container-4', {
                chart: {
                    type: 'spline',
                    parallelCoordinates: true,
                    parallelAxes: {
                        lineWidth: 3
                    }
                },
                title: {
                    text: 'Energías renovables y número de coches'
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
                        'Provincias',
                        'Año',
                        'Porcentaje de uso de energías renovables',
                        'Porcentaje de uso de energías hidroeléctricas',
                        'Porcentaje de uso de energías eólica',
                        'Número de coches'
                    ],
                    offset: 10
                },
                yAxis: [
                {
                    categories: countries,
                    tooltipValueFormat: '{value}'
                },
                {
                    categories: provinces,
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
                },
                {
                    min: 0,
                    tooltipValueFormat: '{value}'
                }],
                colors: ['rgba(129, 131, 202, 0.8)'],
                series: ChartData
            });
        }

        async function loadGraph27() {
            console.log("Loading 27");
            /* Asking for the data to the back */
            const BASE_API_URL = "/api/v4/renewable-sources-stats";
            const BASE_API_URL_27 = "https://sos1920-27.herokuapp.com/api/v2/lq-stats";

            const resData = await fetch(BASE_API_URL);
            const resData27 = await fetch(BASE_API_URL_27);
            let MyData = await resData.json();   
            let Data27 = await resData27.json();  
    
            /* Getting the countries */
            /* Turning them into upper case because the integration needs it */
            let countries = Array.from(new Set(MyData.map((d) => {return d.country.toLowerCase();})));
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
                return [countries.indexOf(d.country.toLowerCase()), d.year, d["percentage-re-total"], d["percentage-hydropower-total"], d["percentage-wind-power-total"]]; 
            });

            MyData = MyData.filter((d) => {  return Data27.find(d27 => d27.country == countries[d[0]] && parseInt(d27.year) == d[1])}).map((d) => {
                return [d[0], d[1], d[2], d[3], d[4],
                        Data27.find(d27 => d27.country == countries[d[0]] && parseInt(d27.year) == d[1])["climate"]
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
            Highcharts.chart('container-27', {
                chart: {
                    type: 'spline',
                    parallelCoordinates: true,
                    parallelAxes: {
                        lineWidth: 3
                    }
                },
                title: {
                    text: 'Energías renovables y calidad de vida'
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
                        'Calidad de vida'
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

        async function loadGraph5() {
            console.log("Loading 5");
            /* Asking for the data to the back */
            const BASE_API_URL = "/api/v4/renewable-sources-stats";
            const BASE_API_URL_5 = "/api/v1/books-exports";

            const resData = await fetch(BASE_API_URL);
            const resData5 = await fetch(BASE_API_URL_5);
            let MyData = await resData.json();   
            let Data5 = await resData5.json();  

            /* Getting the countries */
            /* Turning them into upper case because the integration needs it */
            let countries = Array.from(new Set(MyData.map((d) => {return d.country.toLowerCase();})));
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
                return [countries.indexOf(d.country.toLowerCase()), d.year, d["percentage-re-total"], d["percentage-hydropower-total"], d["percentage-wind-power-total"]]; 
            });

            MyData = MyData.filter((d) => {  return Data5.find(d5 => d5.country == countries[d[0]] && parseInt(d5.year) == d[1])}).map((d) => {
                return [d[0], d[1], d[2], d[3], d[4],
                        Data5.find(d5 => d5.country == countries[d[0]] && parseInt(d5.year) == d[1])["exp_book"]
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
            Highcharts.chart('container-5', {
                chart: {
                    type: 'spline',
                    parallelCoordinates: true,
                    parallelAxes: {
                        lineWidth: 3
                    }
                },
                title: {
                    text: 'Energías renovables y exportación de libros'
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
                        'Exportación de libros'
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

        async function loadGraph22() {
            console.log("Loading 22");
            /* Asking for the data to the back */
            const BASE_API_URL = "/api/v4/renewable-sources-stats";
            const BASE_API_URL_22 = "https://sos1920-22.herokuapp.com/api/v2/formula-stats";

            const resData = await fetch(BASE_API_URL);
            const resData22 = await fetch(BASE_API_URL_22);
            let MyData = await resData.json();   
            let Data22 = await resData22.json();  
    
            /* Getting the countries */
            /* Turning them into upper case because the integration needs it */
            let countries = Array.from(new Set(MyData.map((d) => {return d.country.toLowerCase();})));
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
                return [countries.indexOf(d.country.toLowerCase()), d.year, d["percentage-re-total"], d["percentage-hydropower-total"], d["percentage-wind-power-total"]]; 
            });

            MyData = MyData.filter((d) => {  return Data22.find(d22 => d22.country == countries[d[0]] && parseInt(d22.year) == d[1])}).map((d) => {
                return [d[0], d[1], d[2], d[3], d[4],
                        Data22.find(d22 => d22.country == countries[d[0]] && parseInt(d22.year) == d[1])["victorynumber"]
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
            Highcharts.chart('container-22', {
                chart: {
                    type: 'spline',
                    parallelCoordinates: true,
                    parallelAxes: {
                        lineWidth: 3
                    }
                },
                title: {
                    text: 'Energías renovables y victorias de fórmula 1'
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
                        'Victorias en fórmula 1'
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

        async function loadGraph6() {
            console.log("Loading 6");
            /* Asking for the data to the back */
            const BASE_API_URL = "/api/v4/renewable-sources-stats";
            const BASE_API_URL_6 = "/api/v2/lottery-sales";

            const resData = await fetch(BASE_API_URL);
            const resData6 = await fetch(BASE_API_URL_6);
            let MyData = await resData.json();   
            let Data6 = await resData6.json();  
    
            /* Getting the countries */
            /* Turning them into upper case because the integration needs it */
            let countries = Array.from(new Set(MyData.map((d) => {return d.country;})));
            let provinces = Array.from(new Set(Data6.map((d) => {return d.province;})));
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

            MyData = MyData.filter((d) => { return d.country == "Spain" && Data6.find(d4 => d4.year == d.year)}).map((d) => {
                return [countries.indexOf(d.country), d.year, d["percentage-re-total"], d["percentage-hydropower-total"], d["percentage-wind-power-total"]]; 
            });

            let ModifiedData = [];
            for (let i = 0; i < MyData.length; i++) {

                Data6.filter(d => d.year == MyData[i][1]).forEach((dataMatchesYear) => {
                    ModifiedData.push([MyData[i][0], provinces.indexOf(dataMatchesYear.province), MyData[i][1], MyData[i][2], MyData[i][3], MyData[i][4], dataMatchesYear["total"]]);

                });    
                
                
            }

            
    
            
            /* 
            The following array turn this:
            [0, 2000, 0.0, 0.0, 0.0]
    
            into this:
    
            {name: "Country", data: [0, 2000, 0.0, 0.0, 0.0]}
            That is how the chart needs it
             */
            let ChartData = ModifiedData.map(function (set, i) {
                return {
                    name: countries[set[0]],
                    data: set,
                    shadow: false
                };
            });
            
            /* Setting the chart */
            Highcharts.chart('container-6', {
                chart: {
                    type: 'spline',
                    parallelCoordinates: true,
                    parallelAxes: {
                        lineWidth: 3
                    }
                },
                title: {
                    text: 'Energías renovables y número de loterías vendidas'
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
                        'Provincias',
                        'Año',
                        'Porcentaje de uso de energías renovables',
                        'Porcentaje de uso de energías hidroeléctricas',
                        'Porcentaje de uso de energías eólica',
                        'Número de loterías vendidas'
                    ],
                    offset: 10
                },
                yAxis: [
                {
                    categories: countries,
                    tooltipValueFormat: '{value}'
                },
                {
                    categories: provinces,
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
                },
                {
                    min: 0,
                    tooltipValueFormat: '{value}'
                }],
                colors: ['rgba(129, 131, 202, 0.8)'],
                series: ChartData
            });
        }

        async function loadGraph1() {
            console.log("Loading 1");
            /* Asking for the data to the back */
            const BASE_API_URL = "/api/v4/renewable-sources-stats";
            const BASE_API_URL_1 = "/api/v2/natality-stats";

            const resData = await fetch(BASE_API_URL);
            const resData1 = await fetch(BASE_API_URL_1);
            let MyData = await resData.json();   
            let Data1 = await resData1.json();  
    
            /* Getting the countries */
            /* Turning them into upper case because the integration needs it */
            let countries = Array.from(new Set(MyData.map((d) => {return d.country.toLowerCase();})));
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
                return [countries.indexOf(d.country.toLowerCase()), d.year, d["percentage-re-total"], d["percentage-hydropower-total"], d["percentage-wind-power-total"]]; 
            });

            MyData = MyData.filter((d) => {  return Data1.find(d1 => d1.country == countries[d[0]] && parseInt(d1.year) == d[1])}).map((d) => {
                return [d[0], d[1], d[2], d[3], d[4],
                        Data1.find(d1 => d1.country == countries[d[0]] && parseInt(d1.year) == d[1])["natality_totals"]
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
            Highcharts.chart('container-1', {
                chart: {
                    type: 'spline',
                    parallelCoordinates: true,
                    parallelAxes: {
                        lineWidth: 3
                    }
                },
                title: {
                    text: 'Energías renovables y natalidad'
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
                        'Número de nacimientos'
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

        async function loadGraph30() {
            console.log("Loading 30");
            /* Asking for the data to the back */
            const BASE_API_URL = "/api/v4/renewable-sources-stats";
            const BASE_API_URL_30 = "https://sos1920-30.herokuapp.com/api/v3/sugarconsume";

            const resData = await fetch(BASE_API_URL);
            const resData30 = await fetch(BASE_API_URL_30);
            let MyData = await resData.json();   
            let Data30 = await resData30.json();  
            /* Getting the countries */
            /* Turning them into upper case because the integration needs it */
            let years = Array.from(new Set(MyData.map((d) => {return d.year;})));
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
            
            let MeanData = [];

            years.filter((y) => { return Data30.find(d30 => d30.year == y); }).forEach((y) => {
                let totalSugar = Data30.filter((d) => { return d.year == y; }).map((d) => {return d["sugarconsume"];}).reduce((accumulator, currentValue) => accumulator + currentValue);


                let reAverrage = MyData.filter((d) => { return d.year == y; }).map((d) => {return d["percentage-re-total"];}).reduce((accumulator, currentValue) => accumulator + currentValue) 
                                / MyData.filter((d) => { return d.year == y; }).length;
                let hydropowerAverrage = MyData.filter((d) => { return d.year == y; }).map((d) => {return d["percentage-hydropower-total"];}).reduce((accumulator, currentValue) => accumulator + currentValue) 
                                / MyData.filter((d) => { return d.year == y; }).length;
                let windAverrage = MyData.filter((d) => { return d.year == y; }).map((d) => {return d["percentage-wind-power-total"];}).reduce((accumulator, currentValue) => accumulator + currentValue) 
                                / MyData.filter((d) => { return d.year == y; }).length;
                
                MeanData.push([y, reAverrage, hydropowerAverrage, windAverrage, totalSugar]);
            });

            /* 
            The following array turn this:
            [0, 2000, 0.0, 0.0, 0.0]
    
            into this:
    
            {name: "Country", data: [0, 2000, 0.0, 0.0, 0.0]}
            That is how the chart needs it
             */
             let ChartData = MeanData.map(function (set, i) {
                return {
                    name: set[0],
                    data: set,
                    shadow: false
                };
            });

            /* Setting the chart */
            Highcharts.chart('container-30', {
                chart: {
                    type: 'spline',
                    parallelCoordinates: true,
                    parallelAxes: {
                        lineWidth: 3
                    }
                },
                title: {
                    text: 'Energías renovables y azúcar consumido'
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
                        'Año',
                        'Porcentaje de uso de energías renovables',
                        'Porcentaje de uso de energías hidroeléctricas',
                        'Porcentaje de uso de energías eólica',
                        'Kilos de azúcar consumidos'
                    ],
                    offset: 10
                },
                yAxis: [,
                {
                    min: 2000,
                    tooltipValueFormat: '{value}'
                }, {
                    min: 0,
                    tooltipValueFormat: '{value} %'
                },
                {
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

        async function loadGraph23() {
            console.log("Loading 23");
            /* Asking for the data to the back */
            const BASE_API_URL = "/api/v4/renewable-sources-stats";
            const BASE_API_URL_23 = "/api/v2/cigarretes-sales";

            const resData = await fetch(BASE_API_URL);

            const resData23 = await fetch(BASE_API_URL_23);
            
            let MyData = await resData.json();   
            let Data23 = await resData23.json();  
    
            /* Getting the countries */
            /* Turning them into upper case because the integration needs it */
            let countries = Array.from(new Set(MyData.map((d) => {return d.country;})));
            let provinces = Array.from(new Set(Data23.map((d) => {return d.community;})));
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

            MyData = MyData.filter((d) => { return d.country == "Spain" && Data23.find(d4 => d4.year == d.year)}).map((d) => {
                return [countries.indexOf(d.country), d.year, d["percentage-re-total"], d["percentage-hydropower-total"], d["percentage-wind-power-total"]]; 
            });

            let ModifiedData = [];
            for (let i = 0; i < MyData.length; i++) {
                Data23.filter(d => d.year == MyData[i][1]).forEach((dataMatchesYear) => {
                    ModifiedData.push([MyData[i][0], provinces.indexOf(dataMatchesYear.community), MyData[i][1], MyData[i][2], MyData[i][3], MyData[i][4], dataMatchesYear["cigarrete_sale"]]);

                });   
                
                
            }
                
            /* 
            The following array turn this:
            [0, 2000, 0.0, 0.0, 0.0]
    
            into this:
    
            {name: "Country", data: [0, 2000, 0.0, 0.0, 0.0]}
            That is how the chart needs it
             */
            let ChartData = ModifiedData.map(function (set, i) {
                return {
                    name: countries[set[0]],
                    data: set,
                    shadow: false
                };
            });
            
            /* Setting the chart */
            Highcharts.chart('container-23', {
                chart: {
                    type: 'spline',
                    parallelCoordinates: true,
                    parallelAxes: {
                        lineWidth: 3
                    }
                },
                title: {
                    text: 'Energías renovables y tabaco'
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
                        'Provincias',
                        'Año',
                        'Porcentaje de uso de energías renovables',
                        'Porcentaje de uso de energías hidroeléctricas',
                        'Porcentaje de uso de energías eólica',
                        'Ventas de cigarrillos de tabaco'
                    ],
                    offset: 10
                },
                yAxis: [
                {
                    categories: countries,
                    tooltipValueFormat: '{value}'
                },
                {
                    categories: provinces,
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
                },
                {
                    min: 0,
                    tooltipValueFormat: '{value}'
                }],
                colors: ['rgba(129, 131, 202, 0.8)'],
                series: ChartData
            });
        }

        async function loadGraph25() {
            console.log("Loading 25");
            /* Asking for the data to the back */
            const BASE_API_URL = "/api/v4/renewable-sources-stats";
            const BASE_API_URL_25 = "/api/v2/happiness_rate";

            const resData = await fetch(BASE_API_URL);
            const resData25 = await fetch(BASE_API_URL_25);
            let MyData = await resData.json();   
            let Data25 = await resData25.json();  
    
            /* Getting the countries */
            /* Turning them into upper case because the integration needs it */
            let countries = Array.from(new Set(MyData.map((d) => {return d.country.toLowerCase();})));
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
                return [countries.indexOf(d.country.toLowerCase()), d.year, d["percentage-re-total"], d["percentage-hydropower-total"], d["percentage-wind-power-total"]]; 
            });

            MyData = MyData.filter((d) => {  return Data25.find(d25 => d25.country.toLowerCase() == countries[d[0]] && parseInt(d25.year) == d[1])}).map((d) => {
                return [d[0], d[1], d[2], d[3], d[4],
                        Data25.find(d25 => d25.country.toLowerCase() == countries[d[0]] && parseInt(d25.year) == d[1])["happinessRanking"]
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
            Highcharts.chart('container-25', {
                chart: {
                    type: 'spline',
                    parallelCoordinates: true,
                    parallelAxes: {
                        lineWidth: 3
                    }
                },
                title: {
                    text: 'Energías renovables y nivel de felicidad'
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
                        'Ranking en felicidad'
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

        async function loadGraph8() {
            console.log("Loading 8");
            /* Asking for the data to the back */
            const BASE_API_URL = "/api/v4/renewable-sources-stats";
            const BASE_API_URL_8 = "/api/v1/motogp-statistics";

            const resData = await fetch(BASE_API_URL);
            const resData8 = await fetch(BASE_API_URL_8);
            let MyData = await resData.json();  
            let Data8 = await resData8.json();  
    
            /* Getting the countries */
            /* Turning them into upper case because the integration needs it */
            let countries = Array.from(new Set(MyData.map((d) => {return d.country;})));
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
                return [countries.indexOf(d.country), d.year, d["percentage-re-total"], d["percentage-hydropower-total"], d["percentage-wind-power-total"]]; 
            });

            MyData = MyData.filter((d) => {  return Data8.find(d8 => d8.country == countries[d[0]])}).map((d) => {
                return [d[0], d[1], d[2], d[3], d[4],
                        Data8.find(d8 => d8.country == countries[d[0]] )["world_title"]
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
            Highcharts.chart('container-8', {
                chart: {
                    type: 'spline',
                    parallelCoordinates: true,
                    parallelAxes: {
                        lineWidth: 3
                    }
                },
                title: {
                    text: 'Energías renovables y motoGP'
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
                        'Títulos mundiales'
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



        async function loadGraphExt1() {
            console.log("Loading external api");
            /* Asking for the data to the back */
            const BASE_API_URL = "/api/v4/renewable-sources-stats";
            const BASE_API_URL_EXT = "https://restcountries.eu/rest/v2/all?fields=name;capital;area";

            const resData = await fetch(BASE_API_URL);
            const resDataExt = await fetch(BASE_API_URL_EXT);
            let MyData = await resData.json();   
            let DataExt = await resDataExt.json();  
    
            /* Getting the countries */
            /* Turning them into upper case because the integration needs it */
            let countries = Array.from(new Set(MyData.map((d) => {return d.country;})));
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
                return [countries.indexOf(d.country), d.year, d["percentage-re-total"], d["percentage-hydropower-total"], d["percentage-wind-power-total"]]; 
            });

            MyData = MyData.filter((d) => {  return DataExt.find(dext => dext.name == countries[d[0]])}).map((d) => {
                return [d[0], d[1], d[2], d[3], d[4],
                        DataExt.find(dext => dext.name == countries[d[0]])["area"]
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
            Highcharts.chart('container-ext1', {
                chart: {
                    type: 'spline',
                    parallelCoordinates: true,
                    parallelAxes: {
                        lineWidth: 3
                    }
                },
                title: {
                    text: 'Energías renovables y área'
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
                        'Área'
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

        async function loadGraphExt2() {
            console.log("Loading external api");
            /* Asking for the data to the back */
            const BASE_API_URL = "/api/v4/renewable-sources-stats";
            const BASE_API_URL_EXT = "/v1/Country/getCountries";

            const resData = await fetch(BASE_API_URL);
            const resDataExt = await fetch(BASE_API_URL_EXT);
            let MyData = await resData.json();   
            let DataExt = await resDataExt.json();
    
            /* Getting the countries */
            /* Turning them into upper case because the integration needs it */
            let countries = Array.from(new Set(MyData.map((d) => {return d.country;})));
            let currencies = Array.from(new Set(DataExt.Response.map((d) => {return d["CurrencyName"];})));

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
                return [countries.indexOf(d.country), d.year, d["percentage-re-total"], d["percentage-hydropower-total"], d["percentage-wind-power-total"]]; 
            });

            MyData = MyData.filter((d) => {  return DataExt.Response.find(dext => dext.Name == countries[d[0]])}).map((d) => {
                return [d[0], d[1], d[2], d[3], d[4],
                currencies.indexOf(DataExt.Response.find(dext => dext.Name == countries[d[0]])["CurrencyName"])
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
            Highcharts.chart('container-ext2', {
                chart: {
                    type: 'spline',
                    parallelCoordinates: true,
                    parallelAxes: {
                        lineWidth: 3
                    }
                },
                title: {
                    text: 'Energías renovables y monedas'
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
                        'Moneda'
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
                    tooltipValueFormat: '{value} %'
                },
                {
                    categories: currencies,
                    tooltipValueFormat: '{value}'
                }],
                colors: ['rgba(129, 131, 202, 0.8)'],
                series: ChartData
            });

            
            
        }
        
        async function loadGraphExt3() {
            console.log("Loading external api 3");
            /* Asking for the data to the back */
            const BASE_API_URL = "/api/v4/renewable-sources-stats";
            const BASE_API_URL_EXT = "https://coronavirus-19-api.herokuapp.com/countries";

            const resData = await fetch(BASE_API_URL);
            const resDataExt = await fetch(BASE_API_URL_EXT);
            let MyData = await resData.json();   
            let DataExt = await resDataExt.json();

    
            /* Getting the countries */
            /* Turning them into upper case because the integration needs it */
            let countries = Array.from(new Set(MyData.map((d) => {return d.country;})));

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

            /* We add up the data to avoid years */
            let SumData = [];
            countries.forEach((c) => {
                let retotal = MyData.filter((d) => { return d.country == c; }).map((d) => { return d["percentage-re-total"] }).reduce(function(a, b){ return a + b; });
                let hydropower = MyData.filter((d) => { return d.country == c; }).map((d) => { return d["percentage-hydropower-total"] }).reduce(function(a, b){ return a + b; });
                let windpower = MyData.filter((d) => { return d.country == c; }).map((d) => { return d["percentage-wind-power-total"] }).reduce(function(a, b){ return a + b; });
                SumData.push([countries.indexOf(c), retotal, hydropower, windpower]);



            });
            

            SumData = SumData.filter((d) => {  return DataExt.find(dext => dext.country == countries[d[0]])}).map((d) => {
                return [d[0], d[1], d[2], d[3],
                DataExt.find(dext => dext.country == countries[d[0]])["cases"]
            ]; 
            });




            /* 
            The following array turn this:
            [0, 2000, 0.0, 0.0, 0.0]
    
            into this:
    
            {name: "Country", data: [0, 2000, 0.0, 0.0, 0.0]}
            That is how the chart needs it
             */
             let ChartData = SumData.map(function (set, i) {
                return {
                    name: countries[set[0]],
                    data: set,
                    shadow: false
                };
            });
            
            /* Setting the chart */
            Highcharts.chart('container-ext3', {
                chart: {
                    type: 'spline',
                    parallelCoordinates: true,
                    parallelAxes: {
                        lineWidth: 3
                    }
                },
                title: {
                    text: 'Energías renovables y casos de coronavirus'
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
                        'Porcentaje de uso de energías renovables',
                        'Porcentaje de uso de energías hidroeléctricas',
                        'Porcentaje de uso de energías eólica',
                        'Total de casos'
                    ],
                    offset: 10
                },
                yAxis: [
                {
                    categories: countries,
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
        loadGraph4();
        loadGraph27();
        loadGraph5(); // [proxy] bookexports
        loadGraph22();
        loadGraph6(); // [proxy] lottery
        loadGraph1(); // [proxy] natality
        loadGraph30();
        loadGraph23(); // [proxy] cigarettes
        loadGraph25(); // [proxy] happiness rate
        loadGraph8(); // [proxy] motogp


        /* Externals API */
        loadGraphExt1();
        loadGraphExt2();
        loadGraphExt3();


</script>

<main>
    <div class="row">
        <div class="col-4">
          <div class="list-group" id="list-tab" role="tablist">
            <a class="list-group-item list-group-item-action active" id="list-home-list" data-toggle="list" href="#list-7" role="tab" aria-controls="home">Integración con importaciones de vegetales - 7</a>
            <a class="list-group-item list-group-item-action" id="list-profile-list" data-toggle="list" href="#list-27" role="tab" aria-controls="profile">Integración con calidad de vida (clima) - 27</a>
            <a class="list-group-item list-group-item-action" id="list-profile-list" data-toggle="list" href="#list-5" role="tab" aria-controls="profile">Integración con exportación de libros - 5</a>
            <a class="list-group-item list-group-item-action" id="list-profile-list" data-toggle="list" href="#list-4" role="tab" aria-controls="profile">Integración con número de coches - 4</a>
            <a class="list-group-item list-group-item-action" id="list-profile-list" data-toggle="list" href="#list-22" role="tab" aria-controls="profile">Integración con victorias de fórmula 1 - 22</a>
            <a class="list-group-item list-group-item-action" id="list-profile-list" data-toggle="list" href="#list-1" role="tab" aria-controls="profile">Integración con natalidad - 1 </a>
            <a class="list-group-item list-group-item-action" id="list-profile-list" data-toggle="list" href="#list-30" role="tab" aria-controls="profile">Integración con azúcar consumido - 30 </a>
            <a class="list-group-item list-group-item-action" id="list-profile-list" data-toggle="list" href="#list-23" role="tab" aria-controls="profile">Integración con tabaco - 23 </a>
            <a class="list-group-item list-group-item-action" id="list-profile-list" data-toggle="list" href="#list-25" role="tab" aria-controls="profile">Integración con nivel de felicidad - 25 </a>
            <a class="list-group-item list-group-item-action" id="list-profile-list" data-toggle="list" href="#list-8" role="tab" aria-controls="profile">Integración con motoGP - 8 </a>
            <a class="list-group-item list-group-item-action" id="list-profile-list" data-toggle="list" href="#list-6" role="tab" aria-controls="profile">Integración con loterías - 6</a>



            <a class="list-group-item list-group-item-action" id="list-profile-list" data-toggle="list" href="#list-ext1" role="tab" aria-controls="profile">Integración con API externa 1 </a>
            <a class="list-group-item list-group-item-action" id="list-profile-list" data-toggle="list" href="#list-ext2" role="tab" aria-controls="profile">Integración con API externa 2 </a>
            <a class="list-group-item list-group-item-action" id="list-profile-list" data-toggle="list" href="#list-ext3" role="tab" aria-controls="profile">Integración con API externa 3 </a>

        </div>
        </div>
        <div class="col-8">
          <div class="tab-content" id="nav-tabContent">
            <div class="tab-pane fade show active" id="list-7" role="tabpanel" aria-labelledby="list-home-list">
                <figure class="highcharts-figure">
                    <div id="container-7"></div>
                    <p class="highcharts-description">
                        Integración con el grupo 7.
                    </p>
                </figure>
            </div>
            <div class="tab-pane fade" id="list-27" role="tabpanel" aria-labelledby="list-profile-list">
                <figure class="highcharts-figure">
                    <div id="container-27"></div>
                    <p class="highcharts-description">
                        Integración con el grupo 27.
                    </p>
                </figure>
            </div>
            <div class="tab-pane fade" id="list-5" role="tabpanel" aria-labelledby="list-profile-list">
                <figure class="highcharts-figure">
                    <div id="container-5"></div>
                    <p class="highcharts-description">
                        Integración con el grupo 5.
                    </p>
                </figure>
            </div>
            <div class="tab-pane fade" id="list-4" role="tabpanel" aria-labelledby="list-profile-list">
                <figure class="highcharts-figure">
                    <div id="container-4"></div>
                    <p class="highcharts-description">
                        Integración con el grupo 4.
                    </p>
                </figure>
            </div>
            <div class="tab-pane fade" id="list-22" role="tabpanel" aria-labelledby="list-profile-list">
                <figure class="highcharts-figure">
                    <div id="container-22"></div>
                    <p class="highcharts-description">
                        Integración con el grupo 22.
                    </p>
                </figure>
            </div>
            <div class="tab-pane fade" id="list-1" role="tabpanel" aria-labelledby="list-profile-list">
                <figure class="highcharts-figure">
                    <div id="container-1"></div>
                    <p class="highcharts-description">
                        Integración con el grupo 1.
                    </p>
                </figure>
            </div>
            <div class="tab-pane fade" id="list-30" role="tabpanel" aria-labelledby="list-profile-list">
                <figure class="highcharts-figure">
                    <div id="container-30"></div>
                    <p class="highcharts-description">
                        Integración con el grupo 30.
                    </p>
                </figure>
            </div>
            <div class="tab-pane fade" id="list-23" role="tabpanel" aria-labelledby="list-profile-list">
                <figure class="highcharts-figure">
                    <div id="container-23"></div>
                    <p class="highcharts-description">
                        Integración con el grupo 23.
                    </p>
                </figure>
            </div>
            <div class="tab-pane fade" id="list-25" role="tabpanel" aria-labelledby="list-profile-list">
                <figure class="highcharts-figure">
                    <div id="container-25"></div>
                    <p class="highcharts-description">
                        Integración con el grupo 25.
                    </p>
                </figure>
            </div>
            <div class="tab-pane fade" id="list-8" role="tabpanel" aria-labelledby="list-profile-list">
                <figure class="highcharts-figure">
                    <div id="container-8"></div>
                    <p class="highcharts-description">
                        Integración con el grupo 8.
                    </p>
                </figure>
            </div>
            <div class="tab-pane fade" id="list-6" role="tabpanel" aria-labelledby="list-profile-list">
                <figure class="highcharts-figure">
                    <div id="container-6"></div>
                    <p class="highcharts-description">
                        Integración con el grupo 6.
                    </p>
                </figure>
            </div>
            
            <div class="tab-pane fade" id="list-ext1" role="tabpanel" aria-labelledby="list-profile-list">
                <figure class="highcharts-figure">
                    <div id="container-ext1"></div>
                    <p class="highcharts-description">
                        Integración con la una API externa que proporciona el área (en kilómetros cuadrados) de los países.
                        
                    </p>
                </figure>
            </div>
            <div class="tab-pane fade" id="list-ext2" role="tabpanel" aria-labelledby="list-profile-list">
                <figure class="highcharts-figure">
                    <div id="container-ext2"></div>
                    <p class="highcharts-description">
                        Integración con la una API externa que proporciona la moneda utilizada de los países.
                        
                    </p>
                </figure>
            </div>
            <div class="tab-pane fade" id="list-ext3" role="tabpanel" aria-labelledby="list-profile-list">
                <figure class="highcharts-figure">
                    <div id="container-ext3"></div>
                    <p class="highcharts-description">
                        Integración con la una API externa que proporciona datos del coronavirus por países.
                        
                    </p>
                </figure>
            </div>
          </div>
        </div>
      </div>
      <p></p>
    <Button outline color="secondary" on:click="{pop}"> <i class="fas fa-arrow-circle-left"></i> Atrás </Button>
</main>