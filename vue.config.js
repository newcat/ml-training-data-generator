module.exports = {
    configureWebpack: {
        entry: {
            sw: "./src/sw.ts"
        }
    },
    devServer: {
        hot: false
    }
}