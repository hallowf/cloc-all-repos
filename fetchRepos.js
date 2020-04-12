const axios = require('axios')

module.exports = {
  fetchGithub: function(username, dbg) {
    return fetchGithub(username, dbg)
  },
  fetchGitlab: function(username, dbg) {
    return fetchGitlab(username, dbg)
  }
}

async function fetchGithub(username, dbg) {
  let repos = []
  console.log('Fetching Github repos')
  await axios.get(`https://api.github.com/users/${username}/repos`)
    .then(res => {
      if (res.status == 200) {
        data = res.data
        data.forEach((item, i) => {
          repoData = {
            url: item.html_url,
            name: item.name
          }
          repos.push(repoData)
        });
      } else {
        console.error(`Server status code: ${res.status}`)
        process.exit(1)
      }
    })
    .catch(err => {
      console.error(err.message)
      console.log('Github API might be down, or the username you provided is invalid')
      if (dbg) {console.error(err)}
      process.exit(1)
    })

  return repos
}

async function fetchGitlab(username, dbg) {
  console.log(dbg)
  let repos = []
  console.log('Fetching Gitlab repos')
  await axios.get(`https://gitlab.com/api/v4/users/${username}/projects`)
    .then(res => {
      if (res.status == 200) {
        data = res.data
        data.forEach((item, i) => {
          repoData = {
            url: item.http_url_to_repo,
            name: item.name
          }
          repos.push(repoData)
        });
      } else {
        console.error(`Server status code: ${res.status}`)
        process.exit(1)
      }
    })
    .catch(err => {
      console.error(err.message)
      console.log('Gitlab API might be down, or the username you provided is invalid')
      if (dbg) {console.error(err)}
      process.exit(1)
    })

  return repos
}
