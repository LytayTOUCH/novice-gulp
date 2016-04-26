var gulp = require('gulp'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    sass = require('gulp-sass'),
    plumber = require('gulp-plumber'),
    uglify = require('gulp-uglify'),
    coffee = require('gulp-coffee'),
    concat = require('gulp-concat'),
    es = require('event-stream'),
    inject = require('gulp-inject');

function showlog(msg){
    return console.log(msg);
}
gulp.task('inject', function(){
  // showlog('start inject task');
  var target = gulp.src('app/index.html');
  // showlog(target);
  var sources = gulp.src(['app/js/*.js', 'app/css/*.css'], {read: false});
  // showlog(sources);
  target.pipe(inject(sources, {relative: true})).pipe(gulp.dest('app'));
  // showlog('end inject task');
});

gulp.task('sass', function(){
  console.log('Scss Task!');
  gulp.src('app/scss/**/*.scss')
      .pipe(plumber())
      .pipe(sass({outputStyle: 'expanded'}))
      .pipe(gulp.dest('app/css'))
      .pipe(reload({stream:true}));
});

gulp.task('styles', function(){
  console.log('styles Task!');
  console.log('Test Style task!');
});

gulp.task('coffee', function(){
  console.log('Coffee Task!');
  var JavaScriptFromCoffee = gulp.src('app/coffee/**/*.coffee').pipe(coffee());
  var js = gulp.src(['app/js/**/*.js', '!app/js/**/*.js']);
  return es.merge(JavaScriptFromCoffee, js)
    .pipe(concat('all.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('app/js'));
});

gulp.task('javascripts', function(){
  console.log('scripts Task!');
});

gulp.task('html', function(){
  gulp.src('app/**/*.html')
      .pipe(reload({stream:true}));
});

gulp.task('browserSync', function(){
  console.log('browserSync Task!');
  browserSync({
    server:{
      baseDir: "./app/"
    }
  });
});

gulp.slurped = false; // step 1

gulp.task('watch', function(){
  console.log('Watch Task!');
  if(!gulp.slurped){ // step 2
    gulp.watch("gulpfile.js", ["default"]);
    gulp.watch('app/js/**/*.js', ['javascripts']);
    gulp.watch('app/coffee/**/*.coffee', ['coffee']);
    gulp.watch('app/scss/**/*.scss', ['sass']);
    gulp.watch('app/**/*.html', ['html']);
    gulp.slurped = true; // step 3
  }
});

gulp.task('default', ['sass', 'styles', 'inject', 'coffee', 'javascripts', 'html', 'browserSync', 'watch'], function(){
  console.log('Start Task ...');
});
