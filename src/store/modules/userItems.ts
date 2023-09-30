import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { MuckitItem } from "../../types/store";

export const initialState: { ownMuckitems: MuckitItem[]} = {
    ownMuckitems: []
}

export const userMuckitemSlice = createSlice({
    name: 'userMuckitems',
    initialState,
    reducers: {
        replaceOwnMuckitemsAction: (state, action: PayloadAction<MuckitItem[]>) => {
            state.ownMuckitems = action.payload;
            return state;
        },
        addMuckitemAction: (state, action: PayloadAction<MuckitItem>) => {
            state.ownMuckitems.push(action.payload);
            return state;
        },
        updateMuckitemAction: (state, action: PayloadAction<MuckitItem>) => {
            const updatedItemList = state.ownMuckitems.map(item => {
                if (item.id === action.payload.id) return action.payload;
                else return item;
            })
            state.ownMuckitems = updatedItemList;
        }
    }
});

export const {
    replaceOwnMuckitemsAction,
    addMuckitemAction,
    updateMuckitemAction
} = userMuckitemSlice.actions;

export default userMuckitemSlice.reducer;

