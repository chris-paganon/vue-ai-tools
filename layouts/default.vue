<template>
	<div class="flex min-h-screen">
		<AppToolbar />
		<div class="flex-grow-1 h-100 flex flex-column mx-3 mb-3">
			<div class="flex justify-content-between align-items-center sm:justify-content-end py-2 sm:py-4">
				<AppLogo class="sm:hidden" />
				<SimpleMenu class="hidden sm:block" />
				<MobileMenu class="block sm:hidden" />
			</div>
			<main class="flex-grow-1">
				<slot />
			</main>
		</div>
	</div>
	<AppFooter />
</template>