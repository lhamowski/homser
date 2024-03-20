import React from "react";

import { Box } from "@mui/material";

import ServerDetailsCard from "@/ui/Dashboard/Server/ServerDetailsCard";
import { useAppSelector } from "@/lib/hooks";
import {
  selectServerIP,
  selectServerStatus,
  selectServerMetrics,
} from "@/lib/server/infoSlice";

interface ServerDetailsProps {
  id: number;
}

const ServerDetails = (props: ServerDetailsProps) => {
  const serverStatus = useAppSelector((state) =>
    selectServerStatus(state, props.id)
  );
  const serverIP = useAppSelector((state) => selectServerIP(state, props.id));
  const serverMetrics = useAppSelector((state) =>
    selectServerMetrics(state, props.id)
  );

  console.log(serverMetrics);
  console.log(serverStatus);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: "3px",
      }}
    >
      <ServerDetailsCard header="Public IP" text={serverIP} width={200} />
      
      <ServerDetailsCard header="Status" text={serverStatus} width={120} />
      {serverStatus === "Started" && serverMetrics && (
        <>
          <ServerDetailsCard
            header="CPU Usage"
            text={serverMetrics.cpuUsage.toString() + "%"}
            width={120}
          />
          <ServerDetailsCard
            header="CPU Temp"
            text={serverMetrics.cpuTemp.toString() + "°C"}
            width={100}
          />
          <ServerDetailsCard
            header="Memory Usage"
            text={serverMetrics.ramUsage.toString() + "GB"}
            width={200}
          />
        </>
      )}
    </Box>
  );
};

export default ServerDetails;
