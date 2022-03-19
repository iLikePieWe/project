import {
  ArrowBackRounded,
  ArrowForwardRounded,
  SendRounded,
  TagRounded,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Card,
  Fab,
  Grid,
  IconButton,
  InputAdornment,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import globalChannels from "../consts/globalChannels";
import axios from "axios";
import jwtDecode from "jwt-decode";

const GlobalChat = () => {
  const [mobileDisplay, setMobileDisplay] = React.useState(false);
  const [tab, setTab] = React.useState(0);
  const [text, setText] = React.useState("");
  const [messages, setMessages] = React.useState();
  const handleTabChange = (event, newTab) => {
    setTab(newTab);
  };

  const ShowMenu = () => {
    return (
      <>
        <Fab
          onClick={() => setMobileDisplay(!mobileDisplay)}
          size="medium"
          sx={{ m: 1, display: { sm: "none" } }}
        >
          {mobileDisplay ? <ArrowBackRounded /> : <ArrowForwardRounded />}
        </Fab>
      </>
    );
  };

  const submitText = () => {
    if (text.length >= 1) {
      let userToken = localStorage.getItem("token");
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: userToken,
          message: text,
          channelIndex: tab,
        }),
      };
      fetch("api/messages", requestOptions);

      setText("");
      window.scrollTo(0, document.body.scrollHeight);
    }
  };

  const userCheck = (username) => {
    let isUser =
      jwtDecode(localStorage.getItem("token"))["username"] === username;
    return isUser;
  };

  async function fetchData() {
    let res = await axios("/api/get-messages");
    let messages = await res.data.messages;
    setMessages(messages);
  }

  useEffect(() => {
    fetchData();
  }, [, messages]);
  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight);
  }, [tab]);
  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight);
  }, []);

  function getColor(user, color) {
    if (userCheck(user)) {
      return color;
    }
  }

  return (
    <>
      <Box
        sx={{
          position: "fixed",
          display: { xs: mobileDisplay ? "initial" : "none", sm: "initial" },
          height: "100%",
          width: { xs: "140px", sm: "160px", md: "180px", lg: "200px" },
          borderRight: 1,
          borderColor: "divider",
        }}
      >
        <Tabs
          orientation="vertical"
          variant="scrollable"
          scrollButtons
          value={tab}
          onChange={handleTabChange}
          sx={{ height: "100vh" }}
        >
          {globalChannels.map((channel, index) => (
            <Tab
              icon={<TagRounded />}
              iconPosition="start"
              label={channel.name}
              id={index}
              sx={{ textDecoration: "none" }}
            />
          ))}
        </Tabs>
      </Box>
      <Box
        sx={{
          pl: {
            xs: mobileDisplay ? "140px" : "0px",
            sm: "160px",
            md: "180px",
            lg: "200px",
          },
          height: "100vh",
        }}
      >
        <Box sx={{ position: "fixed", zIndex: 99 }}>
          <ShowMenu />
        </Box>
        <Box sx={{ p: 2, pt: { xs: "70px", sm: 2 }, pb: "120px" }}>
          {messages && (
            <Grid container rowGap={1}>
              {messages.map(
                (message, indexMessage) =>
                  globalChannels[tab].name === message.channel && (
                    <Grid container item xs={12}>
                      {userCheck(message.username) && (
                        <Box sx={{ flexGrow: 1 }}></Box>
                      )}
                      <Card
                        sx={{
                          p: 1,
                          color: getColor(message.username, "#fff"),
                          backgroundColor: getColor(
                            message.username,
                            "#2196f3"
                          ),
                        }}
                      >
                        {!userCheck(message.username) && (
                          <Grid
                            item
                            columnGap={1}
                            xs={12}
                            sx={{ display: "inline-flex" }}
                          >
                            <Avatar
                              src="#"
                              sx={{
                                position: "relative",
                                display: "inline-flex",
                                zIndex: 1,
                              }}
                            />
                            <Typography noWrap variant="h6">
                              {message.username}
                            </Typography>
                          </Grid>
                        )}
                        <Grid item xs={12}>
                          <Typography
                            paragraph
                            sx={{
                              wordWrap: "break-word",
                              whiteSpace: "pre-line",
                            }}
                          >
                            {message.message}
                          </Typography>
                        </Grid>
                      </Card>
                    </Grid>
                  )
              )}
            </Grid>
          )}
        </Box>
        <Box
          sx={{
            p: "20px",
            borderTop: 1,
            borderColor: "divider",
            zIndex: 99,
            bottom: "0px",
            position: "fixed",
            backdropFilter: "blur(20px)",
            width: {
              xs: mobileDisplay ? "calc(100vw - 155px)" : "calc(100vw - 15px)",
              sm: "calc(100vw - 175px)",
              md: "calc(100vw - 195px)",
              lg: "calc(100vw - 215px)",
            },
          }}
        >
          <TextField
            autoFocus
            onChange={(event) => setText(event.target.value)}
            value={text}
            label={"Пратете съобщение в #" + globalChannels[tab].name}
            multiline
            disabled={tab === 0 ? true : false}
            maxRows={4}
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    disabled={tab === 0 ? true : false}
                    onClick={submitText}
                    color="primary"
                  >
                    <SendRounded />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          ></TextField>
        </Box>
      </Box>
    </>
  );
};

export default GlobalChat;
