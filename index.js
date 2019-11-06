const axios = require('axios');
const querystring = require('querystring');

module.exports = async function countTweets({consumerKey, consumerSecret, q}) {
  // obtain bearer token
  const credentials = `${consumerKey}:${consumerSecret}`;
  const basicAuth = Buffer.from(credentials).toString('base64');
  const {data} = await axios({
    method: 'POST',
    url: 'https://api.twitter.com/oauth2/token',
    headers: {
      Authorization: `Basic ${basicAuth}`,
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    data: 'grant_type=client_credentials'
  });

  // configure search client
  const client = axios.create({
    method: 'GET',
    baseURL: 'https://api.twitter.com/1.1/search/tweets.json',
    headers: {
      Authorization: `Bearer ${data.access_token}`
    }
  });

  // make an initial query
  let response = await client.request({
    params: {
      q,
      count: 100,
      result_type: 'recent'
    }
  });

  let count = response.data.statuses.length;
  while (response.data.search_metadata.next_results) {
    const params = querystring.parse(
      response.data.search_metadata.next_results.slice(1)
    );

    response = await client.request({params});
    count += response.data.statuses.length;
  }

  return count;
};
