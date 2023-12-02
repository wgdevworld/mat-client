import axios from 'axios';
import {REQ_METHOD, request} from './RequestControl';

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
    const res = await request(query, REQ_METHOD.QUERY);
    return res?.data.data;
  } catch (error) {
    console.log(error);
  }
};

export const addUserFollower = async (id: string) => {
  try {
    const query = `
    mutation addUserFollower($mapId: String!) {
        addUserFollower(mapId: $mapId) {
          savedZips {
            id
            name
          }
        }
    }
  `;
    const variables = {
      mapId: id,
    };
    const res = await request(query, REQ_METHOD.MUTATION, variables);
    console.log(res.data);
    return res?.data.data;
  } catch (err) {
    console.log(err);
  }
};
