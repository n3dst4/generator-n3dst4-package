import gulp from "gulp"
import config from "./config"
import buildStylesheets from "./gulp-tasks/build-stylesheets"
import browserBundleHelper from "@n3dst4/browser-bundle"
import browserSync from "browser-sync"

const bs = browserSync.create()
const production = process.env.NODE_ENV === "production"

function browserBundle (opts = {}) {
  opts.production = production
  const bundleStream =  browserBundleHelper("src/main.js", "__generated/js/main.js", opts);
  bundleStream.on("updated", bs.reload)
  return bundleStream
}

gulp.task("default", ["build"])

gulp.task("build", ["build-html", "build-stylesheets", "build-scripts"])

gulp.task("build-scripts", function () {
  return browserBundle()
})

gulp.task("build-html", function () {
  return gulp.src("pages/*.html").pipe(gulp.dest(config.buildFolder)).pipe(bs.stream());
});

gulp.task("build-stylesheets", () => {
  buildStylesheets().pipe(bs.stream())
})

gulp.task("watch", ["build-scripts", "build-html"], function() {
  browserBundle({watch: true});
  gulp.watch(['config.json'], ['build-scripts', 'build-html']);
  gulp.watch(["pages/**/*.html"], ['build-html']);
  gulp.watch(["stylesheets/**/*.less"], ['build-stylesheets']);
});

gulp.task('webserver', function() {
  bs.init({
    server: {baseDir: "./__generated/"},
    reloadDelay: 0,
    ghostMode: false,
    reloadOnRestart: false,
    notify: false
  });
});

gulp.task("develop", ["watch", "webserver"]);
