import axios from 'axios';

export const fetchReviewsByZipId = async (zipId: string) => {
  try {
    const query = `{
        fetchReviewsByZipId(zipId: ${zipId}) {
          rating
          content
          createdAt
        }
      }`;

    const url = `https://muckit-server.site/graphql?query=${query}`;

    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log(response.data.data);
    return response.data.data;
  } catch (e) {
    console.log(e);
  }
};
