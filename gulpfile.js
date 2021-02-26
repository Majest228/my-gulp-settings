const {
	src,
	dest,
	parallel,
	series,
	watch
} = require('gulp');

const project__folder = 'dist',
	source__folder = 'app',
	browsersync = require('browser-sync').create(),
	fileinclude = require('gulp-file-include'),
	del = require('del'),
	scss = require('gulp-sass'),
	autoPrefixer = require('gulp-autoprefixer'),
	rename = require('gulp-rename'),
	gcmq = require('gulp-group-css-media-queries'),
	cleanCSS = require('gulp-clean-css'),
	uglifyEs = require('gulp-uglify-es').default,
	path = {
		build: {
			html: project__folder + '/',
			css: project__folder + '/css/',
			js: project__folder + '/script/',
			images: project__folder + '/images/',
			fonts: project__folder + '/fonts',
		},
		app: {
			html: [source__folder + '/*.html', '!' + source__folder + '/_*.html'],
			css: source__folder + '/scss/style.scss',
			js: source__folder + '/script/main.js',
			images: source__folder + '/images/**/*.{jpg,png,svg,gif,ico,webp}',
			fonts: source__folder + '/fonts/*.ttf',
		},
		watch: {
			html: source__folder + '/**/*.html',
			css: source__folder + '/scss/**/*.scss',
			js: source__folder + '/script/**/*.js',
			images: source__folder + '/images/**/*.{jpg,png,svg,gif,ico,webp}',
		},
		clean: './' + project__folder + '/'
	}

const browserSync = () => {
	browsersync.init({
		server: {
			baseDir: './' + project__folder + '/'
		},
		port: 3000,
	})
}

const html = () => {
	return src(path.app.html)
		.pipe(fileinclude())
		.pipe(dest(path.build.html))
		.pipe(browsersync.stream())
}


const css = () => {
	return src(path.app.css)
		.pipe(scss({
			outputStyle : 'compressed'
		}))
		.pipe(dest(path.build.css))
		.pipe(autoPrefixer({
			overrideBrowserslist : ['last 10 versions'],
			cascade : true
		}))
		.pipe(gcmq())
		.pipe(cleanCSS())
		.pipe(rename({
			extname : '.min.css'
		}))
		.pipe(dest(path.build.css))
		.pipe(browsersync.stream())
}

const js = () => {
	return src(path.app.js)
		.pipe(fileinclude())
		.pipe(dest(path.build.js))
		.pipe(rename({
			extname : '.min.js'
		}))
		.pipe(uglifyEs())
		.pipe(dest(path.build.js))
		.pipe(browsersync.stream())
}

const watchFiles = () => {
	watch([
		path.watch.html
	], html),
	watch([
		path.watch.css
	], css),
	watch([
		path.watch.js
	], js)
}
const clean = () => {
	return del(path.clean)
}

const build = series(clean,parallel(js,css,html));
const start = parallel(watchFiles, build, browserSync);

exports.js = js;
exports.css = css;
exports.build = build;
exports.html = html;
exports.start = start;
exports.default = start;