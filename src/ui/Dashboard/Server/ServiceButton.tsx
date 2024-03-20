"use client"

import React from "react";

import Button from "@mui/material/Button";
import Image from "next/image";

const ServiceButton = () => {
  return (
    <Button
      sx={{
        width: "150px",
        height: "150px", 
        position: "relative", 
        overflow: "hidden", 
        transition: "filter 0.3s", // Dodaj efekt transition
        "&:hover": {
          filter: "brightness(1.6)", // Rozjaśnij obrazek po najechaniu
        },
      }}
      onClick={() => {
        
      }}
    >
      <Image
        src="/images/services/valheim_service.png" 
        alt="Valheim Server"
        layout="fill" 
        objectFit="cover"
      />
    </Button>
  );
};

export default ServiceButton;
