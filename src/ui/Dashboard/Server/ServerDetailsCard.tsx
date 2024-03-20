import React from "react";

import { Card, CardContent, Typography } from "@mui/material";

interface ServerDetailsCardProps {
  header: string;
  text: string;
  width: number;
}

const ServerDetailsCard = (props: ServerDetailsCardProps) => {
  return (
    <Card sx={{ boxShadow: "none", width: props.width}}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {props.header}
        </Typography>
        <Typography variant="h5">{props.text}</Typography>
      </CardContent>
    </Card>
  );
};

export default ServerDetailsCard;
