- Custom directives allow for reusing logic that involves low-level DOM access on plain elements
- Custom directives are defined as objects containing lifecycle hooks
- The `mounted` hook focuses an input element when it is inserted into the DOM
- Custom directives can be locally or globally registered
- Directive hooks include `created`, `beforeMount`, `mounted`, `beforeUpdate`, `updated`, `beforeUnmount`, and `unmounted`
- Directive hooks receive arguments such as the element, binding, vnode, and prevVnode
- Custom directives can have function shorthand for `mounted` and `updated` behavior
- Multiple values can be passed to a directive using an object literal
- When used on components, custom directives apply to the component's root node