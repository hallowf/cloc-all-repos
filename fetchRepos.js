const axios = require('axios')

module.exports = {
  fetchGithub: function(username) {
    return fetchGithub(username)
  }
}

async function fetchGithub(username) {
  let repos = []

  await axios.get('https://api.github.com/users/' + username + '/repos')
    .then(res =>{
      data = res.data
      data.forEach((item, i) => {
        repoData = {
          url: item.html_url,
          name: item.name
        }
        repos.push(repoData)
      });
    })
    .catch(err => {
      console.error(err)
    })

  return repos
}
