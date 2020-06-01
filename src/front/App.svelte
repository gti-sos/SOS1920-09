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
	import ChartOilCoal2 from './oilCoalNuclearEnergyConsumptionAPI/ChartOilCoal2.svelte';
	import ChartPlugInVehicles from './plugInVehiclesAPI/ChartPlugInVehicles.svelte';
	import ChartOutPlugInVehicles from './plugInVehiclesAPI/ChartOutPlugInVehicles.svelte';
	import ChartRenewableSources from './renewableSourcesAPI/ChartRenewableSources.svelte';
	import ChartRenewableSourcesBillboard from './renewableSourcesAPI/ChartRenewableSourcesBillboard.svelte';
	import CommonChart from './CommonChart.svelte';
	import IntegrationsRenewableSource from './renewableSourcesAPI/Integrations.svelte';
	import IntegrationsPrimaryEnergies from './oilCoalNuclearEnergyConsumptionAPI/Integrations.svelte';
	import IntegrationsPluginCars from './plugInVehiclesAPI/Integrations.svelte';
	import Integrations from './Integrations.svelte';
	import About from './About.svelte';
	


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
		"/chartOilCoal2": ChartOilCoal2,
		"/chartPlugInVehicles": ChartPlugInVehicles,
		"/chartOutPlugInVehicles": ChartOutPlugInVehicles,
		"/chartRenewableSources": ChartRenewableSources,
		"/chartRenewableSourcesBillboard": ChartRenewableSourcesBillboard,
		"/analytics": CommonChart,
		"/integrationsRenewableSource" : IntegrationsRenewableSource,
		"/integrationsPrimaryEnergies" : IntegrationsPrimaryEnergies,
		"/integrationsPluginCars" : IntegrationsPluginCars,
		"/integrations" : Integrations,
		"/about": About,
		"*": NotFound
	};
</script>

<main>
	<Router {routes} />
</main>