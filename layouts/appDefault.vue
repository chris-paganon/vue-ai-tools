<template>
	<div class="flex min-h-screen">
		<AppSidebar />
		<div class="flex-grow-1 h-100 flex flex-column mb-4 mr-2">
			<div class="flex justify-content-end p-4">
				<NavMenu />
			</div>
			<main class="flex-grow-1">
				<slot />
			</main>
		</div>
	</div>
	<AppFooter />
</template>