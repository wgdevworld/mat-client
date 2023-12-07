import AsyncStorage from '@react-native-async-storage/async-storage';
import {ASYNC_STORAGE_ENUM} from '../types/asyncStorage';
import axios from 'axios';

export const REQ_METHOD = {
  QUERY: 'query',
  MUTATION: 'mutation',
};

const getNewToken = async () => {
  try {
    const res = await AsyncStorage.multiGet([
      ASYNC_STORAGE_ENUM.REFRESH_TOKEN,
      ASYNC_STORAGE_ENUM.USER_EMAIL,
    ]);

    const refreshTokenPair = res.find(
      pair => pair[0] === ASYNC_STORAGE_ENUM.REFRESH_TOKEN,
    );
    const userEmailPair = res.find(
      pair => pair[0] === ASYNC_STORAGE_ENUM.USER_EMAIL,
    );

    const refreshToken = refreshTokenPair ? refreshTokenPair[1] : null;
    const userEmail = userEmailPair ? userEmailPair[1] : null;

    const fetchNewTokenQuery = `{
      fetchNewAccessToken(refreshToken: "${refreshToken}", userEmail: "${userEmail}")
    }`;
    const response = await request(fetchNewTokenQuery, REQ_METHOD.QUERY);
    const idToken = response?.data.data.fetchNewAccessToken;
    console.log('ℹ️ Token refreshed: ' + idToken);
    return idToken;
  } catch (error) {
    throw error;
  }
};

const getValidIdToken = async () => {
  const lastTokenDateString = await AsyncStorage.getItem(
    ASYNC_STORAGE_ENUM.TOKEN_TIME,
  );

  const now = new Date();
  const fiftyMinBeforeNow = new Date(now.getTime() - 50 * 60 * 1000);
  const lastTokenDate =
    lastTokenDateString !== null ? new Date(lastTokenDateString) : null;

  if (!lastTokenDate || lastTokenDate.getTime() < fiftyMinBeforeNow.getTime()) {
    console.log('ℹ️ Token expired, refreshing...');
    await AsyncStorage.setItem(ASYNC_STORAGE_ENUM.TOKEN_TIME, now.toString());
    return await getNewToken();
  } else {
    return await AsyncStorage.getItem(ASYNC_STORAGE_ENUM.ID_TOKEN);
  }
};

export const request = async (
  query: string,
  method: string,
  variables?: object,
) => {
  try {
    const idToken = await getValidIdToken();
    axios.defaults.headers.common.Authorization = `Bearer ${idToken}`;
    let headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    let response;
    switch (method) {
      case REQ_METHOD.QUERY:
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
