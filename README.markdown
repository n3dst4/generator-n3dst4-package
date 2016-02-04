# generator-n3dst4-package

Generates npm packages the way I likes 'em.

## Installation

If you don't already have yo (the Yeoman runner) installed:
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

Options you can pass:

* `--name <whatever>` to presupply the package name
* `--bin` to automatically run the bin script subgenerator (without this options it'll ask whether you wants it.)

## Generators

### `n3dst4-package`

This builds a minimal package with babel transpilation.

## Developer notes!

Remember:

* Yeoman generators can have *sub-generators*.
* All the generators line in `generators/`
* The main generator (what you get when you just do `yo n3dst4-package`) is in `generators/app` (`app` is the Yeoman's default name).
* Within each generator, the files that copied over are in `templates/`
* The main generator  is written to ask you which subgenerators you want, and will run them automatically if needed. You can also run them on their own afterwards, e.g. `yo n3dst4-package:karma-tests` to add Karma to an existing project.
