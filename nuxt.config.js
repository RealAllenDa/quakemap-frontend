import webpack from 'webpack'
import { coreVersion, version } from './package.json'

const logo = Buffer.from(
  'JWNfX19fX19fXyAgICAgICAgICAgICAgICBfXyAgICA' +
    'gICAgICAgICBfX19fXyAgICAgICAgICAgICAgICAgClxfX1' +
    '9fXyAgXCAgX18gX19fX19fXyAgfCAgfCBfXyBfX19fICAgL' +
    'yAgICAgXCBfX19fXyAgX19fX19fICAKIC8gIC8gXCAgXHwg' +
    'IHwgIFxfXyAgXCB8ICB8LyAvLyBfXyBcIC8gIFwgLyAgXFx' +
    'fXyAgXCBcX19fXyBcIAovICAgXF8vLiAgXCAgfCAgLy8gX1' +
    '8gXHwgICAgPFwgIF9fXy8vICAgIFkgICAgXC8gX18gXHwgI' +
    'HxfPiA+ClxfX19fX1wgXF8vX19fXy8oX19fXyAgL19ffF8g' +
    'XFxfX18gID5fX19ffF9fICAoX19fXyAgLyAgIF9fLyAKICA' +
    'gICAgIFxfXz4gICAgICAgICAgXC8gICAgIFwvICAgIFwvIC' +
    'AgICAgICBcLyAgICAgXC98X198ICAgIA==',
  'base64'
).toString()

export default {
  // Disable ssr since we need to manipulate client window.
  ssr: false,
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'quakemap-frontend-port',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['~/assets/generic.scss'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/stylelint
    '@nuxtjs/stylelint-module',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    'nuxt-leaflet',
    '@nuxtjs/style-resources',
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    extend(config) {
      // noinspection JSUnresolvedVariable
      config.plugins.push(
        new webpack.DefinePlugin({
          'process.env.version': JSON.stringify(version),
          'process.env.coreVersion': JSON.stringify(coreVersion),
          'process.env.logo': JSON.stringify(logo),
        })
      )
      // noinspection JSUnresolvedVariable
      config.plugins.push(
        new webpack.BannerPlugin({
          banner:
            `EEWMapBackend@${coreVersion}. ` +
            'Copyright © 2021 Homenetwork. All rights reserved.',
          entryOnly: true,
        })
      )
    },
  },
  styleResources: {
    scss: ['~/assets/_globals.scss'],
  },
}
