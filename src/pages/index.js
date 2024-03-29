import React, {useState} from 'react';
import {stringify} from 'querystring';

export default function Index() {
  const [count, setCount] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);

    const {q, consumerKey, consumerSecret} = event.target;
    const response = await fetch('/.netlify/functions/count', {
      method: 'POST',
      body: stringify({
        q: q.value,
        consumerKey: consumerKey.value,
        consumerSecret: consumerSecret.value
      })
    });

    if (response.ok) {
      const text = await response.text();
      setCount(text);
    }

    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>Count: {count}</h3>
      <p>
        <label>
          Query: <input name="q" />
        </label>
      </p>
      <p>
        <label>
          Consumer key: <input name="consumerKey" />
        </label>
      </p>
      <p>
        <label>
          Consumer secret: <input name="consumerSecret" type="password" />
        </label>
      </p>
      <button disabled={loading} type="submit">
        Submit
      </button>
    </form>
  );
}
