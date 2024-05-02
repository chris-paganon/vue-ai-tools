export default defineNuxtPlugin(() => {
  const environment = useRuntimeConfig().public.environment;
  if (environment !== 'production') return;

  useHead({
    script: [
      {
        async: true,
        src: 'https://umami.vueai.tools/script.js',
        'data-website-id': '26f8c670-c065-4261-b86e-cbca5ed11822',
      },
    ],
  });

  const publicFolderUrl = useRuntimeConfig().public.publicFolderUrl;
  useSeoMeta({
    title: 'VueAI.tools',
    ogTitle: 'VueAI.tools',
    description: 'GPT-Powered Assistant for VueJS Documentation',
    ogDescription: 'GPT-Powered Assistant for VueJS Documentation',
    ogImage: `${publicFolderUrl}/img/Hero-banner_midjourney.png`,
  });
});
