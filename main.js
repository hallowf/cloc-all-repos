const readline = require('readline')
const shell = require('shelljs')
const fetchGithub = require('./fetchGithub')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

let chosenPlatform = ''
let user = ''

function fetchAndCount() {
  let repos = []
  console.log('asking question')
  rl.question('Github or Gitlab ? ', function(platform) {
    chosenPlatform = platform
    if (platform.toLowerCase() == 'github') {
      rl.question('What is your username ? ', async function(username) {
        user = username
        repos = await fetchGithub.fetchRepos(username)
        cloneAndCount(repos)
      })
    }
  })
}

function cloneAndCount(repoList) {
  console.log('creating temp directory')
  shell.mkdir('./temp')
  shell.cd('./temp')
  let reportFiles = []
  repoList.forEach((item, i) => {
    console.log(`Cloning ${item.name}`)
    shell.exec('git clone ' + item.url, {silent: true})
    // count lines and make a report file
    console.log("Creating report")
    shell.exec(`cloc ${item.name} --report-file=${item.name}.txt`, {silent: true})
    reportFiles.push(`${item.name}.txt`)
  });

  allFilesString = reportFiles.join(' ')

  console.log('Joining reports, might take a while')
  shell.exec(`cloc --sum-reports --report_file=../${chosenPlatform}${user} ${allFilesString}`)
  console.log('removing temp directory')
  shell.rm('-rf', './temp')
  process.exit(0)
}


fetchAndCount()
