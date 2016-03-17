# generator-n3dst4-package

![Travis Status](https://travis-ci.org/n3dst4/generator-n3dst4-package.svg)

Generates npm packages the way I likes 'em.

## Installation

If you don't already have [yo][yo] (the [Yeoman][yeoman] runner) installed:
```sh
npm install -g yo
```

Then install this package:
```sh
npm install generator-n3dst4-package -g
```

## Usage

```sh
yo n3dst4-package
```

## Generators

### `n3dst4-package`

This builds a minimal package, with the following features:
* `.gitignore` and `.npmignore`set up with sensible defaults
* `package.json` set up as if you'd run `npm init`
* Linting configured using [ESLint][eslint] and my [personal eslint config][eslint-config]
* Optional [babel][babel] transpilation. If selected, an `npm prepublish` step will be set up to precompile your package.

### `n3dst4-package:bin`

Adds a `src/bin/` folder with a script set up for command-line execution.

### `n3dst4-package:mocha`

This will add a basic [mocha][mocha] test suite with one failing test to your app, which can be run using `npm test`, or just `mocha`.

### `n3dst4-package:karma`

This will upgrade your [Mocha][mocha]-based test suite to run inside [Karma][karma]

## Developer notes!

So, this kind of project can get a bit confusing because it's code-that-generates-code, so sometime you lose track of whether you're looking at code that's part of the genarator code, or code that's just there to be copied into the output.

Remember:

* Yeoman generators can have one main generator, and zero or more *sub-generators*.
* All the generators live in `generators/`
* The main generator (what you get when you just call `yo n3dst4-package`) is in `generators/app` (`app` is the Yeoman's default name).
* Within each generator, any files that might get copied over are in `templates/`
* The main generator in this case is written to ask you which subgenerators you want, and will run them automatically if needed. You can also run them on their own afterwards, e.g. `yo n3dst4-package:karma` to add Karma to an existing project.

## Caveats / TODOs



[babel]: https://babeljs.io/
[babelify]: https://github.com/babel/babelify
[mocha]: https://mochajs.org/
[travis]: https://travis-ci.org/
[yo]: https://www.npmjs.com/package/yo
[yeoman]: http://yeoman.io/
[karma]: https://karma-runner.github.io/0.13/index.html
[eslint]: http://eslint.org/
[eslint-config]: https://www.npmjs.com/package/@sportingsolutions/eslint-config-shared
