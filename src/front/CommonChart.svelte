<script>
	import {
            pop
	} from "svelte-spa-router";
    
    import Button from "sveltestrap/src/Button.svelte";

	async function loadGraph() {
		const BASE_API_URL_1 = "/api/v2/oil-coal-nuclear-energy-consumption-stats";
		const BASE_API_URL_2 = "/api/v2/renewable-sources-stats";
		const BASE_API_URL_3 = "/api/v2/plugin-vehicles-stats";


		const resDataPrimary = await fetch(BASE_API_URL_1);
		const resDataRenewable = await fetch(BASE_API_URL_2);
		const resDataPlugin = await fetch(BASE_API_URL_3);

		let renewableData = await resDataRenewable.json();
		let pluginData = await resDataPlugin.json();
		let primaryData = await resDataPrimary.json();

		let dataPlugin = pluginData.map((d) => {
			let res = {
				name: d.country + " - " + d.year,
				value: d["cars-per-1000"]
			};
			return res;
		});
		
		let dataPrimary = primaryData.map((d) => {
			let res = {
				name: d.country + " - " + d.year,
				value: d["oil-consumption"]
			};
			return res;
		});

		
		let dataRenewable = renewableData.map((d) => {
			let res = {
				name: d.country + " - " + d.year,
				value: d["percentage-re-total"]
			};
			return res;
		});

		let dataChart = 
		[
			{
				name: "Porcentaje de coche eléctricos cada 1000 personas",
				data: dataPlugin
			},
			{
				name: "Millones de toneladas de petróleo",
				data: dataPrimary
			},
			{
				name: "Porcentaje de uso de energías renovables",
				data: dataRenewable

			}
		];
		


		Highcharts.chart('container', {
			chart: {
				type: 'packedbubble',
				height: '100%'
			},
			title: {
				text: 'Gráfica común de energías renovables, energías primarias y coches eléctricos'
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
			series: dataChart
		});
	}
	
</script>

<svelte:head>
	
	<script src="https://code.highcharts.com/highcharts.js" on:load={loadGraph}></script>
	<script src="https://code.highcharts.com/highcharts-more.js" on:load={loadGraph}></script>
	<script src="https://code.highcharts.com/modules/exporting.js" on:load={loadGraph}></script>
	<script src="https://code.highcharts.com/modules/accessibility.js" on:load={loadGraph}></script>
    
</svelte:head>

<main>
	<h1 class="display-4" style="text-align: center;" > Gráfica común </h1>
	<figure class="highcharts-figure">
		<div id="container"></div>
		<p></p>

		<p class="highcharts-description">
			Gráfica común a las tres APIs. Muestra los millones de toneladas de petróleo, los porcentajes del uso energías renovables y las ventas coches eléctricos por cada 1000.
		</p>
	</figure>
	<p></p>

	<Button outline color="secondary" on:click="{pop}"><i class="fas fa-arrow-circle-left"></i> Atrás</Button>

</main>