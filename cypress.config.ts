import { defineConfig } from "cypress";

export default defineConfig({
  projectId: "8759xt",
  e2e: {
    setupNodeEvents(on, config) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      return require("./cypress/plugins/index.js")(on, config);
    },
    baseUrl: "http://localhost:3000/",
    specPattern: "cypress/e2e/**/*.{js,jsx,ts,tsx}",
  },
});
