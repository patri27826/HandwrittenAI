// // vue.config.js

// const path = require('path')
// const PrerenderSPAPlugin = require('prerender-spa-plugin')

// module.exports = {
//   configureWebpack(config) {
//     if (process.env.NODE_ENV !== 'production') return;
//     return  {
//       plugins: [
//         new PrerenderSPAPlugin({
//           // Required - The path to the webpack-outputted app to prerender.
//           staticDir: path.join(__dirname, 'templates'),
//           // Required - Routes to render.
//           routes: ['/'],
//         })
//       ]
//     }
//   },
//   pwa: {
//         // 一些基础配置
//         name: 'Browsing-Exp',
//         themeColor: '#6476DB',
//         msTileColor: '#000000',
//         appleMobileWebAppCapable: 'yes',
//         appleMobileWebAppStatusBarStyle: 'black',

//     /*
//     * 两个模式，GenerateSW（默认）和 InjectManifest
//     * GenerateSW 在我们build项目时候，每次都会新建一个service worker文件
//     * InjectManifest 可以让我们编辑一个自定义的service worker文件，实现更多的功能，并且可以
//     * 拿到预缓存列表
//     */
//         workboxPluginMode: 'InjectManifest',
//         workboxOptions: {
//         // 自定义的service worker文件的位置
//         swSrc: 'src/service-worker.js',
//         // ...other Workbox options...
//         }
//     }
// }