- Props in Vue.js components require explicit declaration
- Props can be declared using an array of strings or an object syntax
- Props can have different value types such as string, number, boolean, array, and object
- Props can be passed as static values or assigned dynamically using `v-bind` or `:`
- Props form a one-way data flow from parent to child components
- Mutating a prop inside a child component is not allowed and will result in a warning
- Object and array props can be mutated, but it is not recommended
- Props can be validated using the `props` option with an object syntax
- Prop validation can specify types, required fields, default values, and custom validators
- Props with a `Boolean` type have special casting rules to mimic native boolean attributes