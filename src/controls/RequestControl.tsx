import AsyncStorage from '@react-native-async-storage/async-storage';
import {ASYNC_STORAGE_ENUM} from '../types/asyncStorage';
import axios from 'axios';

export const REQ_METHOD = {
  QUERY: 'query',
  MUTATION: 'mutation',
};

const getValidIdToken = async () => {
  let idToken = await AsyncStorage.getItem(ASYNC_STORAGE_ENUM.ID_TOKEN);
  return idToken;
};

export const request = async (
  query: string,
  method: string,
  variables?: object,
) => {
  try {
    const idToken = await getValidIdToken();
    console.log(idToken);
    if (idToken) {
      await AsyncStorage.setItem(
        ASYNC_STORAGE_ENUM.ID_TOKEN,
        idToken as string,
      );
      axios.defaults.headers.common.Authorization = `Bearer ${idToken}`;
    }
    let headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    let response;
    switch (method) {
      case REQ_METHOD.QUERY:
        // Handle QUERY (unchanged from your original version)
        response = await axios.post(
          'https://muckit-server.site/graphql',
          {
            query,
          },
          {
            headers,
          },
        );
        console.log('ℹ️ Query success: ' + response.data.data);
        break;
      case REQ_METHOD.MUTATION:
        if (variables instanceof FormData) {
          headers = {
            ...headers,
            'Content-Type': 'multipart/form-data',
          };
          response = await axios.post(
            'https://muckit-server.site/graphql',
            variables,
            {headers},
          );
        } else {
          response = await axios.post(
            'https://muckit-server.site/graphql',
            {
              query,
              variables,
            },
            {
              headers,
            },
          );
        }
        console.log('ℹ️ Mutation success: ' + response);
        break;
    }

    return response;
  } catch (error: any) {
    console.log(
      '🚨 Server error:',
      error.response ? error.response.data : error.message,
    );
  }
};
