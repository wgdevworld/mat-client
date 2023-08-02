import axios from 'axios';

export const fetchAllMaps = async () => {
    try {
    const query = `
      {
        fetchAllMaps {
          id
          name
          publicStatus
          creator {
            username
          }
        }
      }
    `;
    const res = await axios.post(
      'https://muckit-server.site/graphql',
      {
        query,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return res.data.data;

    }
    catch(error) {
        console.log(error)
    }
}