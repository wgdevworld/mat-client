// import {createSlice, PayloadAction} from '@reduxjs/toolkit';
// import {Coordinate, Zip} from '../../types/store';
// import {calculateDistance} from '../../tools/CommonFunc';

// const initialState: Zip[] = [];

// export const zipSlice = createSlice({
//   name: 'zipData',
//   initialState,
//   reducers: {
//     addZip: (state, action: PayloadAction<Zip>) => {
//       state.push(action.payload);
//     },
//     removeZip: (state, action: PayloadAction<string>) => {
//       const index = state.findIndex(zip => zip.id === action.payload);
//       if (index !== -1) {
//         state.splice(index, 1);
//       }
//     },
//     updateZip: (state, action: PayloadAction<Zip>) => {
//       const index = state.findIndex(zip => zip.id === action.payload.id);
//       if (index !== -1) {
//         state[index] = action.payload;
//       }
//     },
//     updateDistances: (state, action: PayloadAction<Coordinate>) => {
//       // iterate over each Zip and update its distance
//       state.forEach(zip => {
//         zip.distance = calculateDistance(zip.location, action.payload);
//       });
//     },
//   },
// });

// export const {addZip, removeZip, updateZip} = zipSlice.actions;
// export default zipSlice.reducer;
