import fs from "fs";
import axios, { AxiosResponse } from "axios";
import { Server } from "socket.io";
import { RemoteServerStatus } from "./remoteServerStatus";
import { RemoteServerEvent } from "./remoteServerEvent";

export interface RemoteServerMetrics {
  cpuUsage: number;
  cpuTemp: number;
  ramUsage: string;
}

export interface RemoteServer {
  id: number;
  ip: string;
  name: string;
  status: RemoteServerStatus;
  metrics?: RemoteServerMetrics;
  turnOn: () => Promise<boolean>;
  turnOff: () => Promise<boolean>;
}

interface TurnMethod {
  method: string;
  url: string;
  data?: {
    isFormData?: boolean;
    body: Record<string, any> | string;
  };
}

interface ServerConfig {
  id: number;
  ip: string;
  name: string;
  turnOnMethod: TurnMethod;
  turnOffMethod: TurnMethod;
}

const sendHttpRequest = async (
  method: string,
  url: string,
  data?: { isFormData?: boolean; body: Record<string, any> | string }
): Promise<boolean> => {
  try {
    let axiosConfig: any = { method, url };

    if (data) {
      if (
        method === "POST" &&
        data.isFormData &&
        typeof data.body === "object"
      ) {
        const formData = new FormData();
        for (const key in data.body) {
          if (Object.prototype.hasOwnProperty.call(data.body, key)) {
            formData.append(key, data.body[key]);
          }
        }
        axiosConfig = {
          ...axiosConfig,
          data: formData,
          headers: { "Content-Type": "multipart/form-data" },
        };
      } else {
        axiosConfig = { ...axiosConfig, data: data.body };
      }
    }

    const response: AxiosResponse = await axios(axiosConfig);
    return response.status === 200;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error sending HTTP request:", error.message);
    } else {
      console.error("Error sending HTTP request: Unknown error");
    }
    return false;
  }
};

export class RemoteServersManager {
  public constructor(io: Server) {

    this.remoteServers = [];
    this.loadRemoteServers();
    this.io = io;

    this.io.on("connection", (socket) => {
      console.log(`Client connected: ${socket.id}`);

      socket.on("RemoteServerMetrics", (data) => {
        console.log("Metrics received:", data);

        const offlineTimeout = 5000;

        const { id, cpuUsage, cpuTemp, ramUsage } = data;
        const server = this.remoteServers.find((server) => server.id === id);
        if (server) {
          server.metrics = { cpuUsage, cpuTemp, ramUsage };

          if (this.timers[id]) {
            clearTimeout(this.timers[id]);
            delete this.timers[id];
          }

          this.timers[id] = setTimeout(() => {
            this.setRemoteServerStatus(id, RemoteServerStatus.Stopped);
            console.log(`Timeout for server ${id} reached`);
          }, offlineTimeout);

          if (server.status === RemoteServerStatus.Stopping) {
            return;
          }

          if (server.status !== RemoteServerStatus.Started) {
            this.setRemoteServerStatus(id, RemoteServerStatus.Started);
          }

          this.io.emit(RemoteServerEvent.RemoteServerMetrics, {
            id,
            cpuUsage,
            cpuTemp,
            ramUsage,
          });
        }
      });

      socket.on("disconnect", () => {
        console.log(`Client disconnected: ${socket.id}`);
      });
    });
  }

  public getRemoteServers = () => {
    return this.remoteServers;
  };

  public getRemoteServer = (id: number) => {
    return this.remoteServers.find((server) => server.id === id);
  };

  public setRemoteServerStatus = (id: number, status: RemoteServerStatus) => {
    const server = this.remoteServers.find((server) => server.id === id);
    if (server) {
      if (server.status === status) {
        return;
      }
      server.status = status;
      this.onRemoteServerStatusChanged(id, status);
    }
  };

  private onRemoteServerStatusChanged = (
    id: number,
    status: RemoteServerStatus
  ) => {
    console.log(`Server ${id} status changed to ${status}`);
    this.io.emit(RemoteServerEvent.StatusChanged, { id, status });

    switch (status) {
      case RemoteServerStatus.Starting:
        const startingTimeout = 40000;
        if (this.timers[id]) {
          clearTimeout(this.timers[id]);
          delete this.timers[id];
        }
        this.timers[id] = setTimeout(() => {
          this.setRemoteServerStatus(id, RemoteServerStatus.Stopped);
        }, startingTimeout);
        break;
      case RemoteServerStatus.Started:
        if (this.timers[id]) {
          clearTimeout(this.timers[id]);
          delete this.timers[id];
        }
        break;
      case RemoteServerStatus.Stopping:
        break;
      case RemoteServerStatus.Stopped:
        if (this.timers[id]) {
          clearTimeout(this.timers[id]);
          delete this.timers[id];
        }
        break;
    }
  };

  private loadRemoteServers = () => {
    try {
      const rawServerData = fs.readFileSync("servers.json", "utf-8");
      const serverData: ServerConfig[] = JSON.parse(rawServerData);

      this.remoteServers = serverData.map((server) => ({
        id: server.id,
        ip: server.ip,
        name: server.name,
        status: RemoteServerStatus.Stopped,
        cpuUsage: 0,
        ramUsage: "",
        turnOn: async () =>
          sendHttpRequest(
            server.turnOnMethod.method,
            server.turnOnMethod.url,
            server.turnOnMethod.data
          ),
        turnOff: async () =>
          sendHttpRequest(
            server.turnOffMethod.method,
            server.turnOffMethod.url,
            server.turnOffMethod.data
          ),
      }));
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error loading remote servers:", error.message);
      } else {
        console.error("Error loading remote servers: unknown error");
      }
    }

    console.log("Remote servers loaded");
    console.log(this.remoteServers);
  };

  private remoteServers: RemoteServer[];
  private io: Server;
  private timers: { [id: number]: NodeJS.Timeout } = {};
}
