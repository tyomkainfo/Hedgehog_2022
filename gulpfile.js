const {src, dest, watch, parallel, series} = require('gulp');

const del          = require('del');
const scss         = require('gulp-sass')(require('sass'));
const concat       = require('gulp-concat');
const uglify       = require('gulp-uglify-es').default;
const clean_css    = require('gulp-clean-css');
const browser_sync = require('browser-sync').create();
const file_include = require('gulp-file-include');
const group_media  = require('gulp-group-css-media-queries');
const autoprefixer = require('gulp-autoprefixer');
const image_min    = require('gulp-imagemin');
const webp         = require('gulp-webp');
const webp_html    = require('gulp-webp-html');
const webp_css     = require('gulp-webp-css');
const rename       = require('gulp-rename');

function html() {
    return src(['_src/pages/*.html',
    ])
        .pipe(file_include())
        .pipe(webp_html())
        .pipe(dest('dist/pages'))
        .pipe(browser_sync.stream())
}

function styles() {
    return src('_src/styles/style.scss')
        .pipe(scss({outputStyle: 'expanded'}))
        .pipe(webp_css())
        .pipe(group_media())
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 10 version'],
            grid: true,
            cascade: true,
        }))
        .pipe(dest('dist/styles'))
        .pipe(clean_css())
        .pipe(rename({
            extname: '.min.css'
        }))
        .pipe(dest('dist/styles'))
        .pipe(browser_sync.stream())
}

function scripts() {
    return src([
        '_src/scripts/*.js',
        '!_src/scripts/*.min.js',
    ])
        .pipe(file_include())
        .pipe(dest('dist/scripts'))
        .pipe(uglify())
        .pipe(rename({
            extname: '.min.js'
        }))
        .pipe(dest('dist/scripts'))
        .pipe(browser_sync.stream())
}

function images() {
    return src('_src/images/**/*.{jpg,png,svg,gif,ico,webp}')
        .pipe(webp({quality: 70}))
        .pipe(dest('dist/images'))
        .pipe(src('_src/images/**/*.{jpg,png,svg,gif,ico,webp}'))
        .pipe(image_min({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            interlaced: true,
            optimizationLevel: 4 // 0 to 7
        }))
        .pipe(dest('dist/images'))
        .pipe(browser_sync.stream())
}

function build() {
    return src ([
        '_src/PHPMailer/**/*',
        '_src/*',
        '_src/assets/**/*',
        '_src/fonts/**/*',
        '_src/styles/plugins/**/*.css',
        '_src/scripts/plugins/**/*.js',
    ], {base: '_src'})
        .pipe(dest('dist'))
}

function browserSync() {
    browser_sync.init({
        server: {
            baseDir: ['dist/pages', 'dist'],
            directory: true,
        },
        port: 3000,
        notify: false
    });
}

function watching() {
    watch(['_src/pages/**/*.html'], html);
    watch(['_src/styles/**/*.scss'], styles);
    watch(['_src/scripts/**/*.js', '!_src/scripts/script.min.js'], scripts);
    watch(['_src/images/**/*.{jpg,png,svg,gif,ico,webp}'], images);
    watch(['_src/pages/**/*.html']).on('change', browser_sync.reload);
    watch(['_src/fonts/**/*', '_src/assets/**/*', '_src/styles/plugins/**/*.css', '_src/scripts/plugins/**/*.js',], build);
}

function cleanDist() {
    return del('dist')
}

exports.html        = html;
exports.styles      = styles;
exports.scripts     = scripts;
exports.images      = images;
exports.watching    = watching;
exports.cleanDist   = cleanDist;
exports.browserSync = browserSync;


exports.build = series(cleanDist, build, html, styles, scripts, images);
exports.default = parallel(html, styles, scripts, images, build, watching, browserSync);