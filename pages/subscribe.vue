<template>
	<div class="flex justify-content-center">
		<div class="max-w">
			<h1>Help the dev!</h1>
			<p class="mb-4">There are currently no paid features, concider this a donation. Your help is very much appreciated!</p>
		</div>
	</div>
	<StripeCheckout />
</template>

<style scoped>
.max-w {
	max-width: 888px;
	width: 100%;
}
</style>