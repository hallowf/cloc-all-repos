#!/usr/bin/env node

const shell = require('shelljs')
const yargs = require('yargs')
const fetchRepos = require('./fetchRepos')

const argv = yargs
  .option('platform', {
    alias: 'p',
    describe: 'Specify your platform(Github/Gitlab/Both)',
    type: 'string'
  })
  .option('username', {
    alias: 'u',
    describe: 'Specify your username',
    type: 'string'
  })
  .option('remove-each-repo', {
    alias: 'rep',
    describe: 'Removes each repo after creating a report',
    type: 'boolean',
    default: true
  })
  .option('debug', {
    alias: 'dbg',
    describe: 'Logs full error stack to console',
    type: 'boolean'
  })
  .option('keep-individual-reports', {
    alias: 'kir',
    describe: 'Keeps each individual report',
    type: 'boolean',
    default: false
  })
  .demandOption(['platform', 'username'], 'Please provide platform and username arguments to run the program')
  .help()
  .argv

const platform = argv.p.toLowerCase()
const user = argv.u

async function fetchAndCount() {
  let repos = []
  if (platform == 'github') {
    repos = await fetchRepos.fetchGithub(user, argv.dbg)
    cloneAndCount(repos)
  } else if (platform == 'gitlab') {
    repos = await fetchRepos.fetchGitlab(user, argv.dbg)
    cloneAndCount(repos)
  } else if (platform == 'both') {
    hubRepos = await fetchRepos.fetchGithub(user, argv.dbg)
    labRepos = await fetchRepos.fetchGitlab(user, argv.dbg)
    repos = hubRepos.concat(labRepos)
    cloneAndCount(repos)
  } else {
    console.error(`Invalid platform: ${platform}`)
    process.exit(1)
  }
}

function cloneAndCount(repoList) {
  //  create temporary directory
  console.log('Creating temp directory')
  shell.mkdir('temp')
  // if keep individual reports create report directory
  if (argv.kir) {
    console.log('Creating reports directory')
    shell.mkdir('reports')
  }
  shell.cd('temp')
  let reportFiles = []
  repoList.forEach((item, i) => {
    // clone repo
    shell.exec('git clone ' + item.url)
    // if keep individual reports create reports directory
    let reportName = `${item.name}.txt`
    if (argv.kir) {reportName = `../reports/${item.name}.txt`}
    // count lines make a report file and append it to reportFiles
    console.log("Creating report")
    shell.exec(`cloc ${item.name} --report-file=${reportName}`, {silent: true})
    reportFiles.push(reportName)
    // reamoves each repo after report
    if (argv.rep) {
      console.log(`Removing ${item.name}`)
      shell.rm('-rf', item.name)
    }
  });

  allFilesString = reportFiles.join(' ')

  console.log('Joining reports, this might take a while')
  // Join all reports before changing directory
  // to preserve the location of individual reports
  shell.exec(`cloc --sum-reports --report_file=../${platform}${user} ${allFilesString}`)
  shell.cd('..')
  console.log('removing temp directory')
  shell.rm('-rf', './temp')
  process.exit(0)
}

fetchAndCount()
