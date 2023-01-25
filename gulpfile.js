const gulp = require('gulp'); // Подключаем Gulp
const gsass = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat'); // Подключаем gulp-concat (для конкатенации файлов)
const uglify = require('gulp-uglifyjs'); // Подключаем gulp-uglifyjs (для сжатия JS)
const cssnano = require('gulp-cssnano'); // Подключаем пакет для минификации CSS
const rename = require('gulp-rename'); // Подключаем библиотеку для переименования файлов
const del = require('del'); // Подключаем библиотеку для удаления файлов и папок
// const imagemin = require('gulp-imagemin'); // Подключаем библиотеку для работы с изображениями
const pngquant = require('imagemin-pngquant'); // Подключаем библиотеку для работы с png
const cache = require('gulp-cache'); // Подключаем библиотеку кеширования
const autoprefixer = require('gulp-autoprefixer'); // Подключаем библиотеку для автоматического добавления префиксов
const svgSprite = require('gulp-svg-sprite'); // Подключаем библиотеку для создания svg-спрайта
const spritesmith = require('gulp.spritesmith'); // Подключаем библиотеку для создания png-спрайта
const sourcemaps = require('gulp-sourcemaps');
const gpug = require('gulp-pug');
const beautify = require('gulp-jsbeautifier');

const merge = require('merge-stream');

const glob = require("glob").Glob;


// browser-sync
const browsersync = () => {
    browserSync.init({
        server: { baseDir: 'app/' }, // Указываем папку сервера
		notify: false, // Отключаем уведомления
		online: true // Режим работы: true или false
    });
}

const browserSyncReload = (done) => {
    sync.reload();
};


// SASS
const sass = () => {
    return gulp.src('app/sass/**/*.sass') // Берем источник
        .pipe(sourcemaps.init())
        .pipe(gsass()) // Преобразуем Sass в CSS посредством gulp-sass
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) // Создаем префиксы
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('app/css')) // Выгружаем результата в папку app/css
        .pipe(browserSync.stream());
        // .pipe(browserSync.reload({ stream: true })); // Обновляем CSS на странице при изменении
}

// JS библиотеки
const scripts_libs = () => {
    return gulp.src('app/js/vendors/*.js')
		.pipe(concat('libs.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('app/js'))
        .pipe(browserSync.stream());
}

// Pug
const pug = () => {
    return gulp.src("app/pug/*.pug")
        .pipe(gpug({ pretty: true }))
        .pipe(gulp.dest("app"))
        .pipe(browserSync.stream());
}

// SVG-спрайт
const svg_sprite = () => {
    return gulp.src('app/img/sprite-svg/*.svg') // svg файлы для спрайта
        .pipe(svgSprite({
            mode: {
                stack: {
                    sprite: "../sprite.svg" // имя спрайт файла
                }
            },
        }))
        .pipe(gulp.dest('app/img/'))
        .pipe(browserSync.stream());
}

// Png - спрайт
const img_sprite = () => {

    var spriteData = gulp.src('app/img/sprite-img/*.*').pipe(spritesmith({
        imgName: 'sprite.png',
        cssName: 'sprite.sass',
        cssFormat: 'sass',
        imgPath: '../img/sprite.png'
    }));

    var imgStream = spriteData.img
        .pipe(gulp.dest('app/img/'));

    var cssStream = spriteData.css
        .pipe(gulp.dest('app/sass/'));

    return merge(imgStream, cssStream);
}

// CSS - библиотеки
const css_libs = gulp.series(sass , () => {

    

    return gulp.src('app/css/vendors/*.css')
        .pipe(concat('libs.min.css'))
        // .pipe(cssnano()) // Сжимаем
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.stream()); // Выгружаем в папку app/css
})


// Удаление папки dist перед сборкой
const clean = () => {
    return del.sync('dist'); 
}

// Оптимизация изображений
const img = () => {
    return gulp.src('app/img/**/*') // Берем все изображения из app
        // .pipe(cache(imagemin({ // Сжимаем их с наилучшими настройками с учетом кеширования
        //     interlaced: true,
        //     progressive: true,
        //     svgoPlugins: [{ removeViewBox: false }],
        //     use: [pngquant()]
        // })))
        .pipe(gulp.dest('dist/img'))
        .pipe(browserSync.stream());
}

const beautifyHtml = () => {
    return gulp.src('app/**/*.html')
        .pipe(beautify({
            indent_size: 4,
            js: {
              indent_char: '\t',
              indent_size: 1
            }
          }))
        .pipe(gulp.dest('app'))
}

// Очистка кеша
const clear = () => {
    return cache.clearAll();
}

const watcher = gulp.series( css_libs, scripts_libs, svg_sprite, img_sprite, pug, beautifyHtml, () => {
    gulp.watch('app/sass/**/*.sass', sass); 

    gulp.watch('app/pug/**/**/*.pug', pug);
    gulp.watch('app/img/sprite-svg/*.svg', svg_sprite);
    gulp.watch('app/img/sprite-img/*.*', img_sprite);
    gulp.watch('app/*.html').on('change', browserSync.reload); 
    gulp.watch('app/js/**/*.js').on('change', browserSync.reload); 

});



const build = gulp.series(img, sass, scripts_libs, svg_sprite, img_sprite, beautifyHtml, () => {
    var buildCss = gulp.src([ // Переносим библиотеки в продакшен
            'app/css/**/*.css'
        ])
        .pipe(gulp.dest('dist/css'));

    var buildCssMap = gulp.src([ // Переносим библиотеки в продакшен
            'app/css/**/*.css.map'
        ])
        .pipe(gulp.dest('dist/css'));

    var buildFonts = gulp.src('app/fonts/**/*') // Переносим шрифты в продакшен
        .pipe(gulp.dest('dist/fonts'));

    var buildJs = gulp.src('app/js/**/*') // Переносим скрипты в продакшен
        .pipe(gulp.dest('dist/js'));

    var buildHtml = gulp.src('app/*.html') // Переносим HTML в продакшен
        .pipe(gulp.dest('dist'));

    var buildPhp = gulp.src('app/*.php')
        .pipe(gulp.dest('dist'));
})

const watch = gulp.parallel(build, browsersync, watcher );


exports.sass = sass;
exports.scripts_libs = scripts_libs;
exports.pug = pug;
exports.svg_sprite = svg_sprite;
exports.img_sprite = img_sprite;
exports.css_libs = css_libs;
exports.clean = clean;
exports.img = img;
exports.clear = clear;
exports.watch = watch;
exports.build = build;
exports.beautifyHtml = beautifyHtml;

exports.default = watch;
