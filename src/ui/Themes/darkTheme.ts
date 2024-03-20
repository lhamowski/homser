"use client";

import { createTheme } from "@mui/material/styles";

import { Chakra_Petch } from "next/font/google";

const cutiveMono = Chakra_Petch({
  weight: "400",
  subsets: ["latin"],
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
  typography: {
    fontFamily: cutiveMono.style.fontFamily,
  },
});

export default darkTheme;
