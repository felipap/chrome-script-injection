/* eslint-env node */

module.exports = function main(_, { mode }) {
  process.env['BABEL_ENV'] = mode

  return {
    mode,

    entry: {
      popup: './src/popup/index.tsx',
      script: './src/script/index.ts',
      background: './src/background/index.ts',
    },

    output: {
      filename: `[name].js`,
      path: __dirname + "/build/",
    },

    module: {
      rules: [
        {
          test: /\.(tsx?)|(js)$/,
          loader: 'ts-loader',
          exclude: /node_modules/,
          options: {
            transpileOnly: true,
          }
        },
      ],
    },

    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      modules: [
        'node_modules',
      ],
    },

    devtool: 'source-map',
    context: __dirname,
    target: "web",

    optimization: {
      moduleIds: 'named',
      chunkIds: 'named',
      minimize: false
    },
  }
}