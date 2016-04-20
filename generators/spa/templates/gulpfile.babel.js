import gulp from "gulp"
import config from "./config"

//var gulp = require("gulp")

gulp.task("default", ["build-html"], function () {
  console.log("hi")
})

////////////////////////////////////////////////////////////////////////////////
// copy html to output
gulp.task("build-html", function () {
    return gulp.src("pages/*.html").pipe(gulp.dest(config.buildFolder));
});
