import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    experimentalFetchPolyfill: true,
    setupNodeEvents(on, config) {},
  },
});
