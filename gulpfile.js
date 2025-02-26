const gulp = require('gulp');
const del = require('del');
const through = require('through2');
const size = require('gulp-size');
const tap = require("gulp-tap");
const babel = require('gulp-babel');
const svgmin = require('gulp-svgmin');
const flatmap = require('gulp-flatmap');
const babelMinify = require("gulp-babel-minify");
const sitemap = require('gulp-sitemap');
const uglify = require('gulp-uglify');
const prettyData = require('gulp-pretty-data');
const sass = require('sass');
const gulpSass = require('gulp-sass')(sass);
const useref = require('gulp-useref');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const filter = require('gulp-filter');
const cssnano = require('cssnano');
const presetEnv = require('postcss-preset-env');
const closureCompiler = require('google-closure-compiler').gulp();
const mergeLonghand = require('postcss-merge-longhand');
const cleanCSS = require('gulp-clean-css');
const minifyHtml = require("@minify-html/node");

gulp.task('css', function () {
  const plugins = [
    presetEnv({
      minimumVendorImplementations: 2,
      logical: {
        inlineDirection: 'right-to-left',
        blockDirection: 'top-to-bottom',
      },
    }),
    autoprefixer(),
    mergeLonghand(),
    cssnano({
      preset: ['advanced', {}],
    }),
  ];

  return gulp.src('scss/*.scss')
    .pipe(gulpSass().on('error', gulpSass.logError))
    .pipe(postcss(plugins))
    .pipe(cleanCSS({
      level: 2,
    }))
    .pipe(gulp.dest('public/css'));
});

gulp.task('html', () => {
  const filterHtml = filter(['*.html'], { restore: true });
  const filterJS = filter(['*.js'], { restore: true });
  return gulp.src(['**/*.html', '!public/**', '!node_modules/**'])
    .pipe(useref())
    .pipe(filterJS)
    .pipe(babel({
      presets: ['@babel/env'],
    }))
    .pipe(flatmap((stream, file) => {
      return stream.pipe(closureCompiler({
        compilation_level: 'ADVANCED',
        js_output_file: file.path,
      }));
    }))
    .pipe(filterJS.restore)
    .pipe(filterHtml)
    .pipe(tap((file) => {
      file.contents = Buffer.from(
        minifyHtml.minify(
         file.contents, {
          keep_closing_tags: true,
          do_not_minify_doctype: true,
          ensure_spec_compliant_unquoted_attribute_values: true,
          minify_js: true,
        }).toString()
      );
    }))
    .pipe(filterHtml.restore)
    .pipe(gulp.dest('public'));
});

gulp.task('sitemap', () => {
  return gulp.src(['**/*.html', '!public/**', '!node_modules/**'], { read: false })
    .pipe(sitemap({
      siteUrl: 'https://www.oceansidechess.org/',
    }))
    .pipe(prettyData({
      type: 'minify',
      preserveComments: false,
    }))
    .pipe(gulp.dest('public'));
});

gulp.task('favicon', () => {
  const svgFilter = filter(['*.svg'], { restore: true });
  const xmlFilter = filter(['*.xml', '*.webmanifest'], { restore: true });
  return gulp.src(['favicons/*', '!favicons/src/**'], {encoding: false})
    .pipe(svgFilter)
    .pipe(svgmin({
      multipass: true,
      full: true,
    }))
    .pipe(svgFilter.restore)
    .pipe(xmlFilter)
    .pipe(prettyData({
      type: 'minify',
      preserveComments: false,
      extensions: { 'webmanifest': 'json' },
    }))
    .pipe(xmlFilter.restore)
    .pipe(gulp.dest('public/fav'));
});

gulp.task('img', () => {
  return gulp.src(['uploads/**', '!uploads/**/*.svg'], {encoding: false})
    .pipe(gulp.dest('public/uploads'));
});

gulp.task('svg', () => {
  const svg = filter(['*.svg'], { restore: true });
  return gulp.src('uploads/**/*.svg', {encoding: false})
    .pipe(svg)
    .pipe(svgmin({ multipass: true, full: true }))
    .pipe(svg.restore)
    .pipe(gulp.dest('public/uploads'));
});

gulp.task('audio', () => gulp.src('uploads/audio/*.mp3').pipe(gulp.dest('public/uploads/audio')));

gulp.task('fonts', function () {
  const svgFilter = filter(['*.svg'], { restore: true });
  return gulp.src('uploads/fonts/*', {encoding: false})
    .pipe(svgFilter)
    .pipe(svgmin({ multipass: true, full: true }))
    .pipe(svgFilter.restore)
    .pipe(gulp.dest('public/uploads/fonts'));
});

gulp.task('clean_public', () => del(['public/**'], { force: true }));

gulp.task('babel-minify', () => {
  return gulp.src('public/js/**', {encoding: false})
    .pipe(babelMinify({
      mangle: { keepClassName: true },
    }))
    .pipe(uglify())
    .pipe(gulp.dest('public/js/'));
});

gulp.task('empty', function () {
  return gulp.src('public/**', {encoding: false})
    .pipe(size({ showFiles: true }))
    .pipe(through.obj((file, enc, cb) => {
      if (file.contents && !file.isDirectory() && file.contents.length === 0) {
        del(file.path, { force: true }).then(() => cb(null, file));
      } else {
        cb(null, file);
      }
    }));
});

gulp.task('robots-txt', function () {
  return gulp.src('robots.txt')
    .pipe(gulp.dest('public/'));
});

gulp.task('archive', function () {
  return gulp.src(['archive/**', '!archive/index.html'], {encoding: false})
    .pipe(gulp.dest('public/archive/'));
});

gulp.task('default', gulp.series('clean_public','html', gulp.parallel('sitemap', 'css', 'svg', 'img', 'favicon', 'fonts', 'babel-minify', 'audio', 'robots-txt', 'archive')));
