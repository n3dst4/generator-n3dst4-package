import path from "path"
import gulp from "gulp"
import config from "./config"

import plumber from "gulp-plumber"
import less from "gulp-less"
import rework from 'gulp-rework';
import reworkAssets from "rework-assets";
import csso from "gulp-csso";
import gulpIf from "gulp-if";
import {reload} from 'browser-sync';

//var gulp = require("gulp")

var production = process.env.NODE_ENV === "production";


gulp.task("default", ["build-html", "build-stylesheets"], function () {
  //console.log("hi")
})

////////////////////////////////////////////////////////////////////////////////
// copy html to output
gulp.task("build-html", function () {
    return gulp.src("pages/*.html").pipe(gulp.dest(config.buildFolder));
});

gulp.task("build-stylesheets", function () {
  return gulp.src(path.join("stylesheets", "main.less")).
    pipe(plumber()).
    // run everything through LESS, converting URLs to be relative to output
    pipe(less({relativeUrls: true})).
    // use "rework" and "rework-assets" to copy fonts, images etc
    pipe(rework(reworkAssets({
      src: "stylesheets",
      dest: "__generated/css/assets",
      prefix: "assets/"
    }))).
    // minify if needed
    pipe(gulpIf(production, csso())).
    // save
    pipe(gulp.dest(path.join("__generated", "css"))).
    pipe(reload({stream: true}))
})
