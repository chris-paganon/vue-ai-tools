- `defineProps()` macro supports inferring props types based on its argument
- `defineProps()` can be used with type-based declaration or runtime declaration
- `withDefaults` compiler macro can be used to declare default values for props
- When not using `<script setup>`, `defineComponent()` is used to enable props type inference
- Props can use complex types with type-based declaration or `PropType` utility type with runtime declaration
- `ref()` infers the type from the initial value, but can also be explicitly typed with the `Ref` type or a generic argument
- `reactive()` infers the type from its argument, but can also be explicitly typed with interfaces
- `computed()` infers its type based on the getter's return value, but can also be explicitly typed with a generic argument
- Event handlers should be explicitly annotated with the correct argument type
- `provide` and `inject` can be typed using `InjectionKey` interface or a generic type argument
- Template refs should be created with an explicit generic type argument and an initial value of `null`
- Template refs for child components can be annotated using `typeof` and `InstanceType` to get the instance type
- `ComponentPublicInstance` can be used when the exact type of the component is not available or important