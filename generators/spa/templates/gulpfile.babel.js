import gulp from "gulp"
import config from "./config"
import buildStylesheets from "./gulp-tasks/build-stylesheets"

gulp.task("default", ["build-html", "build-stylesheets"], function () {
  //console.log("hi")
})

gulp.task("build-html", function () {
  return gulp.src("pages/*.html").pipe(gulp.dest(config.buildFolder));
});

gulp.task("build-stylesheets", buildStylesheets)
