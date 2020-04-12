#!/usr/bin/env node

const shell = require('shelljs')
const yargs = require('yargs')
const fetchRepos = require('./fetchRepos')

const argv = yargs
  .option('platform', {
    alias: 'p',
    describe: 'Specify your platform(Github/Gitlab/Both)'
  })
  .option('username', {
    alias: 'u',
    describe: 'Specify your username'
  })
  .option('remove-each-repo', {
    alias: 'rep',
    describe: 'Removes each repo after creating a report',
    type: 'boolean'
  })
  .demandOption(['platform', 'username'], 'Please provide platform and usernamearguments to run the program')
  .help()
  .argv

const platform = argv.p.toLowerCase()
const user = argv.u
const rep = argv.rep

async function fetchAndCount() {
  let repos = []
  if (platform == 'github') {
    repos = await fetchRepos.fetchGithub(user)
    cloneAndCount(repos)
  } else if (platform == 'gitlab') {
    repos = await fetchRepos.fetchGitlab(user)
    cloneAndCount(repos)
  } else if (platform == 'both') {
    hubRepos = await fetchRepos.fetchGithub(user)
    labRepos = await fetchRepos.fetchGitlab(user)
    repos = hubRepos.concat(labRepos)
    cloneAndCount(repos)
  }
}

function cloneAndCount(repoList) {
  console.log('Creating temp directory')
  shell.mkdir('temp')
  shell.cd('temp')
  let reportFiles = []
  repoList.forEach((item, i) => {
    shell.exec('git clone ' + item.url)
    // count lines and make a report file
    console.log("Creating report")
    shell.exec(`cloc ${item.name} --report-file=${item.name}.txt`, {silent: true})
    reportFiles.push(`${item.name}.txt`)
    if (rep) {
      console.log(`Removing ${item.name}`)
      shell.rm('-rf', item.name)
    }
  });

  allFilesString = reportFiles.join(' ')

  console.log('Joining reports, this might take a while')
  // Join all reports
  shell.exec(`cloc --sum-reports --report_file=../${platform}${user} ${allFilesString}`)
  shell.cd('..')
  console.log('removing temp directory')
  shell.rm('-rf', './temp')
  process.exit(0)
}

fetchAndCount()
