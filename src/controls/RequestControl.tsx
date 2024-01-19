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
    await AsyncStorage.setItem(ASYNC_STORAGE_ENUM.ID_TOKEN, idToken);
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
    const newIdToken = await getNewToken();
    return newIdToken;
  } else {
    return await AsyncStorage.getItem(ASYNC_STORAGE_ENUM.ID_TOKEN);
  }
};

export const request = async (
  query: string,
  method: string,
  variables?: object,
  isTokenLess?: boolean,
) => {
  try {
    let headers;
    if (!isTokenLess) {
      const idToken = await getValidIdToken();
      // console.log('ℹ️ Token: ' + idToken);
      axios.defaults.headers.common.Authorization = `Bearer ${idToken}`;
      headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      };
    }
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
        if (response.data.data === null) {
          console.error('⛔️ Query error for: ' + query);
        } else {
          console.log('ℹ️ Query success: ' + response.data.data);
        }
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
        if (response.data.data === null) {
          console.error('⛔️ Mutation error for: ' + query);
        } else {
          console.log('ℹ️ Mutation success: ' + response.data.data);
        }
        break;
    }
    return response;
  } catch (error: any) {
    console.error(
      '🚨 Server error:',
      error.response ? error.response.data : error.message,
    );
  }
};
