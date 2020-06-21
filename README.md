# Canteen menu

## Deployment

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

The pretty files will be in the `/dist/assets` directory, these are deployable but can be optimised.

4) Minify them run this command in the `dist` directory
```bash
$ gulp
```

The minified and deployable files will be in `/dist/mini`

## Architecture

#### Libraries used during run time

- [axios](https://github.com/axios/axios) | [source](https://unpkg.com/axios/dist/axios.min.js)

the only other request is to the Google sheets API which is discussed [here](#getting-the-data-from-the-google-sheet-to-the-json)

#### Sequence Diagram

<img src="static/sequence_diagram.png" width="100%">

#### Getting the data from the Google sheet to the JSON

Google Sheet share link: `https://docs.google.com/spreadsheets/d/1CBEmRrqH8W-wsNDHq7G5_-vMTJvFYbt-h6NsEViMLHY/edit?usp=sharing`

The Google Sheet code: `1CBEmRrqH8W-wsNDHq7G5_-vMTJvFYbt-h6NsEViMLHY`

Link to the JSON of the Google Sheet: `https://spreadsheets.google.com/feeds/cells/1CBEmRrqH8W-wsNDHq7G5_-vMTJvFYbt-h6NsEViMLHY/1/public/full?alt=json`

reference: [freecodecamp](https://www.freecodecamp.org/news/cjn-google-sheets-as-json-endpoint/)


## Development

The files in `/src` are written in PUG, SASS and TYPESCRIPT which the browser cannot compile directly but these are easier to read and write.

Gulp compiles them into HTML, CSS and JAVASCRIPT respectively which out good old browser is familiar to.

First layer of gulp at `/` compiles to pretty files into `dist/assets`

Second layer of gulp at `dist`, converts the pretty files form `dist/assets` into minified versions at `dist/mini`

> Gulp is just used to build the files, it does not go into the `/dist` files by any means, so security issues in those modules will not be in production.

#### How to preview for development


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

