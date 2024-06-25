export default defineNuxtPlugin(() => {
  const environment = useRuntimeConfig().public.environment;
  if (environment !== 'production') return;

  useHead({
    script: [
      {
        async: true,
        src: 'https://umami.vueai.tools/script.js',
        'data-website-id': '9a36b898-44ef-4267-89d6-dd7a3afb90a2',
      },
    ],
  });

  const publicFolderUrl = useRuntimeConfig().public.publicFolderUrl;
  useSeoMeta({
    title: 'VueAI.tools',
    ogTitle: 'VueAI.tools',
    description: 'AI Assistant for VueJS Documentation',
    ogDescription: 'AI Assistant for VueJS Documentation',
    ogImage: `${publicFolderUrl}/img/Hero-banner_midjourney.png`,
  });
});
