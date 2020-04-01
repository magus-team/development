const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

module.exports = {
    webpack(config) {
        config.resolve.plugins.push(new TsconfigPathsPlugin())
        return config
    },
}
