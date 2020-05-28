<script>
    import Button from "sveltestrap/src/Button.svelte";
    import {
        pop
    } from "svelte-spa-router";

    const BASE_API_URL = "/api/v3/plugin-vehicles-stats";

    async function loadGraph01(){
    
    const BASE_API_URL_01 = "/api/v2/emigrants-stats";

    const resData = await fetch(BASE_API_URL);
    const resData01 = await fetch(BASE_API_URL_01);
    let MyData = await resData.json();
    let Data01 = await resData01.json();

    /*
                Sus Datos:
    }
        "country": "spain",
        "year": 2017,
        "em_man": 609615,
        "em_woman": 736247,
        "em_totals": 1345862
    }
                Mis Datos:
    { 
        "country": "Japan",
        "year": 2018,
        "pev-stock": 257363,
        "annual-sale": 52013,
        "cars-per-1000": 2.0
    }
    */

    let dataPlugin = MyData.map((d) => {
        let res = {
            name: d.country,
            value: d["cars-per-1000"]
        };
        return res;
    });

    let dataAPI01 = Data01.filter((d) => {return d.year==2017;}).map((d) => {
        
        let res = {
            name: d.country,
            value: d.em_totals
        }
        return res;
    });

    let datos = 
    [
        {
            name: "Porcentaje de coche eléctricos cada 1000 personas.",
            data: dataPlugin
        },
        {
            name: "Emigrantes totales",
            data: dataAPI01
        }
    ];

    Highcharts.chart('container01', {
        chart: {
            type: 'packedbubble',
            height: '100%'
        },
        title: {
            text: 'Integración con el grupo 01.'
        },
        tooltip: {
            useHTML: true,
            pointFormat: '<b>{point.name}:</b> {point.value}'
        },
        plotOptions: {
            packedbubble: {
            minSize: '20%',
            maxSize: '100%',
            zMin: 0,
            zMax: 1000,
            layoutAlgorithm: {
                gravitationalConstant: 0.05,
                splitSeries: true,
                seriesInteraction: false,
                dragBetweenSeries: true,
                parentNodeLimit: true
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

    async function loadGraph04(){
    
        const BASE_API_URL_04 = "https://sos1920-04.herokuapp.com/api/v1/roads/";

        const resData = await fetch(BASE_API_URL);
        const resData04 = await fetch(BASE_API_URL_04);
        let MyData = await resData.json();
        let Data04 = await resData04.json();

        /*
                    Sus Datos:
        {
            "province": "Madrid",
            "year": 2015,
            "oneway": 2347,
            "multipleway": 208,
            "dualCarriagewayAndHighway": 622,
            "highwayWithToll": 161,
            "total": 3338
        }
                    Mis Datos:
        { 
            "country": "Japan",
            "year": 2018,
            "pev-stock": 257363,
            "annual-sale": 52013,
            "cars-per-1000": 2.0
        }
        */

        let dataPlugin = MyData.map((d) => {
            let res = {
                name: d.country,
                value: d["cars-per-1000"]
            };
            return res;
        });

        let dataAPI04 = Data04.map((d) => {
            let res = {
                name: d["province"],
                value: d["total"]
            };
            return res;
        });

        let datos = 
        [
            {
                name: "Porcentaje de coche eléctricos cada 1000 personas.",
                data: dataPlugin
            },
            {
                name: "Número total de carreteras, autopistas y autovías.",
                data: dataAPI04
            }
        ];

        Highcharts.chart('container04', {
            chart: {
                type: 'packedbubble',
                height: '100%'
            },
            title: {
                text: 'Integración con el grupo 04.'
            },
            tooltip: {
                useHTML: true,
                pointFormat: '<b>{point.name}:</b> {point.value}'
            },
            plotOptions: {
                packedbubble: {
                minSize: '20%',
                maxSize: '100%',
                zMin: 0,
                zMax: 1000,
                layoutAlgorithm: {
                    gravitationalConstant: 0.05,
                    splitSeries: true,
                    seriesInteraction: false,
                    dragBetweenSeries: true,
                    parentNodeLimit: true
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
        
        const BASE_API_URL_05 = "/api/v1/life_expectancies";

        const resData = await fetch(BASE_API_URL);
        const resData05 = await fetch(BASE_API_URL_05);
        let MyData = await resData.json();
        let Data05 = await resData05.json();
        /*
                    Sus Datos:
        {
            "country": "france",
            "year": 2015,
            "women_life_expectancy": 85.6,
            "men_life_expectancy": 79.2,
            "average_life_expectancy": 82.4
        }
                    Mis Datos:
        { 
            "country": "Japan",
            "year": 2018,
            "pev-stock": 257363,
            "annual-sale": 52013,
            "cars-per-1000": 2.0
        }
        */

        let dataPlugin = MyData.map((d) => {
            let res = {
                name: d.country,
                value: d["cars-per-1000"]
            };
            return res;
        });

        let dataAPI05 = Data05.map((d) => {
            let res = {
                name: d.country,
                value: d["average_life_expectancy"]
            };
            return res;
        });

        let datos = 
        [
            {
                name: "Porcentaje de coche eléctricos cada 1000 personas.",
                data: dataPlugin
            },
            {
                name: "Esperanza de vida media entre hombres y mujeres",
                data: dataAPI05
            }
        ];

        Highcharts.chart('container05', {
            chart: {
                type: 'packedbubble',
                height: '100%'
            },
            title: {
                text: 'Integración con el grupo 05.'
            },
            tooltip: {
                useHTML: true,
                pointFormat: '<b>{point.name}:</b> {point.value}'
            },
            plotOptions: {
                packedbubble: {
                minSize: '20%',
                maxSize: '100%',
                zMin: 0,
                zMax: 1000,
                layoutAlgorithm: {
                    gravitationalConstant: 0.05,
                    splitSeries: true,
                    seriesInteraction: false,
                    dragBetweenSeries: true,
                    parentNodeLimit: true
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

    async function loadGraph06(){
    
        const BASE_API_URL_06 = "/api/v1/not-hospitalized-stats";

        const resData = await fetch(BASE_API_URL);
        const resData06 = await fetch(BASE_API_URL_06);
        let MyData = await resData.json();
        let Data06 = await resData06.json();
        /*
                    Sus Datos:
        
        }
            "province": "Tarragona",
            "year": 1995,
            "total": 1676,
            "interurban": 1044,
            "urban": 632
        }
                    Mis Datos:
        { 
            "country": "Japan",
            "year": 2018,
            "pev-stock": 257363,
            "annual-sale": 52013,
            "cars-per-1000": 2.0
        }
        */

        let dataPlugin = MyData.map((d) => {
            let res = {
                name: d.country,
                value: d["cars-per-1000"]
            };
            return res;
        });

        let dataAPI06 = Data06.map((d) => {
            let res = {
                name: d.province,
                value: d.total
            };
            return res;
        });

        let datos = 
        [
            {
                name: "Porcentaje de coche eléctricos cada 1000 personas.",
                data: dataPlugin
            },
            {
                name: "Número total de vías urbanas e interurbanas.",
                data: dataAPI06
            }
        ];

        Highcharts.chart('container06', {
            chart: {
                type: 'packedbubble',
                height: '100%'
            },
            title: {
                text: 'Integración con el grupo 06.'
            },
            tooltip: {
                useHTML: true,
                pointFormat: '<b>{point.name}:</b> {point.value}'
            },
            plotOptions: {
                packedbubble: {
                minSize: '20%',
                maxSize: '100%',
                zMin: 0,
                zMax: 1000,
                layoutAlgorithm: {
                    gravitationalConstant: 0.05,
                    splitSeries: true,
                    seriesInteraction: false,
                    dragBetweenSeries: true,
                    parentNodeLimit: true
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

    async function loadGraph07(){
        
        const BASE_API_URL_07 = "https://sos1920-07.herokuapp.com/api/v2/imports";

        const resData = await fetch(BASE_API_URL);
        const resData07 = await fetch(BASE_API_URL_07);
        let MyData = await resData.json();
        let Data07 = await resData07.json();
        /*
                    Sus Datos:
        }
            "country": "canada",
            "year": 2005,
            "gdamalt": 584620,
            "gdabarley": 50979,
            "gdaoat": 1466303,
            "gdawaste": 26325,
            "gdaethylalcohol": 99284
        }
                    Mis Datos:
        { 
            "country": "Japan",
            "year": 2018,
            "pev-stock": 257363,
            "annual-sale": 52013,
            "cars-per-1000": 2.0
        }
        */

        let dataPlugin = MyData.map((d) => {
            let res = {
                name: d.country,
                value: d["cars-per-1000"]
            };
            return res;
        });

        let dataAPI07 = Data07.filter((d) => {return d.year==2000 && d.country != "total";}).map((d) => {
                let res = {
                    name: d.country,
                    value: d.gdaethylalcohol
                };
            
            return res;
        });

        let datos = 
        [
            {
                name: "Porcentaje de coche eléctricos cada 1000 personas.",
                data: dataPlugin
            },
            {
                name: "Alcohol total importado en el año 2000",
                data: dataAPI07
            }
        ];

        Highcharts.chart('container07', {
            chart: {
                type: 'packedbubble',
                height: '100%'
            },
            title: {
                text: 'Integración con el grupo 07.'
            },
            tooltip: {
                useHTML: true,
                pointFormat: '<b>{point.name}:</b> {point.value}'
            },
            plotOptions: {
                packedbubble: {
                minSize: '20%',
                maxSize: '100%',
                zMin: 0,
                zMax: 1000,
                layoutAlgorithm: {
                    gravitationalConstant: 0.05,
                    splitSeries: true,
                    seriesInteraction: false,
                    dragBetweenSeries: true,
                    parentNodeLimit: true
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

    async function loadGraph08(){
    
        const BASE_API_URL_08 = "/api/v1/electricity-produced-stats/loadInitialData()";

        const resData = await fetch(BASE_API_URL);
        const resData08 = await fetch(BASE_API_URL_08);
        let MyData = await resData.json();
        let Data08 = await resData08.json();
        /*
                    Sus Datos:
        {
            "country": "EEUU",
            "state": "Florida",
            "year": 2018,
            "hydro": 232574,
            "solar": 2412067,
            "coal": 30272201
        }
                    Mis Datos:
        { 
            "country": "Japan",
            "year": 2018,
            "pev-stock": 257363,
            "annual-sale": 52013,
            "cars-per-1000": 2.0
        }
        */

        let dataPlugin = MyData.map((d) => {
            let res = {
                name: d.country,
                value: d["cars-per-1000"]
            };
            return res;
        });

        let dataAPI08_1 = Data08.map((d) => {
                let res = {
                    name: d.state,
                    value: d.hydro
                };
            return res;
        });

        let dataAPI08_2 = Data08.map((d) => {
                let res = {
                    name: d.state,
                    value: d.solar
                };
            return res;
        });

        let dataAPI08_3 = Data08.map((d) => {
                let res = {
                    name: d.state,
                    value: d.coal
                };
            return res;
        });

        let datos = 
        [
            {
                name: "Porcentaje de coche eléctricos cada 1000 personas en el año 2018.",
                data: dataPlugin
            },
            {
                name: "Energía Hidroeléctrica producida en EEUU en el año 2018",
                data: dataAPI08_1
            },
            {
                name: "Energía Solar producida en EEUU en el año 2018",
                data: dataAPI08_2
            },
            {
                name: "Energía por combustión de Carbón producida en EEUU en el año 2018",
                data: dataAPI08_3
            }
        ];

        Highcharts.chart('container08', {
            chart: {
                type: 'packedbubble',
                height: '100%'
            },
            title: {
                text: 'Integración con el grupo 08.'
            },
            tooltip: {
                useHTML: true,
                pointFormat: '<b>{point.name}:</b> {point.value}'
            },
            plotOptions: {
                packedbubble: {
                minSize: '20%',
                maxSize: '100%',
                zMin: 0,
                zMax: 1000,
                layoutAlgorithm: {
                    gravitationalConstant: 0.05,
                    splitSeries: true,
                    seriesInteraction: false,
                    dragBetweenSeries: true,
                    parentNodeLimit: true
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

    async function loadGraph12(){
    
        const BASE_API_URL_12 = "https://sos1920-12.herokuapp.com/api/v2/overdose-deaths";

        const resData = await fetch(BASE_API_URL);
        const resData12 = await fetch(BASE_API_URL_12);
        let MyData = await resData.json();
        let Data12 = await resData12.json();
        /*
                    Sus Datos:
        {
            "country": "France",
            "year": 2011,
            "death_male": 249,
            "death_female": 91,
            "death_total": 340,
            "mean_age": 45.7
        }
                    Mis Datos:
        { 
            "country": "Japan",
            "year": 2018,
            "pev-stock": 257363,
            "annual-sale": 52013,
            "cars-per-1000": 2.0
        }
        */

        let dataPlugin = MyData.map((d) => {
            let res = {
                name: d.country,
                value: d["cars-per-1000"]
            };
            return res;
        });

        let dataAPI12 = Data12.filter((d) => {return d.year==2017;}).map((d) => {
                let res = {
                    name: d.country,
                    value: d["death_total"]
                };
            return res;
        });

        let datos = 
        [
            {
                name: "Porcentaje de coche eléctricos cada 1000 personas en el año 2018.",
                data: dataPlugin
            },
            {
                name: "Número total de muertes por sobredosis en el año 2017",
                data: dataAPI12
            }
        ];

        Highcharts.chart('container12', {
            chart: {
                type: 'packedbubble',
                height: '100%'
            },
            title: {
                text: 'Integración con el grupo 12.'
            },
            tooltip: {
                useHTML: true,
                pointFormat: '<b>{point.name}:</b> {point.value}'
            },
            plotOptions: {
                packedbubble: {
                minSize: '20%',
                maxSize: '100%',
                zMin: 0,
                zMax: 1000,
                layoutAlgorithm: {
                    gravitationalConstant: 0.05,
                    splitSeries: true,
                    seriesInteraction: false,
                    dragBetweenSeries: true,
                    parentNodeLimit: true
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
    
        const BASE_API_URL_23 = "https://sos1920-23.herokuapp.com/api/v2/fires-stats/";

        const resData = await fetch(BASE_API_URL);
        const resData23 = await fetch(BASE_API_URL_23);
        let MyData = await resData.json();
        let Data23 = await resData23.json();
        /*
                    Sus Datos:
        {
            "community": "castilla-la-mancha",
            "year": 2007,
            "total_fire": 694,
            "forest_area": 2026.46,
            "non_forest_area": 1068.96
        }
                    Mis Datos:
        { 
            "country": "Japan",
            "year": 2018,
            "pev-stock": 257363,
            "annual-sale": 52013,
            "cars-per-1000": 2.0
        }
        */

        let dataPlugin = MyData.map((d) => {
            let res = {
                name: d.country,
                value: d["cars-per-1000"]
            };
            return res;
        });

        let dataAPI23 = Data23.filter((d) => {return d.year==2007;}).map((d) => {
                let res = {
                    name: d.community,
                    value: d["total_fire"]
                };
            return res;
        });

        let datos = 
        [
            {
                name: "Porcentaje de coche eléctricos cada 1000 personas.",
                data: dataPlugin
            },
            {
                name: "Número de incendios totales en España en el año 2007",
                data: dataAPI23
            }
        ];

        Highcharts.chart('container23', {
            chart: {
                type: 'packedbubble',
                height: '100%'
            },
            title: {
                text: 'Integración con el grupo 23.'
            },
            tooltip: {
                useHTML: true,
                pointFormat: '<b>{point.name}:</b> {point.value}'
            },
            plotOptions: {
                packedbubble: {
                minSize: '20%',
                maxSize: '100%',
                zMin: 0,
                zMax: 1000,
                layoutAlgorithm: {
                    gravitationalConstant: 0.05,
                    splitSeries: true,
                    seriesInteraction: false,
                    dragBetweenSeries: true,
                    parentNodeLimit: true
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

    async function loadGraph24(){
    
        const BASE_API_URL_24 = "https://sos1920-24.herokuapp.com/api/v2/atc-stats";

        const resData = await fetch(BASE_API_URL);
        const resData24 = await fetch(BASE_API_URL_24);
        let MyData = await resData.json();
        let Data24 = await resData24.json();
        /*
                    Sus Datos:
        {
            "aut_com": "Andalucia",
            "year": 2018,
            "espce": 757.2,
            "yaq": 757,
            "obu": 757
        }
                    Mis Datos:
        { 
            "country": "Japan",
            "year": 2018,
            "pev-stock": 257363,
            "annual-sale": 52013,
            "cars-per-1000": 2.0
        }
        */

        let dataPlugin = MyData.map((d) => {
            let res = {
                name: d.country,
                value: d["cars-per-1000"]
            };
            return res;
        });

        let dataAPI24 = Data24.map((d) => {
            let res = {
                name: d["aut_com"],
                //value: (d["espce"] / 10) //Los divido entre 10 para obtener una mejor visualización.
                value: d["espce"]
            };
            return res;
        });

        let datos = 
        [
            {
                name: "Porcentaje de coche eléctricos cada 1000 personas en el año 2018",
                data: dataPlugin
            },
            {
                name: "Coste medio de la matricula universitaria en el año 2018",
                data: dataAPI24
            }
        ];

        Highcharts.chart('container24', {
            chart: {
                type: 'packedbubble',
                height: '100%'
            },
            title: {
                text: 'Integración con el grupo 24.'
            },
            tooltip: {
                useHTML: true,
                pointFormat: '<b>{point.name}:</b> {point.value}'
            },
            plotOptions: {
                packedbubble: {
                minSize: '20%',
                maxSize: '100%',
                zMin: 0,
                zMax: 1000,
                layoutAlgorithm: {
                    gravitationalConstant: 0.05,
                    splitSeries: true,
                    seriesInteraction: false,
                    dragBetweenSeries: true,
                    parentNodeLimit: true
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

    async function loadGraph27(){
    
        const BASE_API_URL_27 = "https://sos1920-27.herokuapp.com/api/v2/spc-stats";

        const resData = await fetch(BASE_API_URL);
        const resData27 = await fetch(BASE_API_URL_27);
        let MyData = await resData.json();
        let Data27 = await resData27.json();
        /*
                    Sus Datos:
        {
            "country": "cameroon",                       
            "both_sex": 19.5,
            "male_rank": 13,
            "male_number": 26.9,
            "female_rank": 10,
            "female_number": 12.5,
            "ratio": 2.15,
            "year": 2013,
            "continent": "africa"
        }
                    Mis Datos:
        { 
            "country": "Japan",
            "year": 2018,
            "pev-stock": 257363,
            "annual-sale": 52013,
            "cars-per-1000": 2.0
        }
        */

        let dataPlugin = MyData.map((d) => {
			let res = {
				name: d.country,
				value: d["cars-per-1000"]
			};
			return res;
        });

        let dataAPI27 = Data27.filter((d) => {return d.year==2013;}).map((d) => {
                let res = {
                    name: d.country,
                    value: d["both_sex"]
                };
			return res;
        });

        let datos = 
		[
			{
				name: "Porcentaje de coche eléctricos cada 1000 personas en el año 2018",
				data: dataPlugin
			},
			{
				name: "Porcentaje de suicidios en el año 2013",
				data: dataAPI27
			}
		];

        Highcharts.chart('container27', {
            chart: {
                type: 'packedbubble',
                height: '100%'
            },
            title: {
                text: 'Integración con el grupo 27.'
            },
            tooltip: {
                useHTML: true,
                pointFormat: '<b>{point.name}:</b> {point.value}%'
            },
            plotOptions: {
                packedbubble: {
                minSize: '20%',
                maxSize: '100%',
                zMin: 0,
                zMax: 1000,
                layoutAlgorithm: {
                    gravitationalConstant: 0.05,
                    splitSeries: true,
                    seriesInteraction: false,
                    dragBetweenSeries: true,
                    parentNodeLimit: true
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
    
    async function loadGraph28(){
    
        const BASE_API_URL_28 = "/api/v1/gce";

        const resData = await fetch(BASE_API_URL);
        const resData28 = await fetch(BASE_API_URL_28);
        let MyData = await resData.json();
        let Data28 = await resData28.json();
        /*
                    Sus Datos:
        {
            "country": "Germany",
            "year": 2010,
            "gce_country": 811861,
            "gce_per_capita": 10.09,
            "gce_cars": 6311318
        }
                    Mis Datos:
        { 
            "country": "Japan",
            "year": 2018,
            "pev-stock": 257363,
            "annual-sale": 52013,
            "cars-per-1000": 2.0
        }
        */

        let dataPlugin = MyData.map((d) => {
            let res = {
                name: d.country,
                value: d["cars-per-1000"]
            };
            return res;
        });

        let dataAPI28 = Data28.filter((d) => {return d.year==2014;}).map((d) => {
                let res = {
                    name: d.country,
                    value: d["gce_per_capita"]
                };
            return res;
        });

        let datos = 
        [
            {
                name: "Porcentaje de coche eléctricos cada 1000 personas en el año 2018",
                data: dataPlugin
            },
            {
                name: "Porcentaje per capital en el año 2014",
                data: dataAPI28
            }
        ];

        Highcharts.chart('container28', {
            chart: {
                type: 'packedbubble',
                height: '100%'
            },
            title: {
                text: 'Integración con el grupo 28.'
            },
            tooltip: {
                useHTML: true,
                pointFormat: '<b>{point.name}:</b> {point.value}%'
            },
            plotOptions: {
                packedbubble: {
                minSize: '20%',
                maxSize: '100%',
                zMin: 0,
                zMax: 1000,
                layoutAlgorithm: {
                    gravitationalConstant: 0.05,
                    splitSeries: true,
                    seriesInteraction: false,
                    dragBetweenSeries: true,
                    parentNodeLimit: true
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

    async function loadGraphExternal01(){
    
        const BASE_API_URL_External01 = "/v3/launches";

        const resData = await fetch(BASE_API_URL);
        const resDataExternal01 = await fetch(BASE_API_URL_External01);
        let MyData = await resData.json();
        let DataExternal01 = await resDataExternal01.json();
        /*
                    Sus Datos: (HAY BASTANTES MÁS, PERO DENTRO DE ESTOS ESTÁN LOS QUE YO USARE)
        }
        
            "flight_number": 1,
            "mission_name": "FalconSat",
            "mission_id": [
            
            ],
            
            "launch_year": "2006",
            
            "rocket_id": "falcon1",
            "rocket_name": "Falcon 1",
            "rocket_type": "Merlin A",
            
            "second_stage": {
                "block": 1,
                "payloads": [
                {
                    "payload_id": "FalconSAT-2",
                    "norad_id": [
                    
                    ],
                    "reused": false,
                    "customers": [
                    "DARPA"
                    ],
                    "nationality": "United States",
                    "payload_mass_kg": 20
            }
                    Mis Datos:
        { 
            "country": "Japan",
            "year": 2018,
            "pev-stock": 257363,
            "annual-sale": 52013,
            "cars-per-1000": 2.0
        }
        */

        let dataPlugin = MyData.map((d) => {
            let res = {
                name: d.country,
                value: d["cars-per-1000"]
            };
            return res;
        });

        let dataAPIExternal01 = DataExternal01.map((d) =>  {
            console.log(d["second_stage"]);
            let res = {
                name: d.second_stage.payloads.nationality,
                value: d.second_stage.payloads.payload_mass_kg
            };
            return res;
        });

        let datos = 
        [
            {
                name: "Porcentaje de coche eléctricos cada 1000 personas.",
                data: dataPlugin
            },
            {
                name: "Número total de carreteras, autopistas y autovías.",
                data: dataAPIExternal01
            }
        ];

        Highcharts.chart('container', {
            chart: {
                type: 'packedbubble',
                height: '100%'
            },
            title: {
                text: 'Integración con api externa satex.'
            },
            tooltip: {
                useHTML: true,
                pointFormat: '<b>{point.name}:</b> {point.value}'
            },
            plotOptions: {
                packedbubble: {
                minSize: '20%',
                maxSize: '100%',
                zMin: 0,
                zMax: 1000,
                layoutAlgorithm: {
                    gravitationalConstant: 0.05,
                    splitSeries: true,
                    seriesInteraction: false,
                    dragBetweenSeries: true,
                    parentNodeLimit: true
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

    loadGraph01(); //Implementado mediante proxy
    loadGraph04(); //Implementado mediante cors
    loadGraph05(); //Implementado mediante proxy
    loadGraph06(); //Implementado mediante proxy
    loadGraph07(); //Implementado mediante cors
    loadGraph08(); //Implementado mediante proxy
    loadGraph12(); //Implementado mediante cors
    loadGraph23(); //Implementado mediante cors
    loadGraph24(); //Implementado mediante cors
    loadGraph27(); //Implementado mediante cors
    loadGraph28(); //Implementado mediante proxy
    //loadGraphExternal01();
</script>


<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/highcharts-more.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js"></script>

</svelte:head>
    
<main>
    <!--
    <figure class="highcharts-figure">
        <div id="container-01"></div>
        <p>

        </p>
        <p class="highcharts-description">
            Representación con el grupo 01.
        </p>
    </figure>
    -->

    <div class="row">
        <div class="col-4">
          <div class="list-group" id="list-tab" role="tablist">

            <a class="list-group-item list-group-item-action active" id="list-home-list" data-toggle="list" href="#list-01" role="tab" aria-controls="home">Integración con 01 emigrants-stats</a>
            <a class="list-group-item list-group-item-action" id="list-profile-list" data-toggle="list" href="#list-04" role="tab" aria-controls="profile">Integración con 04</a>
            <a class="list-group-item list-group-item-action" id="list-profile-list" data-toggle="list" href="#list-05" role="tab" aria-controls="profile">Integración con 05</a>
            <a class="list-group-item list-group-item-action" id="list-profile-list" data-toggle="list" href="#list-06" role="tab" aria-controls="profile">Integración con 06</a>
            <a class="list-group-item list-group-item-action" id="list-profile-list" data-toggle="list" href="#list-07" role="tab" aria-controls="profile">Integración con 07</a>
            <a class="list-group-item list-group-item-action" id="list-profile-list" data-toggle="list" href="#list-08" role="tab" aria-controls="profile">Integración con 08</a>
            <a class="list-group-item list-group-item-action" id="list-profile-list" data-toggle="list" href="#list-12" role="tab" aria-controls="profile">Integración con 12</a>
            <a class="list-group-item list-group-item-action" id="list-profile-list" data-toggle="list" href="#list-23" role="tab" aria-controls="profile">Integración con 23</a>
            <a class="list-group-item list-group-item-action" id="list-profile-list" data-toggle="list" href="#list-24" role="tab" aria-controls="profile">Integración con 24</a>
            <a class="list-group-item list-group-item-action" id="list-profile-list" data-toggle="list" href="#list-27" role="tab" aria-controls="profile">Integración con 27</a>
            <a class="list-group-item list-group-item-action" id="list-profile-list" data-toggle="list" href="#list-28" role="tab" aria-controls="profile">Integración con 28</a>
            
        </div>
        </div>
        <div class="col-8">
          <div class="tab-content" id="nav-tabContent">
            <div class="tab-pane fade show active" id="list-01" role="tabpanel" aria-labelledby="list-home-list">
                <figure class="highcharts-figure">
                    <div id="container01"></div>
                    <p class="highcharts-description">
                        Integración con el grupo 01, la integración está realizada con emigrantes totales en todo el mundo
                    </p>
                </figure>
            </div>
            <div class="tab-pane fade" id="list-04" role="tabpanel" aria-labelledby="list-profile-list">
                <figure class="highcharts-figure">
                    <div id="container04"></div>
                    <p class="highcharts-description">
                        Integra la 04.
                    </p>
                </figure>
            </div>
            <div class="tab-pane fade" id="list-05" role="tabpanel" aria-labelledby="list-profile-list">
                <figure class="highcharts-figure">
                    <div id="container05"></div>
                    <p class="highcharts-description">
                        Integra la 05.
                    </p>
                </figure>
            </div>
            <div class="tab-pane fade" id="list-06" role="tabpanel" aria-labelledby="list-profile-list">
                <figure class="highcharts-figure">
                    <div id="container06"></div>
                    <p class="highcharts-description">
                        Integra la 06.
                    </p>
                </figure>
            </div>
            <div class="tab-pane fade" id="list-07" role="tabpanel" aria-labelledby="list-profile-list">
                <figure class="highcharts-figure">
                    <div id="container07"></div>
                    <p class="highcharts-description">
                        Integra la 07.
                    </p>
                </figure>
            </div>
            <div class="tab-pane fade" id="list-08" role="tabpanel" aria-labelledby="list-profile-list">
                <figure class="highcharts-figure">
                    <div id="container08"></div>
                    <p class="highcharts-description">
                        Integra la 08.
                    </p>
                </figure>
            </div>
            <div class="tab-pane fade" id="list-12" role="tabpanel" aria-labelledby="list-profile-list">
                <figure class="highcharts-figure">
                    <div id="container12"></div>
                    <p class="highcharts-description">
                        Integra la 12.
                    </p>
                </figure>
            </div>
            <div class="tab-pane fade" id="list-23" role="tabpanel" aria-labelledby="list-profile-list">
                <figure class="highcharts-figure">
                    <div id="container23"></div>
                    <p class="highcharts-description">
                        Integra la 23.
                    </p>
                </figure>
            </div>
            <div class="tab-pane fade" id="list-24" role="tabpanel" aria-labelledby="list-profile-list">
                <figure class="highcharts-figure">
                    <div id="container24"></div>
                    <p class="highcharts-description">
                        Integra la 24.
                    </p>
                </figure>
            </div>
            <div class="tab-pane fade" id="list-27" role="tabpanel" aria-labelledby="list-profile-list">
                <figure class="highcharts-figure">
                    <div id="container27"></div>
                    <p class="highcharts-description">
                        Integra la 27.
                    </p>
                </figure>
            </div>
            <div class="tab-pane fade" id="list-28" role="tabpanel" aria-labelledby="list-profile-list">
                <figure class="highcharts-figure">
                    <div id="container28"></div>
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