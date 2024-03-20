"use client";

import React from "react";

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Divider,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import ServerDetails from "@/ui/Dashboard/Server/ServerDetails";
import ServerActions from "@/ui/Dashboard/Server/ServerActions";
import ServicesContent from "@/ui/Dashboard/Server/ServicesContent";

import { useAppSelector } from "@/lib/hooks";
import { selectServerName, selectServerStatus } from "@/lib/server/infoSlice";
import { RemoteServerStatus } from "@/app/remoteServerStatus";

interface ServerCardProps {
  id: number;
}

export const textColorFromStatus = (status: RemoteServerStatus) => {
  switch (status) {
    case RemoteServerStatus.Started:
      return "success.main";
    case RemoteServerStatus.Stopped:
      return "error.main";
    case RemoteServerStatus.Starting:
    case RemoteServerStatus.Stopping:
      return "warning.main";
  }
};

const ServerCard = (props: ServerCardProps) => {
  const serverStatus = useAppSelector((state) =>
    selectServerStatus(state, props.id)
  );

  const serverName = useAppSelector((state) =>
    selectServerName(state, props.id)
  );

  return (
    <Accordion defaultExpanded>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={serverName}
        id={serverName}
      >
        {serverName}
        <Typography
          sx={{ marginLeft: "10px" }}
          color={textColorFromStatus(serverStatus)}
        >
          ⬤
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "stretch", md: "center" },
            flexDirection: { xs: "column", md: "row" },
            gap: { xs: "30px", md: "5px" },
          }}
        >
          <ServerDetails id={props.id} />
          <ServerActions id={props.id} />
        </Box>
        {serverStatus == RemoteServerStatus.Started && (
          <>
            <Divider sx={{ mt: 4 }} variant="middle" />
            <ServicesContent />
          </>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

export default ServerCard;
