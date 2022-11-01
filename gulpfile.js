const gulp = require("gulp");
const replace = require("gulp-replace");
const rename = require("gulp-rename");
const rimraf = require("rimraf");
const util = require("gulp-util");
const convergeQA = "https://demo.convergepay.com/hosted-payments/PayWithConverge.js";
const convergePR = "https://api.convergepay.com/hosted-payments/PayWithConverge.js";
const env = util.env.env;

const GTM_UAT = 'GTM-TJ76L76';
const GTM_PR = 'GTM-P5JM6ZR';

gulp.task("clean", cb => {
  rimraf('./src/index.html', cb)
});

gulp.task('prepare',
  gulp.parallel("clean", () => {
    const url = env !== 'prod' ? convergeQA : convergePR;
    const GTM = env !== 'prod' ? GTM_UAT : GTM_PR;
    
    return gulp.src('./src/index.html.example')
      .pipe(replace(/{{corverageUrl}}/g, url))
      .pipe(replace(/{{GTM_ID}}/g, GTM))
      .pipe(rename("index.html"))
      .pipe(gulp.dest('./src'))
  })
);

