# cloc-all-repos

![npm](https://img.shields.io/npm/v/@hallowf/cloc-all-repos)


This project assumes you have [cloc](https://github.com/AlDanial/cloc) and [git](https://git-scm.com/) installed on your system.

cloc-all-repos is a CLI tool that allows you to count all lines of code across all your repositories on Github, Gitlab or both. It uses cloc to generate individual reports and them sums them up into two files one for all languages and one for all projects

You can install it using npm by typing

`npm i -g @hallowf/cloc-all-repos`

Then you can run it by typing

`cloc-all-repos -p PLATFORM -u USERNAME`

## Arguments

* `-p` or `--platform`: STRING, can be Github, Gitlab or both (Case insensitive, required)
* `-u` or `--username`: STRING, your username (Case sensitive, required)
* `-rep` or `--remove-each-repo`: BOOLEAN, removes each repository after creating a report (default `true`)
* `-dbg` or `--debug`: BOOLEAN, logs full error stack to console (default `false`)
* `--version`: shows version
* `--help`: shows help
