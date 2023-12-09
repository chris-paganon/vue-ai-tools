<template>
	<div class="flex min-h-screen">
		<AppSidebar />
		<div class="flex-grow-1 h-100 flex flex-column mx-2 sm:mx-3 mb-3">
			<div class="flex justify-content-end py-4">
				<NavMenu />
			</div>
			<main class="flex-grow-1">
				<slot />
			</main>
		</div>
	</div>
	<AppFooter />
</template>