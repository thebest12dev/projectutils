# projectutils
A set of utilities for managing stuff in a codebase. Includes bumping versions (`@since` metadata WILL be preserved) and some other stuff to be done.

## Usage
Primarily, you should use `projectutils -h` for help, but this will cover some commands.

To bump a version:
```sh
projectutils -b <major/minor/patch>
```
`projectutils` will then attempt to read from your `package.json`. If it can't find the file, you may need to enter some config details.
```
> projectutils -b minor
reading from your package.json...
package.json doesn't exist, reading from config...
error: cannot resolve current version
enter your current version (only once):
> 1.0.0

...

bumped version to 1.1.0 successfully
```

You can also set the version, though it might violate the versioning scheme you're using:
```sh
projectutils -s <version>
```
## TypeScript?
Although this project is built on JavaScript, there are TypeScript definition files you can use. This might help with certain IDEs (like VS Code) for documentation (if you're working with it programmatically).

## Contributing
For contributions, please visit the project's [repository](https://github.com/thebest12dev/projectutils).