import axios from 'axios'

async function getUserIntagramByUsername(req, res) {
  const username = req.params.username
  axios.get(`XXXXXXXXXXXXXXXXXXXXXXXXXX${username}/?__a=1`)
    .then(response => {
      res.json(response.data)
    })
    .catch(error => {
      res.json(error)
    })
}