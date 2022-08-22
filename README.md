# ilo-mute

(Toki pona literate translation: "many tools")

A cli tool that allows you to run multiple commands in parallel. This is especially useful when you have multiple watching tools, and don't want to start multiple terminal sessions.

Usage:

`ilo cmd1 --args something + cmd2 --more-args more + ...`

Commands are separated using `+` and run in a default shell.

If in the place of the first command there is an option, it will be interpreted as one of the system options:

```
Options:
  -h, --help           Shows this help message
  -m, --no-meta        Hides all meta messages (like "[cmd] Running")
  -a, --show-args      Show arguments when identifying messages that came from commands
  -i, --stdio-inherit  Set the "stdio" option to "inherit", which disables identification of which message came from which command
```

**Example**

Running `npm start` and `tsc --watch` at the same time:

`ilo npm start + tsc --watch`


