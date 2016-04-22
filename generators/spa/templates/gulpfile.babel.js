import gulp from "gulp"
import config from "./config"
import buildStylesheets from "./gulp-tasks/build-stylesheets"
// having trouble loading this when node_modules is symlinked to generator
import browserBundle from "@n3dst4/browser-bundle"


gulp.task("default", ["build-html", "build-stylesheets", "build-scripts"])

gulp.task("build-scripts", function () {
  browserBundle("src/main.js", "__generated/js/main.js")
})

gulp.task("build-html", function () {
  return gulp.src("pages/*.html").pipe(gulp.dest(config.buildFolder));
});

gulp.task("build-stylesheets", buildStylesheets)
