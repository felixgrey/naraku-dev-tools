var gulp = require('gulp');
var del = require('del');
var rename = require("gulp-rename")
var vinylPaths = require('vinyl-paths');
var path = require('path');
var Transform = require('readable-stream/transform');

gulp.task('default',gulp.series(function() {
  // 将你的默认的任务代码放在这
  return Promise.resolve();
}));