import {Review} from '../../types/store';

export const initialState: Review = {
  author: '',
  rating: 0,
  content: '',
  date: new Date(),
};
