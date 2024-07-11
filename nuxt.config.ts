// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  ssr: false,
  devtools: { enabled: false },
  modules: ["@nuxt/ui", "@pinia/nuxt", "nuxt-tiptap-editor"],
  css: ["~/assets/css/styles.css"],
  app: {
    head: {
      title: "Taskboard - Keep a record of all your daily activities.",
      titleTemplate: "%s - Task Notes",
      link: [
        {
          href: "https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap",
          rel: "stylesheet",
        },
        {
          href: "https://fonts.googleapis.com",
          rel: "preconnect",
        },
        {
          href: "https://fonts.gstatic.com",
          rel: "preconnect",
          crossorigin: "use-credentials",
        },
      ],
    },
  },
  colorMode: {
    preference: "light",
  },
  tiptap: {
    prefix: "tiptap",
  },
});
