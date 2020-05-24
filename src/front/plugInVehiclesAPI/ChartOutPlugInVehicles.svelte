<script>

    import {
            pop
    } from "svelte-spa-router";
    
    import Button from "sveltestrap/src/Button.svelte";

    async function loadGraph () {

        const BASE_API_URL = "/api/v2/plugin-vehicles-stats";
        let MyData = [];

        const resData = await fetch(BASE_API_URL);
        MyData = await resData.json();
       
        let countries = [];
        let pevStock = [];
        let annualSale = [];
        let carsPer1000 = [];

        let pais = [];
        let dato = [];

        for(let i=0;i<countries.length;i++){}
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

        for(let i=0;i<countries.length;i++){
            var chart = bb.generate({
                
                data: {
                    
                    x: "x",
                    columns: [
                    ["x", countries[i]],
                    ["Porcentaje", carsPer1000[i]]
                    ],
                    type: "bar"
                },
                axis: {
                    x: {
                    type: "category",
                    tick: {
                        rotate: 75,
                        multiline: false,
                        tooltip: true
                    },
                    height: 130
                    }
                },
                bindto: "#rotateXAxisTickText"
                });
        
            }
    }

</script>

<svelte:head>

    

    <script src="https://d3js.org/d3.v5.min.js" on:load={loadGraph}> </script>
    <script src="libraries/billboard.js" on:load={loadGraph}></script>

</svelte:head>

<main>
    
    <div id="rotateXAxisTickText"></div>
    <p></p>
    <p>Representación gráfica realizada con billboards que nos muestra el porcentaje de coches electricos en el año 2018</p>
    <Button outline color="secondary" on:click="{pop}"><i class="fas fa-arrow-circle-left"></i> Atrás</Button>

</main>