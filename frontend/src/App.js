import { Box, ThemeProvider, createTheme } from "@mui/material";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import GlobalChat from "./components/GlobalChat";
import LogIn from "./components/LogIn";
import Problems from "./components/Problems";
import SignUp from "./components/SignUp";
import TopBar from "./components/TopBar";
import React from "react";
import { useState, useEffect } from "react";
import { Tooltip } from "@mui/material";
import { IconButton } from "@mui/material";
import { DarkModeRounded } from "@mui/icons-material";
import { LightModeRounded } from "@mui/icons-material";
import Settings from "./components/Settings";
import Problem from "./components/Problem";

function App() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkmode") === "true"
  );

  useEffect(() => {
    localStorage.setItem("darkmode", darkMode);
  }, [darkMode]);

  function ModeToggle() {
    return (
      <Tooltip
        arrow
        placement="left"
        title={
          darkMode === true ? "Смяна на светъл режим" : "Смяна на тъмен режим"
        }
      >
        <IconButton sx={{ mr: "10px" }} onClick={() => setDarkMode(!darkMode)}>
          {darkMode === true ? <DarkModeRounded /> : <LightModeRounded />}
        </IconButton>
      </Tooltip>
    );
  }

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <TopBar darkModeButton={<ModeToggle />} />
        <Box sx={{ mt: { xs: "56px", sm: "64px" } }}>
          <Routes>
            <Route exact path="/" element={<Navigate replace to="/global" />} />
            {localStorage.getItem("token") !== null ? (
              <Route path="/global" element={<GlobalChat />} />
            ) : (
              <Route
                path="/global"
                element={<Navigate replace to="/log-in" />}
              />
            )}
            {localStorage.getItem("token") !== null ? (
              <Route exact path="/problems" element={<Problems />} />
            ) : (
              <Route
                path="/problems"
                element={<Navigate replace to="/log-in" />}
              />
            )}
            {localStorage.getItem("token") === null ? (
              <Route path="/sign-up" element={<SignUp />} />
            ) : (
              <Route
                path="/sign-up"
                element={<Navigate replace to="/global" />}
              />
            )}
            {localStorage.getItem("token") === null ? (
              <Route path="/log-in" element={<LogIn />} />
            ) : (
              <Route
                path="/log-in"
                element={<Navigate replace to="/global" />}
              />
            )}
            <Route path="/settings" element={<Settings />} />
          </Routes>
          <Routes>
            {JSON.parse(localStorage.getItem("problems")).map(
              (problem, index) => (
                <Route
                  key={index}
                  path={`problems/${index}`}
                  element={
                    <Problem
                      name={problem.title}
                      description={problem.description}
                      hints={problem.hints}
                    />
                  }
                />
              )
            )}
          </Routes>
        </Box>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
