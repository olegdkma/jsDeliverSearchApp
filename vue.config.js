const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: [
    'vuetify'
  ],

  devServer: {
    proxy: 'https://registry.npmjs.org',


  }

})
