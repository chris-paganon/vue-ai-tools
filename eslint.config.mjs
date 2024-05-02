// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt({
  rules: {
    'vue/no-v-html': 'off',
    'vue/html-self-closing': 'off',
  },
});
