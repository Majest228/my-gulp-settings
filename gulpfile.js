const {src,dest,watch,parallel} = require('gulp');
const concat = require('gulp-concat');
const scss = require('gulp-sass');
const browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify-es').default;
const autoprefixer = require('gulp-autoprefixer');

//search index.html

const browsersync = () => {
	browserSync.init({
		server: {
			baseDir: 'app/'
		}
	})
}

//

//js -> min.js

const forJs = () => {
	return src([
		'node_modules/jquery/dist/jquery.js',
		'app/script/main.js'
	])
	.pipe(uglify())
	.pipe(concat('main.min.js'))
	.pipe(dest('app/script/'))
	.pipe(browserSync.stream())
}

//

//scss -> css

const forScss = () => {
	return src('app/scss/style.scss') //link to your scss file
	.pipe(scss({outputStyle : 'compressed'})) //view of your min.css style
	.pipe(concat('style.min.css'))//create style.min.css
	.pipe(autoprefixer({
		overrideBrowserslist : ['last 10 version'],
		grid: true												//webkit 
	}))
	.pipe(dest('app/css'))//five save path
	.pipe(browserSync.stream())//using browserSync
}

//
//building project

const building = () => {
	return src([
		'app/css/style.min.css',
		'app/script/main.min.js',
		'app/fonts/**/*',
		'app/*.html'
	], {base: 'app'})
	.pipe(dest('dist'))
}

//

//function start full project
const start = () => {
	watch(['app/scss/**/*.scss'],forScss)
	watch(['app/script/**/*.js','!app/script/main.min.js'],forJs)
	watch(['app/*.html']).on('change', browserSync.reload)
}

//function export

exports.forScss = forScss;
exports.start = start;
exports.browsersync = browsersync;
exports.forJs = forJs;
exports.building = building;

exports.default = parallel(forJs,browsersync,start)

//