#!/usr/bin/env node
import { spawn } from "child_process";
import c from "chalk";

let SHOW_ARGS = false;
let STDIO_INHERIT = false;
let META = true;

function parseArgs(argv: string[]) {
  argv = argv.slice(2)
  const commands: string[][] = [[]]
  let cmdIndex = 0;
  let i = -1;
  for (const arg of argv) {
    i++;
    if (i == 0 && arg.startsWith('-')) {
      switch (arg) {
        case '-h':
        case '--help': {
          console.log(
`Usage: ilo [options] <commands>

Commands and their options are separated with "+".

Options:
  -h, --help           Shows this help message
  -m, --no-meta        Hides all meta messages (like "[cmd] Running")
  -a, --show-args      Show arguments when identifying messages that came from commands
  -i, --stdio-inherit  Set the "stdio" option to "inherit", which disables identification of which message came from which command`
          );

          process.exit();
        }

        case '-m':
        case '--no-meta': {
          META = false
          break;
        }

        case '-a':
        case '--show-args': {
          SHOW_ARGS = true
          break;
        }

        case '-i':
        case '--stdio-inherit': {
          STDIO_INHERIT = true
          break;
        }

      
        default: {
          console.error('Unknown option:', arg)
          process.exit(1)
        }
      }
      i = -1;
      continue;
    }
    if (arg == '+') {
      cmdIndex++;
      commands[cmdIndex] = [];

    } else {
      commands[cmdIndex].push(arg)
    }
  }
  return commands;
}

const cmds = parseArgs(process.argv);

function getCmd(cmd: string, args: string[], isErr?: boolean) {
  const chalk = isErr ? c.yellow : c.green;

  if (SHOW_ARGS) {
    return chalk(`[ ${cmd} ${c.gray(args.join(' '))} ]`)
    
  } else {
    return chalk(`[${cmd}]`)
  }
}

for (const commandArgs of cmds) {
  const [ cmd ] = commandArgs.splice(0, 1);
  if (META) console.log(getCmd(cmd, commandArgs), c.gray("Running"));

  const cp = spawn(cmd, commandArgs, { stdio: STDIO_INHERIT ? 'inherit' : 'pipe', shell: true });

  if (META) cp.on('exit', () => {
    console.log(getCmd(cmd, commandArgs), c.gray("Finished"));
  })

  if (!STDIO_INHERIT) {
    cp.stdout.on('data', (chunk) => {
      process.stdout.write(getCmd(cmd, commandArgs) + ' ' + chunk)
    })
    cp.stderr.on('data', (chunk) => {
      process.stderr.write(getCmd(cmd, commandArgs, true) + ' ' + chunk)
    })
  }
}