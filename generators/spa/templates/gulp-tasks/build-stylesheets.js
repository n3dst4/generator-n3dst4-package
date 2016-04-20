import path from "path"
import gulp from "gulp"

import plumber from "gulp-plumber"
import less from "gulp-less"
import rework from 'gulp-rework';
import reworkAssets from "rework-assets";
import csso from "gulp-csso";
import gulpIf from "gulp-if";
import {reload} from 'browser-sync';

var production = process.env.NODE_ENV === "production";

export default function () {
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
}
