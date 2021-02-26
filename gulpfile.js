const {
	src,
	dest,
	parallel,
	series,
	watch
} = require('gulp');

const project__folder = 'dist'
source__folder = 'app',
	gulp = require('gulp'),
	browsersync = require('browser-sync').create(),
	fileinclude = require('gulp-file-include'),
	del = require('del'),
	scss = require('gulp-sass'),
	path = {
		build: {
			html: project__folder + '/',
			css: project__folder + '/css/',
			js: project__folder + '/js/',
			images: project__folder + '/images/',
			fonts: project__folder + '/fonts',
		},
		app: {
			html: [source__folder + '/*.html', '!' + source__folder + '/_*.html'],
			css: source__folder + '/scss/style.scss',
			js: source__folder + '/js/main.js',
			images: source__folder + '/images/**/*.{jpg,png,svg,gif,ico,webp}',
			fonts: source__folder + '/fonts/*.ttf',
		},
		watch: {
			html: source__folder + '/**/*.html',
			css: source__folder + '/scss/**/*.scss',
			js: source__folder + '/js/**/*.js',
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
		.pipe(browsersync.stream())
}
const watchFiles = () => {
	watch([
		path.watch.html
	], html),
	watch([
		path.watch.css
	], css)
}
const clean = () => {
	return del(path.clean)
}

const build = series(clean,parallel(css,html))
const start = parallel(watchFiles, build, browserSync);

exports.css = css;
exports.build = build;
exports.html = html;
exports.start = start;
exports.default = start;