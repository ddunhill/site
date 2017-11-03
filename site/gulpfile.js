//Init Libraries
var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');
var realFavicon = require ('gulp-real-favicon');
var fs = require('fs');

var bases = {
 app: 'app/',
 dist: 'dist/',
};

var paths = {
 fonts: ['app/fonts/**/*'],
 scripts: ['app/js/**/*.js'],
 css: ['app/css/**/*.min.css'],
 scss: ['app/scss/**/*.scss'],
 html: ['app/*.html'],
 images: ['app/images/**/*.+(png|jpg|gif|svg)'],
 extras: ['web.config', 'robots.txt', 'favicon.ico'],
 favhtml: ['dist/*.html'],
};

// Cleaning 
// --------

//Nuclear option
gulp.task('clean', function(callback) {
  del.sync(bases.dist);
  return cache.clearAll(callback);
})

gulp.task('clean:dist', function() {
  return del.sync(bases.dist);
})

gulp.task('clean:cache', function (callback) {
  return cache.clearAll(callback)
})


// Development Tasks 
// -----------------

// Start browserSync server - works on app folder doesn't need dist to be there
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: bases.app
    },
  })
})

gulp.task('sass', function(){
  return gulp.src(paths.scss) 
    .pipe(sass().on('error', sass.logError)) 
    .pipe(gulp.dest('app/css'))
	.pipe(browserSync.reload({
      stream: true
    }))
});

// Watchers
gulp.task('watch', ['browserSync', 'sass'], function (){
  gulp.watch(paths.scss, ['sass']); 
  // Other watchers
  gulp.watch(paths.html, browserSync.reload); 
  gulp.watch(paths.scripts, browserSync.reload);
    gulp.watch('app/analog-clock/**/*', browserSync.reload);
})

// Optimization Tasks 
// ------------------

// Copy HTML and Optimizing CSS and JavaScript 
gulp.task('useref', function(){
  return gulp.src(paths.html)
    .pipe(useref())
    // Minifies only if it's a JavaScript file
    .pipe(gulpIf('*.js', uglify()))
	// Minifies only if it's a CSS file
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest(bases.dist))
});

// Optimizing Images
gulp.task('images', function(){
  return gulp.src(paths.images)
  .pipe(cache(imagemin({
      // Setting interlaced to true
      interlaced: true
    })))
  .pipe(gulp.dest('dist/images'))
});

// Copying fonts 
gulp.task('fonts', function() {
  return gulp.src(paths.fonts)
  .pipe(gulp.dest('dist/fonts'))
})

//being included in useref
//// Copying css libs 
//gulp.task('css', function() {
//  return gulp.src(paths.css)
//  .pipe(gulp.dest('dist/css'))
//})

// Copying extra files 
gulp.task('extras', function() {
  return gulp.src(paths.extras, {cwd : bases.app})
  .pipe(gulp.dest(bases.dist))
})

// Build Sequences
// ---------------

gulp.task('build', function (callback) {
  runSequence('clean:dist', 
    ['sass', 'useref', 'images', 'fonts', 'extras'],
    callback
  )
})

gulp.task('all-build', function (callback) {
  runSequence('clean:dist', 
    ['sass', 'useref', 'images', 'fonts', 'extras','favicon','inject-favicon'],
    callback
  )
})
//default - will run from cmd line with just the cmd gulp (no options)
gulp.task('default', function (callback) {
  runSequence(['sass','browserSync', 'watch'],
    callback
  )
})

//favicon stuff
//https://realfavicongenerator.net/favicon_result?file_id=p1brov7rj71al9hld10r9f0bdds6&technology=gulp#.WdeKbmhSxPY
//

// File where the favicon markups are stored
var FAVICON_DATA_FILE = 'faviconData.json';

// Generate the icons. This task takes a few seconds to complete.
// You should run it at least once to create the icons. Then,
// you should run it whenever RealFaviconGenerator updates its
// package (see the check-for-favicon-update task below).
gulp.task('favicon', function(done) {
	realFavicon.generateFavicon({
		masterPicture: 'assets/images/Logo.png',
		dest: bases.dist,
		iconsPath: '/',
		design: {
			ios: {
				pictureAspect: 'backgroundAndMargin',
				backgroundColor: '#ffffff',
				margin: '14%',
				assets: {
					ios6AndPriorIcons: false,
					ios7AndLaterIcons: false,
					precomposedIcons: false,
					declareOnlyDefaultIcon: true
				}
			},
			desktopBrowser: {},
			windows: {
				pictureAspect: 'noChange',
				backgroundColor: '#da532c',
				onConflict: 'override',
				assets: {
					windows80Ie10Tile: false,
					windows10Ie11EdgeTiles: {
						small: false,
						medium: true,
						big: false,
						rectangle: false
					}
				}
			},
			androidChrome: {
				pictureAspect: 'noChange',
				themeColor: '#ffffff',
				manifest: {
					display: 'standalone',
					orientation: 'notSet',
					onConflict: 'override',
					declared: true
				},
				assets: {
					legacyIcon: false,
					lowResolutionIcons: false
				}
			},
			safariPinnedTab: {
				pictureAspect: 'silhouette',
				themeColor: '#5bbad5'
			}
		},
		settings: {
			scalingAlgorithm: 'Mitchell',
			errorOnImageTooSmall: false
		},
		markupFile: FAVICON_DATA_FILE
	}, function() {
		done();
	});
});

// Inject the favicon markups in your HTML pages. You should run
// this task whenever you modify a page. You can keep this task
// as is or refactor your existing HTML pipeline.
gulp.task('inject-favicon', function() {
	return gulp.src(paths.favhtml)
		.pipe(realFavicon.injectFaviconMarkups(JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).favicon.html_code))
		.pipe(gulp.dest(bases.dist));
});

// Check for updates on RealFaviconGenerator (think: Apple has just
// released a new Touch icon along with the latest version of iOS).
// Run this task from time to time. Ideally, make it part of your
// continuous integration system.
gulp.task('check-for-favicon-update', function(done) {
	var currentVersion = JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).version;
	realFavicon.checkForUpdates(currentVersion, function(err) {
		if (err) {
			throw err;
		}
	});
});