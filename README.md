# Gulp + Bootstrap 5 Starter (2025)

## Project Description
A modern front-end starter template using Gulp for automation and Bootstrap 5 for responsive design. Includes Pug templating, Sass for styles, and a modular folder structure for scalable web development.

---

## Folder Architecture
```
src/
├── images/
├── javascript/
│   ├── custom/
│   └── primaryLibs/
├── pug/
│   ├── components/
│   ├── fragments/
│   ├── layouts/
│   ├── templates/
│   └── home.pug
├── sass/
│   ├── base/
│   ├── components/
│   ├── fonts/
│   ├── fragments/
│   ├── helpers/
│   ├── layout/
│   ├── lib/
│   └── main.scss
```
Other root files:
- gulpfile.js
- package.json
- README.md

---

## Main Technologies & Versions
- **Node.js**: >=22.0.0
- **Gulp**: ^4.0.2
- **Bootstrap Grid**: src/sass/lib/bootstrap-grid.min.css
- **Sass**: ^1.69.5
- **Pug**: ^5.0.0

---

## Dependencies
**Production:**
- animate.css: ^4.1.1
- autoprefixer: ^10.4.21
- express: ^4.18.2
- gulp-clean: ^0.4.0
- gulp-clean-css: ^4.3.0
- gulp-concat: ^2.6.0
- gulp-flatten: ^0.4.0
- gulp-html-i18n: ^0.16.0
- gulp-postcss: ^10.0.0
- gulp-pug: ^5.0.0
- gulp-rename: ^1.2.2
- gulp-sass: ^5.1.0
- gulp-terser: ^2.1.0
- gulp-uglify: ^3.0.0
- mkdirp: ^3.0.1
- npm: ^11.5.2
- sass: ^1.69.5
- streamqueue: ^1.1.1

**Development:**
- browser-sync: ^3.0.4
- compression: ^1.7.4
- gulp-autoprefixer: ^9.0.0
- gulp-sourcemaps: ^2.6.5
- merge-stream: ^2.0.0

---

## Essential Commands
```bash
# Install dependencies
npm install

# Run development server (with Gulp tasks)
npm start

# Compile assets (CSS, JS, HTML)
gulp

# Run linters or tests (if configured)
# No tests configured by default
npm test
```

---

## Additional Notes
- **Configuration:**
  - Node.js >=22 required (see `engines` in package.json).
  - Gulp tasks are defined in `gulpfile.js`.
  - Custom variables and mixins in `src/sass/helpers/`.
- **Environment Variables:**
  - Not required by default. Add `.env` if needed for custom setups.
- **Known Issues:**
  - No test suite configured.
  - For local server, use BrowserSync (see gulpfile.js).
  - Some tasks may require increased memory (`--max-old-space-size=8192`).

---

## References
- [Node.js v22.11.0](https://nodejs.org/en/blog/release/v22.11.0)
- [Gulp Documentation](https://gulpjs.com/docs/en/getting-started/quick-start)
- [Tailwind CSS](https://tailwindcss.com/docs/installation)
- [Pug](https://pugjs.org/api/getting-started.html)
- [Sass](https://sass-lang.com/documentation/)

© 2025 Seidor. MIT License.
