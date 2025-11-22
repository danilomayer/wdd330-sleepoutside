import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: './src/index.html',
        productListing: './src/product_listing/index.html',
        cart: './src/cart/index.html',
        checkout: './src/checkout/index.html',
      },
    },
  },
});