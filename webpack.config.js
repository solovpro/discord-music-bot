const path = require("path");

module.exports = {
    entry: './index.js', // Точка входа в проект
    target: 'web',
    mode: 'development',
    output: {
        filename: 'discord-music-bot.js',
        path: path.resolve(__dirname, 'build'), // путь вывода собранных файлов
        clean: true, // очищать перед каждой сборкой
    },
    devtool: 'source-map', // отображаются нумерация строк и названия функций и переменных в инструментах разработчика
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            },
        ],
    },
};