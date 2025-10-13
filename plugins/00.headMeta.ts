export default defineNuxtPlugin(() => {
  const environment = useRuntimeConfig().public.environment;
  if (environment !== 'production') return;

  useHead({
    script: [
      {
        async: true,
        src: 'https://umami.chrispaganon.com/script.js',
        'data-website-id': 'c52b9daa-f6ed-4cfb-a2e0-d73f5a60e1f5',
        'data-do-not-track': true,
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
