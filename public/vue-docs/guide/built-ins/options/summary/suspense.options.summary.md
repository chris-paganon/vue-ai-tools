- `<Suspense>` is a built-in component for handling async dependencies in a component tree
- It can render a loading state while waiting for nested async dependencies to be resolved
- It can wait on components with an async `setup()` hook or async components
- The loading state is controlled by the `<Suspense>` component and can be customized using slots
- `<Suspense>` emits events for pending, resolve, and fallback states
- Error handling can be done using the `errorCaptured` option or the `onErrorCaptured()` hook
- It can be combined with other components like `<Transition>` and `<KeepAlive>`