const mix = require('laravel-mix');
const webpack = require('webpack');
// const bootstrap = require('bootstrap');

mix.js('resources/js/app.js', 'public/js')
    .sass('resources/sass/app.scss', 'public/css')
    .webpackConfig({
        plugins: [
            new webpack.ProvidePlugin({
                // $: 'jquery',
                // jQuery: 'jquery',
                // 'window.jQuery': 'jquery',
                Popper: ['popper.js', 'default'],
                // bootstrap: 'bootstrap/dist/js/bootstrap.bundle.min.js'
            })
        ]
    });