import axios from 'axios';

export const deleteUser = async (userId: string) => {
  try {
    const query = `
    mutation {
        deleteUser(userId: ${userId})
    }`;

    axios.post(
      'https://muckit-server.site/graphql',
      {
        query,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      },
    );
    // const url = `https://muckit-server.site/graphql?query=${query}`;

    // const response = await axios.get(url, {
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    // });
    // console.log(response.data.data);
    // return response.data.data;
    console.log('탈퇴');
  } catch (e) {
    console.log(e);
  }
};

// axios
//         .post(
//           'https://muckit-server.site/graphql',
//           {
//             query,
//             variables,
//           },
//           {
//             headers: {
//               'Content-Type': 'application/json',
//               Accept: 'application/json',
//             },
//           },
//         )
//         .then((result: {data: any}) => {
//           console.log(result.data);
//         })
//         .catch(e => console.log(e));
//     } catch (e) {
//       console.log(e);
//     }
