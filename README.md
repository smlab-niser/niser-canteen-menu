# Canteen table

### Notes

The files in `/src` are written in PUG, SASS and TYPESCRIPT which the browser cannot compile directly but these are easier to read and write.

Gulp compiles them into HTML, CSS and JAVASCRIPT respectively which out good old browser is familiar to.

> Gulp is just used to build the files, it does not go into the `/dist` files by any means, so security issues in those modules will not be in production.

### How to preview for development


1) Install gulp globally (might require `sudo`).

```bash
$ npm install --global gulp-cli pug-cli
```

2) Go inside the directory and install all the dependencies.
```bash
$ npm install
```

3) Generate output files and watch changes.
```bash
$ gulp
```

This will serve the output files as well, the link will be show up on the output of this command, leave this running while you are developing.

### How to generate production/deployable files


1) Install gulp globally (might require `sudo`).

```bash
$ npm install --global gulp-cli pug-cli
```

2) Go inside the directory and install all the dependencies.
```bash
$ npm install
```

3) Generate output files.
```bash
$ gulp build
```

The deployable files will be in the `\dist` directory.


### Getting the data from the Google sheet to the JSON

Google Sheet share link: `https://docs.google.com/spreadsheets/d/1CBEmRrqH8W-wsNDHq7G5_-vMTJvFYbt-h6NsEViMLHY/edit?usp=sharing`

The Google Sheet code: `1CBEmRrqH8W-wsNDHq7G5_-vMTJvFYbt-h6NsEViMLHY`

Link to the JSON of the Google Sheet: `https://spreadsheets.google.com/feeds/cells/1CBEmRrqH8W-wsNDHq7G5_-vMTJvFYbt-h6NsEViMLHY/1/public/full?alt=json`

reference: [freecodecamp](https://www.freecodecamp.org/news/cjn-google-sheets-as-json-endpoint/)
