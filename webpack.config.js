const pkg = require("./package.json");
const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = (argv) => {
  console.log("----------------------");
  console.log("Bubbi");
  console.log(`Version:${pkg.version}`);
  console.log(`Environment:${argv.mode}`);
  console.log("----------------------");

  return {
    entry: {
      main: {
        import: "./js/module.js",
        filename: "./js/module.js",
      },
    },
    output: {
      filename: "[name].js",
      path: `${__dirname}/dist/dev`,
      chunkFilename: `chunks-${pkg.version}/[name].js`,
    },
    module: {
      rules: [
        {
          test: /\.(png|jpe?g|gif)$/i,
          use: [
            {
              loader: "file-loader",
            },
          ],
        },
        {
          test: /\.html$/i,
          loader: "html-loader",
        },
        {
          test: /\.?js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
        },
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.s[ac]ss$/i,
          use: ["style-loader", "css-loader", "sass-loader"],
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        __ENVIRONMENT__: JSON.stringify(argv.mode),
        __VERSION__: JSON.stringify(pkg.version),
        __NAME__: JSON.stringify(pkg.name),
      }),
    ],
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          extractComments: true,
          terserOptions: {
            compress: {
              drop_console: true,
            },
          },
        }),
      ],
    },
  };
};
