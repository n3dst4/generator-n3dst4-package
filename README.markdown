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

This builds a minimal package, with optional babel transpilation.

## Developer notes!

So, this kind of project can get a bit confusing because it's code-that-generates-code, so sometime you lose track of whether you're looking at code that's part of the genarator code, or code that's just there to be copied into the output.

Remember:

* Yeoman generators can have one main generator, and zero or more *sub-generators*.
* All the generators live in `generators/`
* The main generator (what you get when you just call `yo n3dst4-package`) is in `generators/app` (`app` is the Yeoman's default name).
* Within each generator, any files that might get copied over are in `templates/`
* The main generator in this case is written to ask you which subgenerators you want, and will run them automatically if needed. You can also run them on their own afterwards, e.g. `yo n3dst4-package:karma` to add Karma to an existing project.

## TODO

* ~~store config and re-use it in subgenerators instead of passing options~~ around
* turn babel stuff into its own subgenerator
