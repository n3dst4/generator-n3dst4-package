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


## Options

The generator will ask you a series of questions. Here's what they all mean:

### ? 'Allo <user>! What would you like to do?

This is the first question that `yo` will ask you unless you specified a generator on the command line. This where you tell yeoman what to do. You should pick this package generator.


### Package name

This should be a minimal but complete name in "kebab-case".

### Should this package be namespaced?

By default all packages are not namespace. If you're creating a package mainly for private use, you can choose to have it namespaced (it will pick your currently logged in npm username).

### Description

A one-line description of what the package does. Try not to skip this step!

### Your email address (and) Your name

These will be taken from your git config by default.

### Do you want to create a SPA (single-page web app)?

If you're looking to kick off a new UI project, answer **Yes** to this question. If you're just looking to create a shareable package, answer **No**.

### Do you want your SPA to use React, Radium, & Redux?

This will only be asked if you answered Yes to the SPA question. Answer **Yes** to have the project automatically set up with a React/Redux architecture.

### Do you want an executable bin script?

If you're creating a command line utility, answer **Yes** to this question. Otherwise answer no.

### Executable script name (without extension)

This will only be asked if you answered Yes to the question about having a bin script. The answer to this question should be the name of the script that will be generated. It defaults to the name of the package.

### Do you want your code compiled with Babel?

Babel is a code transpiler that translates "new" JS syntax into old, fully browser-compatible syntax. Answer **Yes** to this question if you'd like to write your code in ES6+ and have it automatically compiled to ES5.  Answer **No** if you're happy to write in ES5.

### Do you want a Mocha test suite?

Answer **Yes** to generate the start of a test suite, which you can run by typing `npm test`. Only answer No if you have a very very good reason for doing so.

###  Do you want the test suite to run in a browser (through Karma)?

This question will only be asked if you answered Yes to the question about Mocha, above. Answer **Yes** to this question to have the tests set jup to run through Karma, which will launch a browser to run the tests so you know that your code is browser-compatible.

### Do you want to run "npm install" at the end?

As a convenience, the generator can run `npm install` on your behalf if you answer **Yes** to this question.



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


[babel]: https://babeljs.io/
[babelify]: https://github.com/babel/babelify
[mocha]: https://mochajs.org/
[travis]: https://travis-ci.org/
[yo]: https://www.npmjs.com/package/yo
[yeoman]: http://yeoman.io/
[karma]: https://karma-runner.github.io/0.13/index.html
[eslint]: http://eslint.org/
[eslint-config]: https://www.npmjs.com/package/@sportingsolutions/eslint-config-shared
