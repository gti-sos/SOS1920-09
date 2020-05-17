<script>
	import Router from 'svelte-spa-router';

	import Home from './Home.svelte';
	import OilCoal from './oilCoalNuclearEnergyConsumptionAPI/App.svelte';
	import PlugInVehicles from './plugInVehiclesAPI/App.svelte';
	import RenewableSources from './renewableSourcesAPI/App.svelte';
	import EditOilCoal from './oilCoalNuclearEnergyConsumptionAPI/EditOilCoal.svelte';
	import EditPlugInVehicle from './plugInVehiclesAPI/EditPlugInVehicle.svelte';
	import EditRenewableSource from './renewableSourcesAPI/EditRenewableSource.svelte';
	import ChartOilCoal from './oilCoalNuclearEnergyConsumptionAPI/ChartOilCoal.svelte';
	import ChartPlugInVehicles from './plugInVehiclesAPI/ChartPlugInVehicles.svelte';
	import ChartRenewableSources from './renewableSourcesAPI/ChartRenewableSources.svelte';
	import ChartRenewableSourcesRGraph from './renewableSourcesAPI/ChartRenewableSourcesRGraph.svelte';
	import CommonChart from './CommonChart.svelte';
	import ChartOutPlugInVehicles from './plugInVehiclesAPI/ChartOutPlugInVehicles.svelte';


	import NotFound from './NotFound.svelte';

	const routes = {
		"/": Home,
		"/oilCoalNuclearEnergyConsumptionAPI": OilCoal,
		"/plugInVehiclesAPI": PlugInVehicles,
		"/renewableSourcesAPI": RenewableSources,
		"/oil-coal-nuclear-energy-consumption-stats/:country/:year": EditOilCoal,
		"/plugin-vehicles-stats/:country/:year": EditPlugInVehicle,
		"/renewable-sources-stats/:country/:year": EditRenewableSource,
		"/chartOilCoal": ChartOilCoal,
		"/chartPlugInVehicles": ChartPlugInVehicles,
		"/chartOutPlugInVehicles": ChartOutPlugInVehicles,
		"/chartRenewableSources": ChartRenewableSources,
		"/chartRenewableSourcesRGraph": ChartRenewableSourcesRGraph,
		"/analytics": CommonChart,
		"*": NotFound
	};
</script>

<main>
	<Router {routes} />
</main>