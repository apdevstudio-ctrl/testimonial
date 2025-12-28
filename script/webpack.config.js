const path = require('path');

module.exports = {
  entry: './src/index.ts',
  output: {
    filename: 'testimonial-script.js',
    path: path.resolve(__dirname, 'dist'),
    library: {
      name: 'TestimonialWidget',
      type: 'umd',
      export: 'default',
    },
    globalObject: 'typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : this',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  optimization: {
    minimize: false, // Keep readable for debugging, set to true for production
  },
};

