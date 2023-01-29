import gulp from 'gulp';
import pug from 'gulp-pug';
import plumber from 'gulp-plumber';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';

import sourcemap from 'gulp-sourcemaps';
import autoprefixer from 'autoprefixer';
import cssnano from 'gulp-cssnano';
import imagemin, { gifsicle, mozjpeg, optipng, svgo } from 'gulp-imagemin';
import svgSprite from 'gulp-svg-sprite';
import rename from 'gulp-rename';
import { deleteAsync } from 'del';
import sync from 'browser-sync';
import webpack from 'webpack-stream';
const sass = gulpSass(dartSass);

export const browsersync = () => {
    sync.init({
        server: {
            baseDir: './src/',
            serveStaticOptions: {
                extensions: ['html'],
            },
        },
        port: 8080,
        ui: { port: 8081 },
        open: true,
    });
};

export const style = () => {
    return (
        gulp
            .src('./src/sass/**/*.sass')
            .pipe(plumber())
            .pipe(sourcemap.init())
            .pipe(sass({ includePaths: ['./node_modules'] }).on('error', sass.logError))
            // .pipe(
            //     cssnano({
            //         discardComments: {
            //             removeAll: true,
            //         },
            //     }),
            // )
            // .pipe(rename('style.min.css'))
            .pipe(sourcemap.write('.'))
            .pipe(gulp.dest('./src/css/'))
            .pipe(sync.stream())
    );
};

export const js = () => {
    return gulp
        .src('./src/js/index.js')
        .pipe(plumber())
        .pipe(
            webpack({
                mode: process.env.NODE_ENV || 'development',
                entry: {
                    main: './src/js/index.js',
                },
                devtool: process.env.NODE_ENV ? false : 'source-map',
                output: {
                    filename: 'bundle.js',
                },
                module: {
                    rules: [
                        {
                            test: /\.js$/,
                            exclude: /node_modules/,
                            loader: 'babel-loader',
                        },
                    ],
                },
            }),
        )
        .pipe(gulp.dest('./src/js/'))
        .pipe(sync.stream());
};

export const pugPages = () => {
    return gulp
        .src('./src/pug/*.pug')
        .pipe(pug({ pretty: true }))
        .pipe(gulp.dest('./src/'))
        .pipe(sync.reload({ stream: true }));
};

export const images = () => {
    return gulp
        .src('./src/img/**/*')
        .pipe(
            imagemin([
                gifsicle({ interlaced: true }),
                mozjpeg({ quality: 75, progressive: true }),
                optipng({ optimizationLevel: 5 }),
                svgo(),
            ]),
        )
        .pipe(gulp.dest('./build/img/'))
        .pipe(sync.stream());
};

export const sprite = () => {
    return gulp
        .src('./src/img/svg/*.svg')
        .pipe(
            svgSprite({
                mode: {
                    stack: {
                        sprite: '../sprite.svg',
                    },
                },
            }),
        )
        .pipe(gulp.dest('./src/img/'));
};

export const clean = () => {
    return deleteAsync(['build/*/']);
};

export const watchDev = () => {
    gulp.watch(['./src/sass/**/*.sass'], gulp.series(style)).on('change', sync.reload);
    gulp.watch(['./src/js/**/*.js', '!./src/js/bundle.js'], gulp.series(js));
    // gulp.watch('./src/img/**/*.{jpg,svg,png}', gulp.series(images));
    gulp.watch('./src/img/svg/*.svg', gulp.series(sprite));

    gulp.watch(['./src/pug/**/*.pug'], gulp.series(pugPages)).on('change', sync.reload);
};

const buildCss = () => {
    gulp.src([
        // Переносим библиотеки в продакшен
        'src/css/**/*.css',
    ]).pipe(gulp.dest('build/css'));
};

const buildFonts = () => {
    gulp.src('src/fonts/**/*') // Переносим шрифты в продакшен
        .pipe(gulp.dest('build/fonts'));
};

const buildJs = () => {
    gulp.src('src/js/bundle.js') // Переносим скрипты в продакшен
        .pipe(gulp.dest('build/js'));
};

const buildHtml = () => {
    gulp.src('src/*.html') // Переносим HTML в продакшен
        .pipe(gulp.dest('build'));
};

const buildPhp = () => {
    gulp.src('src/*.php').pipe(gulp.dest('build'));
};

export const buildFiles = () => {
    gulp.parallel(buildCss, buildCssMap, buildFonts, buildJs, buildHtml);
};

gulp.task(
    'build',
    gulp.series(
        clean,
        gulp.parallel(pugPages, style, js, images, sprite),
        gulp.parallel(buildCss, buildFonts, buildJs, buildHtml),
    ),
);

gulp.task(
    'start',
    gulp.series(
        gulp.parallel(pugPages, style, js, images, sprite),
        gulp.parallel(watchDev, browsersync),
    ),
);
