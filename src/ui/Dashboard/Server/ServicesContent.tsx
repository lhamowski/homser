import React from "react";

import { Typography, Box } from "@mui/material";

import ServiceButton from "@/ui/Dashboard/Server/ServiceButton";

const ServicesContent = () => {
  return (
    <Box m={2}>
      <Typography
        sx={{ fontSize: 14, mb: 2 }}
        color="text.secondary"
        gutterBottom
      >
        Services
      </Typography>
      <ServiceButton />
    </Box>
  );
};

export default ServicesContent;
