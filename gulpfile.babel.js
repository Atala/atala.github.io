/*
    Inspired by Web Starter Kit (https://github.com/google/web-starter-kit) gulpfile
*/

'use strict';

import gulp from 'gulp';
import del from 'del';
import runSequence from 'run-sequence';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

/**
 * Helper function to amend the pipe when a build task fails
 * see https://github.com/hughsk/vinyl-transform/issues/1
 * and: https://github.com/gulpjs/gulp/issues/259
 * @param {string} err  the error string
 */
function onError (err) {
    console.log(err);
    this.emit('end'); // jshint ignore:line
}

gulp.task('styles', () => {
    const AUTOPREFIXER_BROWSERS = [
        'ie >= 10',
        'ie_mob >= 10',
        'ff >= 30',
        'chrome >= 34',
        'safari >= 7',
        'opera >= 23',
        'ios >= 7',
        'android >= 4.4',
        'bb >= 10'
    ];

    return gulp.src(['node_modules/normalize.css/normalize.css',
                     'app/css/main.scss'])
        .pipe($.sourcemaps.init())
        .pipe($.sass({
            precision: 10
        })).on('error', $.sass.logError)
        .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
        .pipe($.size({title: 'styles'}))
        .pipe($.sourcemaps.write('./'))
        .pipe($.concat('style.css'))
        .pipe(gulp.dest('./css'))
        .pipe(gulp.dest('app/css'));
});

// Scan your HTML for assets & optimize them
gulp.task('html', () => {
  return gulp.src('app/**/*.html')
    .pipe($.useref({
      searchPath: '{app}',
      noAssets: true
    }))
    // Minify any HTML
    .pipe($.if('*.html', $.htmlmin({
      removeComments: true,
      collapseWhitespace: true,
      collapseBooleanAttributes: true,
      removeAttributeQuotes: true,
      removeRedundantAttributes: true,
      removeEmptyAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      removeOptionalTags: true
    })))
    // Output files
    .pipe($.if('*.html', $.size({title: 'html', showFiles: true})))
    .pipe(gulp.dest('.'));
});

// Copy all the non-HTML files at the root level
gulp.task('copy', () =>
  gulp.src([
    'app/*',
    '!app/*.html',
  ], {
    dot: true
  }).pipe(gulp.dest('.'))
    .pipe($.size({title: 'copy'}))
);

gulp.task('copy-smoothscroll', () =>
  gulp.src([
    './app/scripts/smooth-scroll.min.js',
  ], {
    dot: true
  }).pipe(gulp.dest('./scripts'))
);

gulp.task('images', () =>
  gulp.src('app/img/**/*')
    .pipe($.imagemin({
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest('./img'))
    .pipe($.size({title: 'images'}))
);

// Concatenate and minify JavaScript. Optionally transpiles ES2015 code to ES5.
// to enable ES2015 support remove the line `"only": "gulpfile.babel.js",` in the
// `.babelrc` file.
gulp.task('scripts', () =>
    gulp.src([
      // Note: Since we are not using useref in the scripts build pipeline,
      //       you need to explicitly list your scripts here in the right order
      //       to be correctly concatenated
      './app/scripts/main.js'
      // Other scripts
    ])
      .pipe($.plumber({
            errorHandler: onError
      }))
      .pipe($.sourcemaps.init())
      .pipe($.babel())
      .pipe($.sourcemaps.write())
      .pipe($.concat('main.min.js'))
      .pipe($.uglify({preserveComments: 'some'}))
      // Output files
      .pipe($.size({title: 'scripts'}))
      .pipe($.sourcemaps.write('.'))
      .pipe(gulp.dest('./scripts'))
);

// Build and serve the output from the dist build
gulp.task('serve:dist', ['default'], () =>
  browserSync({
    notify: false,
    logPrefix: 'WSK',
    // Allow scroll syncing across breakpoints
    scrollElementMapping: ['main', '.mdl-layout'],
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    server: '.',
    port: 3001
  })
);


gulp.task('serve', ['styles', 'images', 'scripts'], function () {
    browserSync({
      notify: false,
      // Customize the Browsersync console logging prefix
      logPrefix: 'WSK',
      // Allow scroll syncing across breakpoints
      scrollElementMapping: ['main', '.mdl-layout'],
      // // Run as an https by uncommenting 'https: true'
      // // Note: this uses an unsigned certificate which on first access
      // //       will present a certificate warning in the browser.
      // // https: true,
      server: ['app']
    });

    gulp.watch(['app/**/*.html'], reload);
    gulp.watch(['app/css/**/*.scss'], ['styles', reload]);
    gulp.watch(['app/img/**/*'], ['images', reload]);
    gulp.watch(['app/scripts/**/*.js'], ['scripts', reload]);
});

gulp.task('clean', () => del(['.tmp', 'docs/*', '!docs/.git'], {dot: true}));

// Build production files, the default task
gulp.task('default', ['clean'], () =>
  runSequence(
    'styles',
    ['html', 'images', 'copy', 'scripts', 'copy-smoothscroll']
  )
);
