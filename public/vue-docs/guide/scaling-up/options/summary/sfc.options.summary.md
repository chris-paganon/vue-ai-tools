- Vue Single-File Components (SFC) allow encapsulation of template, logic, and styling in a single file
- SFCs use `<template>`, `<script>`, and `<style>` blocks to colocate the view, logic, and styling
- Benefits of SFC include modularization, pre-compiled templates, component-scoped CSS, ergonomic syntax for Composition API, IDE support, and Hot-Module Replacement (HMR)
- SFC is recommended for Single-Page Applications (SPA), Static Site Generation (SSG), and non-trivial frontends
- SFCs must be pre-compiled into JavaScript and CSS using the `@vue/compiler-sfc`
- `<style>` tags in SFCs can be injected as native `<style>` tags during development and extracted into a single CSS file for production
- SFCs can be integrated with build tools like Vite or Vue CLI
- Separation of concerns in SFCs is achieved by dividing code into loosely-coupled components and composing them