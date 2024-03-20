import Container from "@mui/material/Container";
import TopBar from "@/ui/Dashboard/TopBar";

import StoreProvider from "@/app/StoreProvider";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <StoreProvider>
        <TopBar />
        <Container
          maxWidth="lg"
          sx={{
            p: "30px",
            maxWidth: "1000px",
            justifyContent: "center",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {children}
        </Container>
      </StoreProvider>
    </>
  );
}
