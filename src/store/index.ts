import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import postReducer from "./postSlice";
import storyReducer from "./storySlice";
import profileReducer from "./profileSlice";
import highlightReducer from "./highlightSlice";
import notificationReducer from "./notificationSlice";
import messageSlice from "./messageSlice";
import uiReducer from "./uiSlice";
import { listenerMiddleware } from "./listenerMiddleware";
/**
 * Configures the Redux store with auth reducer
 */
const store = configureStore({
  reducer: {
    auth: authReducer,
    post: postReducer,
    story: storyReducer,
    profile: profileReducer,
    highlight: highlightReducer,
    notification: notificationReducer,
    message: messageSlice,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).prepend(listenerMiddleware.middleware),
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
