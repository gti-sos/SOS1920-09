<script>
	import Router from 'svelte-spa-router';

	import Home from './Home.svelte';
	import OilCoal from './oilCoalNuclearEnergyConsumptionAPI/App.svelte';
	import PlugInVehicles from './plugInVehiclesAPI/App.svelte';
	import RenewableSources from './renewableSourcesAPI/App.svelte';
	import EditOilCoal from './oilCoalNuclearEnergyConsumptionAPI/EditOilCoal.svelte';
	import EditPlugInVehicle from './plugInVehiclesAPI/EditPlugInVehicle.svelte';
	import EditRenewableSource from './renewableSourcesAPI/EditRenewableSource.svelte';


	import NotFound from './NotFound.svelte';

	const routes = {
		"/": Home,
		"/oilCoalNuclearEnergyConsumptionAPI": OilCoal,
		"/plugInVehiclesAPI": PlugInVehicles,
		"/renewableSourcesAPI": RenewableSources,
		"/oilCoalNuclearEnergyConsumptionAPI/:country/:year": EditOilCoal,
		"/plugInVehiclesAPI/:country/:year": EditPlugInVehicle,
		"/renewableSourcesAPI/:country/:year": EditRenewableSource,
		"*": NotFound
	};
</script>

<main>
	<Router {routes} />
</main>