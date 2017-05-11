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
        .pipe(gulp.dest('dist/css'))
        .pipe(gulp.dest('app/css'));
});

// Scan your HTML for assets & optimize them
gulp.task('html', () => {
  return gulp.src('app/**/*.html')
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
    .pipe(gulp.dest('dist'));
});

gulp.task('images', () =>
  gulp.src('app/img/**/*')
    .pipe($.imagemin({
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest('dist/img'))
    .pipe($.size({title: 'images'}))
);


gulp.task('serve', ['styles', 'images'], function () {
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
});

gulp.task('clean', () => del(['.tmp', 'dist/*', '!dist/.git'], {dot: true}));

// Build production files, the default task
gulp.task('default', ['clean'], () =>
  runSequence(
    'styles',
    'html'
  )
);
