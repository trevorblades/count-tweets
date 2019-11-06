const countTweets = require('../..');
const querystring = require('querystring');

exports.handler = async event => {
  const params = querystring.parse(event.body);
  const count = await countTweets(params);
  return {
    statusCode: 200,
    body: count
  };
};
