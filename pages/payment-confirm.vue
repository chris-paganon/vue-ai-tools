<template>
	<!-- TODO: Show better messages -->
	<h1>Payment Confirm</h1>
	<p>{{ status }}</p>
</template>

<script setup lang="ts">
const url = useRequestURL();
const urlParams = new URLSearchParams(url.search);
const sessionId = urlParams.get('session_id');

const status = ref('Waiting');

if (!sessionId) {
	throw new Error('No session_id found in URL params');
}

const { data } = await useFetch('/api/checkoutSessionStatus', {
	method: 'GET',
	query: {
		sessionId,
	},
});

watch(data,
	async () => {
		// TODO: Handle error
		if (!data.value?.status) return;
		status.value = data.value.status;
	},
	{ immediate: true },
);
</script>