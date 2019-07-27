const gulp = require("gulp");
const concat = require("gulp-concat");
const prefix = require("gulp-autoprefixer");
const sass = require("gulp-sass");
const pug = require("gulp-pug");
const livereload = require("gulp-livereload");
// const sourcemaps = require("gulp-sourcemaps");
const uglify = require("gulp-uglify");
// const notify = require("gulp-notify");
// const zip = require("gulp-zip");
const babel = require("gulp-babel");
const javascriptObfuscator = require("gulp-javascript-obfuscator");

const jsDir = "stage/**/*.js";
const sassDir = "stage/**/*.scss";
const pugDir = "stage/**/index.pug";

// CSS Task
gulp.task("sass", function() {
  return gulp
    .src(sassDir)
    .pipe(sass({ outputStyle: "compressed" }))
    .pipe(prefix("last 2 versions"))
    .pipe(concat("style.css"))
    .pipe(gulp.dest("dist/css/"))
    .pipe(livereload());
});

// JS Task
gulp.task("js", function() {
  return gulp
    .src(jsDir)
    .pipe(concat("script.js"))
    .pipe(
      babel({
        presets: ["@babel/env"]
      })
    )
    .pipe(uglify())
    .pipe(javascriptObfuscator())
    .pipe(gulp.dest("dist/js/"))
    .pipe(livereload());
});

// HTML Task
gulp.task("html", function() {
  return gulp
    .src(pugDir)
    .pipe(concat("index.html"))
    .pipe(
      pug({
        pretty: true
      })
    )
    .pipe(gulp.dest("dist/"))
    .pipe(livereload());
});

// Watch Task
gulp.task("watch", function() {
  require("./server.js");
  livereload.listen();
  gulp.watch("stage/**/*.pug", gulp.series("html"));
  gulp.watch(jsDir, gulp.series("js"));
  gulp.watch(sassDir, gulp.series("sass"));
});

gulp.task("default", gulp.series("watch"));
