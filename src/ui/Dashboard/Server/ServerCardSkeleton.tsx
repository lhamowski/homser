import React from "react";

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Skeleton,
} from "@mui/material";

const ServerCardSkeleton = () => {

  return (
    <Accordion defaultExpanded>
      <AccordionSummary>
          <Skeleton width={150} />
      </AccordionSummary>
      <AccordionDetails>
          <Box sx={{ width: "100%" }}>
            <Skeleton height={100} />
          </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default ServerCardSkeleton;
