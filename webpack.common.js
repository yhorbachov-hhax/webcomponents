const path = require("path");

module.exports = {
  entry: {
    main: "./src/index.js",
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
    ],
  },
  output: {
    filename: "webcomponents.js",
    path: path.resolve(__dirname, "umd"),
    clean: true,
    library: {
      name: "webcomponents",
      type: "umd",
    },
  },
};
