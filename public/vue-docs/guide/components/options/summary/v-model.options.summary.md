- `v-model` can be used on a component to implement a two-way binding
- `v-model` on a component expands to `:modelValue` and `@update:modelValue`
- The component must bind the `value` attribute of a native `<input>` element to the `modelValue` prop and emit an `update:modelValue` event
- Multiple `v-model` bindings can be created on a single component instance
- Custom modifiers can be added to `v-model` on a component using the `modelModifiers` prop
- Modifiers for `v-model` with arguments are declared using the `arg + "Modifiers"` naming convention