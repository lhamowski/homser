import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { RootState } from "@/lib/store";
import { RemoteServerStatus } from "@/app/remoteServerStatus";

export interface RemoteServerMetrics {
  cpuUsage: number; // CPU usage in percentage
  cpuTemp: number; // CPU temperature in Celsius
  ramUsage: string; // RAM usage in usage/total format
}

export interface ServerInfo {
  ip: string;
  status: RemoteServerStatus;
  name: string;
  metrics?: RemoteServerMetrics;
}

export interface ServersInfo {
  [id: number]: ServerInfo;
}

interface ServersInfoState {
  servers: ServersInfo;
}

const initialState: ServersInfoState = {
  servers: {},
};

export const serversInfoSlice = createSlice({
  name: "serversInfo",
  initialState,
  reducers: {
    setServerStatus: (
      state,
      action: PayloadAction<{ id: number; status: RemoteServerStatus }>
    ) => {
      const { id, status } = action.payload;
      state.servers[id].status = status;
    },
    setServerMetrics: (
      state,
      action: PayloadAction<{ id: number; health: RemoteServerMetrics }>
    ) => {
      const { id, health } = action.payload;
      state.servers[id].metrics = health;
    },
    setInitialServersInfo: (state, action: PayloadAction<ServersInfo>) => {
      state.servers = action.payload;
    },
  },
});

export const { setServerStatus, setInitialServersInfo, setServerMetrics } =
  serversInfoSlice.actions;

export const selectServerIds = (state: RootState) =>
  Object.keys(state.serversInfo.servers).map(Number);

export const selectServerIP = (state: RootState, id: number) =>
  state.serversInfo.servers[id]?.ip;

export const selectServerName = (state: RootState, id: number) =>
  state.serversInfo.servers[id]?.name;

export const selectServerStatus = (state: RootState, id: number) =>
  state.serversInfo.servers[id]?.status;

export const selectServerMetrics = (state: RootState, id: number) =>
  state.serversInfo.servers[id]?.metrics;

export default serversInfoSlice.reducer;
