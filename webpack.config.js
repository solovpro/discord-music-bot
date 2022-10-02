const path = require("path");

module.exports = {
    entry: './index.js', // Точка входа в проект
    target: 'web',
    output: {
        filename: 'discord-music-bot.js',
        path: path.resolve(__dirname, 'build'), // путь вывода собранных файлов
        clean: true, // очищать перед каждой сборкой
    },
    devtool: 'source-map', // отображаются нумерация строк и названия функций и переменных в инструментах разработчика
    // resolve: {
    //     extensions: ['.js', '.jsx', '.css', '.scss'],
    //     alias: {
    //         components: path.resolve(__dirname, 'src/components/'),
    //         services: path.resolve(__dirname, 'src/services'),
    //         stores: path.resolve(__dirname, 'src/stores'),
    //         assets: path.resolve(__dirname, 'src/assets'),
    //     },
    // },
    module: {
        rules: [
            {
                test: /\.js|\.jsx$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            },
            {
                enforce: 'pre',
                exclude: /node_modules/,
                test: /\.js$/,
                loader: 'source-map-loader',
            },
        ],
    },
};