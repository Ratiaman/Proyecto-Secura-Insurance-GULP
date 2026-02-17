const gulp = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass')(require('sass'));
const cleanCss = require('gulp-clean-css');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const terser = require('gulp-terser');
const streamqueue = require('streamqueue');
const flatten = require('gulp-flatten');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const browserSync = require('browser-sync').create();
const mkdirp = require('mkdirp');

const path = {
  pug: ['src/pug/*.pug'],
  sass: 'src/sass/main.scss',
  images: ['src/images/**/*.*'],
  js: ['src/javascript/custom/[^_]*.js'],
  jsLibs: ['src/javascript/libs/[^_]*.js'],
  jsPrimaryLibs: ['src/javascript/primaryLibs/[^_]*.js'],
  minifyedLibs: ['src/javascript/minifyedLibs/[^_]*.js'],
  fonts: 'src/sass/fonts/**/*.*',
  locale: ['src/pug/locale/**/[^_]*.json'],
  localeComponents: ['src/pug/components/**/locale/**/[^_]*.json'],
  build: 'build/',
  buildCSS: 'build/css',
  buildFONTS: 'build/css/fonts',
  buildJS: 'build/js/',
  buildIMAGES: 'build/images',
  buildLocale: 'build/locale/',
  libCSS: 'src/sass/lib/*.css',
  buildLibCSS: 'build/css/lib/'
};

function buildLocale() {
  mkdirp.sync(path.buildLocale);
  return gulp.src(path.locale)
    .pipe(flatten({ includeParents: -1 }))
    .pipe(gulp.dest(path.buildLocale));
}
gulp.task('buildLocale', buildLocale);

function buildLocaleComponents() {
  mkdirp.sync(path.buildLocale);
  return gulp.src(path.localeComponents)
    .pipe(flatten({ includeParents: -1 }))
    .pipe(gulp.dest(path.buildLocale));
}
gulp.task('buildLocaleComponents', buildLocaleComponents);

gulp.task('buildPUG', () => gulp.src(path.pug).pipe(pug({ pretty: true })).pipe(gulp.dest(path.build)));

gulp.task('deployPUG', gulp.series(
  gulp.series('buildPUG', 'buildLocale', 'buildLocaleComponents'),
  function deployPUGTask() {
    return Promise.resolve();
  }
));

gulp.task('buildCSS', () => {
  const plugins = [autoprefixer({ overrideBrowserslist: ['last 2 versions', 'last 2 Chrome versions', 'last 2 ff versions', 'ie >= 10'] })];
  return gulp.src([path.libCSS, path.sass])
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('main.css'))
    .pipe(rename({ basename: 'main', extname: '.min.css' }))
    .pipe(cleanCss({ level: { 1: { specialComments: 0 } } }))
    .pipe(postcss(plugins))
    .pipe(gulp.dest(path.buildCSS));
});

gulp.task('deployCSS', gulp.series('buildCSS', function deployCSSTask() {
  return Promise.resolve();
}));

gulp.task('deployCustomCSS', () => {
  const plugins = [autoprefixer({ overrideBrowserslist: ['last 2 versions', 'last 2 Chrome versions', 'last 2 ff versions', 'ie >= 10'] })];
  return gulp.src(path.sass)
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('main.css'))
    .pipe(rename({ basename: 'main', extname: '.min.css' }))
  .pipe(cleanCss({ level: { 1: { specialComments: 0 } } }))
    .pipe(postcss(plugins))
    .pipe(gulp.dest(path.cssDestEs));
});

gulp.task('copyMinifyedLibs', () => gulp.src(path.minifyedLibs)
  .pipe(gulp.dest('build/js/libs')));

gulp.task('buildFONTS', () => gulp.src(path.fonts).pipe(gulp.dest(path.buildFONTS)));

gulp.task('deployFONTS', gulp.series('buildFONTS', function deployFONTSTask() {
  return Promise.resolve();
}));

gulp.task('buildJS', () => streamqueue({ objectMode: true },
  gulp.src(path.jsPrimaryLibs),
  gulp.src(path.jsLibs),
  gulp.src(path.js))
  .pipe(concat('main.js'))
  .pipe(gulp.dest(path.buildJS))
  .pipe(rename('main.min.js'))
    .pipe(terser())
  .pipe(gulp.dest(path.buildJS)));

  gulp.task('localeJS', function() {
    return Promise.resolve();
});

gulp.task('moveLocaleJS', gulp.series('localeJS', function moveLocaleJSTask() {
  return Promise.resolve();
}));

gulp.task('deployJS', gulp.series('buildJS', 'moveLocaleJS'));

gulp.task('deployCustomJS', () => streamqueue({ objectMode: true },
  gulp.src('src/javascript/libs/gsap.min.js'),
  gulp.src('src/javascript/libs/ScrollMagic.js'),
  gulp.src('src/javascript/libs/animation.gsap.js'),
  gulp.src(path.jsPrimaryLibs),
  gulp.src(path.jsLibs),
  gulp.src(path.js))
  .pipe(concat('main.js'))
  .pipe(rename('main.min.js'))
    .pipe(terser())
  .pipe(gulp.dest(path.jsDest)));

gulp.task('buildIMAGES', () =>
  gulp.src(path.images)
    .on('error', function(err) {
      console.error('Error copiando imágenes:', err.message);
      this.emit('end');
    })
    .pipe(gulp.dest(path.buildIMAGES))
);

gulp.task('deployIMAGES', gulp.series('buildIMAGES', function deployIMAGES() {
  return Promise.resolve();
}));

gulp.task('deployJS', gulp.series('buildJS', function ensureJsFolder(cb) {
  return Promise.resolve();
}));

gulp.task('build', gulp.series(
  'buildPUG',
  'buildCSS',
  'buildFONTS',
  'buildJS',
  'buildIMAGES',
  'buildLocale',
  'buildLocaleComponents',
  'copyMinifyedLibs'
));

gulp.task('deploy', gulp.series(
  'deployPUG',
  'deployCSS',
  'deployFONTS',
  'deployJS',
  'deployIMAGES',
  'copyMinifyedLibs',
  function startServer(cb) {
    browserSync.init({ server: { baseDir: "./build", directory: true } });
    cb();
  }
));

gulp.task('watch', () => {
  gulp.watch('src/pug/**/*.pug', gulp.series('deployPUG'));
  gulp.watch('src/sass/**/*.scss', gulp.series('deployCSS'));
  gulp.watch('src/images/**/*.*', gulp.series('deployIMAGES'));
  gulp.watch('src/javascript/**/*.js', gulp.series('deployJS'));
  gulp.watch('src/pug/locale/**/*.json', gulp.series('deployPUG'));
  gulp.watch('src/pug/components/**/locale/**/*.json', gulp.series('deployPUG'));
  gulp.watch('src/pug/components/**/*.scss', gulp.series('deployCSS'));
  gulp.watch('src/pug/components/**/*.js', gulp.series('deployJS'));
  gulp.watch('build/*.html').on('change', browserSync.reload);
  gulp.watch('build/css/**/*.css').on('change', browserSync.reload);
  gulp.watch('build/js/*.js').on('change', browserSync.reload);
});

gulp.task('default', gulp.series('deploy', 'watch'));
