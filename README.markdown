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
