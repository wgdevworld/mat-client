import axios from 'axios';

export const createZip = async () => {};

export const zips = async (zipId: string) => {
  try {
    const query = `{
      fetchZip(id: "${zipId}") {
        name
        address
        reviewCount
        parentMap {
          name
        }
      }
    }`;

    const url = `https://muckit-server.site/graphql?query=${query}`;

    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log(response.data.data.fetchZip);
    return response.data.data.fetchZip;
  } catch (e) {
    console.log(e);
  }
};
