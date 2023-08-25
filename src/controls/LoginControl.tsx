import axios from 'axios';

// FIX

export const logout = async () => {
  try {
    const query = `{
        logout {
        }
      }`;

    const url = `https://muckit-server.site/graphql?query=${query}`;

    await axios.post(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (e) {
    console.log(e);
  }
};
