var gulp        = require("gulp"),
   clean        = require('gulp-clean'),
	 sass         = require("gulp-sass"),
	 browserSync  = require("browser-sync"),
	 concat       = require("gulp-concat"),
	 uglify       = require("gulp-uglifyjs"),
	 cssnano      = require("gulp-cssnano"),
	 rename       = require("gulp-rename"),
	 del          = require("del"),
	 imagemin     = require("gulp-imagemin"),
	 pngquant     = require("imagemin-pngquant"),
	 cache        = require("gulp-cache"),
	 autoprefixer = require("gulp-autoprefixer"),
	 rimraf       = require("rimraf"),
	 rigger       = require("gulp-rigger"),
	 plumber      = require("gulp-plumber");

var path = {
	src: { // Where are we working
		html: "app/pages/*.html",
		templates: "app/templates/*.html",
		js: "app/js/main.js",
		sass: "app/sass/main.sass",
		img: "app/img/**/*.*",
		fonts: "app/fonts/**/*.*"
	},
	watch: { // What files we want to wathcing for
		html: "app/**/*.html",
		js: "app/js/**/*.js",
		sass: "app/sass/**/*.sass",
		fonts: "app/css/fonts/**/*.*"
	},
	build: {
		html: "dist/",
		js: "dist/js/",
		css: "dist/css/",
		img: "dist/img",
		fonts: "dist/fonts"
	},
	clean: "./dist"
};

gulp.task("html", function() {
	gulp.src([path.src.html])
		.pipe(rigger())
		.pipe(gulp.dest("app/"))
		.pipe(browserSync.reload({stream:true}));
});

gulp.task("sass", function() {
	gulp.src(path.src.sass)
		.pipe(plumber())
		.pipe(sass())
		.pipe(autoprefixer(["last 15 versions", "> 1%", "ie 8", "ie 7"], {cascade: true}))
		.pipe(rename("main.min.css"))
		.pipe(gulp.dest("app/css"))
		.pipe(browserSync.reload({stream:true}));
});

gulp.task("js", function() {
		gulp.src(path.src.js)
		.pipe(rigger())
		.pipe(concat("main.min.js"))
		.pipe(gulp.dest("app/js/"));
});

gulp.task("js-watch", function() {
		gulp.src(path.src.js)
		.pipe(rigger())
		.pipe(concat("main.min.js"))
		.pipe(gulp.dest("app/js/"))
		.pipe(browserSync.reload({stream:true}));
});

gulp.task("clear", function() {
	return cache.clearAll();
});

gulp.task("browser-sync", function() {
	browserSync({
		server: {
			baseDir: "./app"
		},
		port: 8080,
		notify: false
	});
});

gulp.task("watch",["sass", "js", "html"], function() {
	gulp.watch([path.src.html], ["html"], browserSync.reload);
	gulp.watch([path.watch.sass], ["sass"], browserSync.reload);
	gulp.watch([path.watch.js], ["js-watch"], browserSync.reload);
});

gulp.task('default', ["browser-sync", "watch"]);

/*
BUILDING
*/

gulp.task("clean", function() {
	return del.sync("dist");
});

gulp.task("html:build", function() {
	gulp.src("app/*.html")
		.pipe(gulp.dest(path.build.html));
});

gulp.task("css:build", function() {
	gulp.src("app/css/main.min.css")
		.pipe(cssnano())
		.pipe(gulp.dest(path.build.css));
});

gulp.task("js:build", function() {
	gulp.src("app/js/main.js")
		.pipe(rigger())
		.pipe(concat("main.min.js"))
		.pipe(uglify())
		.pipe(gulp.dest(path.build.js));
});

gulp.task("img:build", function() {
	gulp.src(path.src.img)
	.pipe(cache(imagemin({
		interlaced: true,
		progressive: true,
		svgoPlugins: [{removeViewBox: false}],
		use: [pngquant()]
	})))
	.pipe(gulp.dest(path.build.img));
});

gulp.task("fonts:build", function() {
	gulp.src(path.src.fonts)
	.pipe(gulp.dest(path.build.fonts));
});

gulp.task("build", ["clean", "html:build", "css:build", "js:build", "img:build", "fonts:build"], function() {

});