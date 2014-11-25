var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify');

gulp.task('default', function() {
    return gulp.src(['src/gargoyle.js'])
    .pipe(concat('gargoyle.js'))
    .pipe(gulp.dest('./build/'))
    .pipe(uglify())
    .pipe(concat('gargoyle.min.js'))
    .pipe(gulp.dest('./build/'));
});