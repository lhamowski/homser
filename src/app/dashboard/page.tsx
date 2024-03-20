"use client";

import React, { useEffect, useState } from "react";

import { io } from "socket.io-client";

import { RemoteServerEvent } from "@/server/remoteServerEvent";
import { RemoteServerStatus } from "@/server/remoteServerStatus";

import ServerCard from "@/ui/Dashboard/Server/ServerCard";
import ServerCardSkeleton from "@/ui/Dashboard/Server/ServerCardSkeleton";

import { getServerList } from "@/lib/server/list";
import { useAppDispatch } from "@/lib/hooks";
import {
  ServersInfo,
  setInitialServersInfo,
  setServerStatus,
  setServerMetrics,
} from "@/lib/server/infoSlice";

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const [serverList, setServerList] = useState<ServersInfo>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const serverList = await getServerList();
        if (serverList) {
          setServerList(serverList);
          dispatch(setInitialServersInfo(serverList));
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error("Request failed: ", error.message);
        } else {
          console.error("Request failed with unknown error");
        }
      }
    };

    fetchData();

    const socket = io();

    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    socket.on(
      RemoteServerEvent.StatusChanged,
      (data: { id: number; status: RemoteServerStatus }) => {
        dispatch(setServerStatus({ id: data.id, status: data.status }));
      }
    );

    socket.on(RemoteServerEvent.RemoteServerMetrics, (data) => {
      dispatch(
        setServerMetrics({
          id: data.id,
          health: {
            cpuUsage: data.cpuUsage,
            cpuTemp: data.cpuTemp,
            ramUsage: data.ramUsage,
          },
        })
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [dispatch]);

  return (
    <>
      {Object.keys(serverList).map((idString) => (
        <ServerCard key={Number(idString)} id={Number(idString)} />
      ))}
      {Object.keys(serverList).length === 0 && <ServerCardSkeleton />}
    </>
  );
};

export default Dashboard;
