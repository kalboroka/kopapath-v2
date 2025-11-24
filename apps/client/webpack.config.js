import path from "path";
import { fileURLToPath } from "url";
import HtmlWebpackPlugin from "html-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
  mode: "development",

  context: __dirname,

  entry: {
    main: "./src/index.jsx",
  },

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    publicPath: "/",
    clean: true,
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      inject: "body",
    }),
  ],

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jpe?g|gif|svg|mp4|mp3|woff2?|eot|ttf)$/,
        type: "asset/resource",
        generator: {
          filename: "assets/[hash][ext][query]",
        },
      },
    ],
  },

  resolve: {
    extensions: [".js", ".jsx"],
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@components": path.resolve(__dirname, "src/components"),
      "@layouts": path.resolve(__dirname, "src/layouts"),
      "@pages": path.resolve(__dirname, "src/pages"),
      "@utils": path.resolve(__dirname, "src/utils"),
      "@styles": path.resolve(__dirname, "src/styles"),
      "@assets": path.resolve(__dirname, "src/assets"),
    },
  },

  // devtool: "cheap-module-source-map",

  devServer: {
    static: {
      directory: path.resolve(__dirname, "public"),
      watch: false, // avoid recursive public watching
    },

    watchFiles: [
      path.resolve(__dirname, "src/**/*"),
      path.resolve(__dirname, "public/**/*"),
    ],

    historyApiFallback: true,
    compress: true,
    hot: true,
    port: 3000,

    proxy: [
      {
        context: ['/api/v1'],
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    ],
  },
};

// import path from "path";
// import { fileURLToPath } from "url";
// import HtmlWebpackPlugin from "html-webpack-plugin";
// import CopyWebpackPlugin from "copy-webpack-plugin";

// const __dirname = path.dirname(fileURLToPath(import.meta.url));

// export default {
//   mode: "production",
//   context: path.resolve(__dirname),
//   entry: {
//     main: "./src/index.jsx"
//   },
//   output: {
//     path: path.resolve(__dirname, "dist"),
//     filename: "[name].[contenthash].js",     // cache-busting
//     chunkFilename: "[name].[contenthash].js", // for lazy-loaded chunks
//     clean: true, // wipe dist/ before new build
//     publicPath: "/" // ensures correct asset paths
//   },
//   plugins: [
//     new HtmlWebpackPlugin({
//       template: "./public/index.html",
//       inject: "body"
//     }),
//     new CopyWebpackPlugin({
//       patterns: [
//         {
//           from: path.resolve(__dirname, "public"),
//           to: "",
//           filter: async (resourcePath) => !resourcePath.includes('index.html')
//         }
//       ]
//     })
//   ],
//   module: {
//     rules: [
//       {
//         test: /\.jsx?$/,
//         exclude: /node_modules/,
//         use: "babel-loader"
//       },
//       {
//         test: /\.css$/,
//         use: ["style-loader", "css-loader"]
//       },
//       {
//         test: /\.(png|jpe?g|gif|svg|mp4|mp3|woff2?|eot|ttf)$/,
//         type: "asset/resource",
//         generator: {
//           filename: "assets/[hash][ext][query]"
//         }
//       }
//     ]
//   },
//   resolve: {
//     extensions: [".js", ".jsx"],
//     alias: {
//       "@": path.resolve(__dirname, "src"),         // root src
//       "@components": path.resolve(__dirname, "src/components"),
//       "@layouts": path.resolve(__dirname, "src/layouts"),
//       "@pages": path.resolve(__dirname, "src/pages"),
//       "@utils": path.resolve(__dirname, "src/utils"),
//       "@styles": path.resolve(__dirname, "src/styles"),
//       "@assets": path.resolve(__dirname, "src/assets")
//     }
//   },
//   optimization: {
//     splitChunks: {
//       chunks: "all", // vendor & commons split
//       cacheGroups: {
//         vendor: {
//           test: /[\\/]node_modules[\\/]/,
//           name: "vendors",
//           chunks: "all"
//         }
//       }
//     },
//     runtimeChunk: "single" // separates runtime into its own file
//   },
//   devServer: {
//     static: path.resolve(__dirname, "public"),
//     watchFiles: [
//       path.resolve(__dirname, "src/**/*"),
//       path.resolve(__dirname, "public/**/*")
//     ],
//     historyApiFallback: true, // for SPA routing
//     compress: true,
//     hot: true,
//     port: 3000
//   }
// };
