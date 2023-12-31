- A "composable" is a function that encapsulates and reuses stateful logic in Vue applications
- Composables leverage Vue's Composition API
- Composables can be used to extract logic from components and reuse it in multiple components
- Composables can be nested and composed together to create complex logic
- Composables should be named with camelCase and start with "use"
- Composables can accept refs, getters, and plain values as input arguments
- Composables should return a plain object containing multiple refs for better reactivity
- Side effects in composables should be cleaned up in the `onUnmounted` hook
- Composables can be used in the Options API by calling them inside the `setup` function and returning the desired properties
- Composables are recommended over mixins and renderless components for better code organization and performance
- Composables are similar to React hooks, but based on Vue's reactivity system