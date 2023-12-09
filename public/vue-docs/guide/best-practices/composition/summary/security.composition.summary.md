- Reporting vulnerabilities is a top concern for Vue.js, email [security@vuejs.org](mailto:security@vuejs.org) to report a vulnerability.
- Never use non-trusted content as component templates, it can lead to arbitrary JavaScript execution.
- Vue automatically escapes HTML content and dynamic attribute bindings to prevent script injection.
- User-provided HTML, URLs, styles, and JavaScript should be sanitized and handled with caution.
- Best practices include avoiding unsanitized user-provided content and familiarizing yourself with HTML5 security and XSS prevention resources.
- HTTP security vulnerabilities are primarily addressed on the backend.
- Server-side rendering has additional security concerns, follow best practices outlined in the SSR documentation.