const { src, dest, parallel } = require("gulp");
const min_html = require("gulp-htmlmin");
const min_css = require("gulp-css");

// css minification
function cssmin() {
  return src("assets/css/*.css").pipe(min_css()).pipe(dest("mini/css"));
}

//html minification
function indexmin() {
  return src("assets/*.html")
    .pipe(
      min_html({
        collapseWhitespace: true,
        removeComments: true,
        collapseBooleanAttributes: true,
        removeAttributeQuotes: true,
        removeEmptyAttributes: true,
        minifyJS: true,
        minifyCSS: true,
      })
    )
    .pipe(dest("mini/"));
}

//copying over js
function jscopy() {
  return src("assets/js/*").pipe(dest("mini/js/"));
}

exports.css = cssmin;
exports.html = indexmin;
exports.default = parallel(cssmin, indexmin, jscopy);
