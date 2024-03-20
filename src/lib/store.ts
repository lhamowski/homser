import { configureStore } from "@reduxjs/toolkit";
import serversInfoReducer from "@/lib/server/infoSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      serversInfo: serversInfoReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
