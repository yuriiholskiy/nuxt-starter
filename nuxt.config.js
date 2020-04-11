const imageminMozjpeg = require('imagemin-mozjpeg');
const ImageminWebpackPlugin = require('imagemin-webpack-plugin').default;
const isDev = process.env.NODE_ENV !== 'production';
export default {
  mode: 'universal',
  ...(!isDev && {
    modern: 'client'
  }),
  head: {
    htmlAttrs: {
      lang: 'en'
    },
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  rootDir: __dirname,
  loading: { color: 'lightblue' },
  css: ['~/assets/css/index.scss'],
  plugins: [],
  buildModules: ['@nuxtjs/eslint-module'],
  modules: [
    '@nuxtjs/style-resources',
    'nuxt-webfontloader',
    'cookie-universal-nuxt'
  ],
  webfontLoader: {
    // describe fonts
  },
  styleResources: {
    scss: 'assets/css/helpers.scss'
  },
  // for https, for localhost - disabled
  render: {
    // http2: {
    //     push: true,
    //     pushAssets: (req, res, publicPath, preloadFiles) => preloadFiles
    //     .map(f => `<${publicPath}${f.file}>; rel=preload; as=${f.asType}`)
    //   },
    // compressor: false,
  },
  // build
  build: {
    optimizeCss: false,
    filenames: {
      app: ({ isDev }) => (isDev ? '[name].js' : 'js/[contenthash].js'),
      chunk: ({ isDev }) => (isDev ? '[name].js' : 'js/[contenthash].js'),
      css: ({ isDev }) => (isDev ? '[name].css' : 'css/[contenthash].css'),
      img: ({ isDev }) =>
        isDev ? '[path][name].[ext]' : 'img/[contenthash:7].[ext]',
      font: ({ isDev }) =>
        isDev ? '[path][name].[ext]' : 'fonts/[contenthash:7].[ext]',
      video: ({ isDev }) =>
        isDev ? '[path][name].[ext]' : 'videos/[contenthash:7].[ext]'
    },
    ...(!isDev && {
      html: {
        minify: {
          collapseBooleanAttributes: true,
          decodeEntities: true,
          minifyCSS: true,
          minifyJS: true,
          processConditionalComments: true,
          removeEmptyAttributes: true,
          removeRedundantAttributes: true,
          trimCustomFragments: true,
          useShortDoctype: true
        }
      }
    }),
    splitChunks: {
      layouts: true,
      pages: true,
      commons: true
    },
    otimization: {
      minimize: !isDev
    },
    ...(!isDev && {
      exractCSS: {
        ignoreOrder: true
      }
    }),
    transpile: ['vue-lazy-hydration'],
    postcss: {
      plugins: {
        ...(!isDev && {
          cssnano: {
            preset: [
              'advanced',
              {
                autoprefixer: false,
                cssDeclarationSorter: false,
                zindex: false,
                discardComments: {
                  removeAll: true
                }
              }
            ]
          }
        }),
        'postcss-sort-media-queries': {}
      },
      ...(!isDev && {
        preset: {
          browsers: 'cover 99.5%',
          autoprefixer: true
        }
      }),
      order: 'cssnanoLast'
    },
    extend(config, context) {
      const ORIGINAL_TEST = '/\\.(png|jpe?g|gif|svg|webp)$/i';
      const vueSvgLoader = [
        {
          loader: 'vue-svg-loader',
          options: {
            svgo: false
          }
        }
      ];
      const imageMinPlugin = new ImageminWebpackPlugin({
        pngquant: {
          quality: '5-30',
          speed: 7,
          strip: true
        },
        jpegtran: {
          progressive: true
        },
        gifsicle: {
          interlaced: true
        },
        plugins: [
          imageminMozjpeg({
            quality: 70,
            progressive: true
          })
        ]
      });
      if (!context.isDev) config.plugins.push(imageMinPlugin);

      config.module.rules.forEach((rule) => {
        if (rule.test.toString() === ORIGINAL_TEST) {
          rule.test = /\.(png|jpe?g|gif|webp)$/i;
          rule.use = [
            {
              loader: 'url-loader',
              options: {
                limit: 1000,
                name: context.isDev
                  ? '[path][name].[ext]'
                  : 'img/[contenthash:7].[ext]'
              }
            }
          ];
        }
      });
      const svgRule = {
        test: /\.svg$/,
        oneOf: [
          {
            resourceQuery: /inline/,
            use: vueSvgLoader
          },
          {
            resourceQuery: /data/,
            loader: 'url-loader'
          },
          {
            resourceQuery: /raw/,
            loader: 'raw-loader'
          },
          {
            loader: 'file-loader'
          }
        ]
      };

      config.module.rules.push(svgRule);
    }
  }
};
