const axios = require('axios')

module.exports = {
  fetchGithub: function(username) {
    return fetchGithub(username)
  },
  fetchGitlab: function(username) {
    return fetchGitlab(username)
  }
}

async function fetchGithub(username) {
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
      }
    })
    .catch(err => {
      console.error(err)
    })

  return repos
}

async function fetchGitlab(username) {
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
      }
    })
    .catch(err => {
      console.error(err)
    })

  return repos
}
