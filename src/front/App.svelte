<script>
	import Router from 'svelte-spa-router';

	import Home from './Home.svelte';
	import oilCoal from './oilCoalNuclearEnergyConsumptionAPI/App.svelte';
	import plugInVehicles from './plugInVehiclesAPI/App.svelte';
	import renewableSources from './renewableSourcesAPI/App.svelte';

	import NotFound from './NotFound.svelte';

	const routes = {
		"/": Home,
		"*": NotFound
	};
</script>

<main>
	<h1>Contact Manager</h1>
	<Router {routes} />
</main>