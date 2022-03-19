import { AccountCircleRounded } from "@mui/icons-material";
import {
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Input,
  Tab,
  Tabs,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";

const Settings = () => {
  const [tab, setTab] = React.useState(0);
  const [passChangeOpen, setPassChangeOpen] = useState(false);
  const [nameChangeOpen, setNameChangeOpen] = useState(false);

  const [newUsername, setNewUsername] = useState();
  const [pass, setPass] = useState();
  const [oldPass, setOldPass] = useState();
  const [newPass, setNewPass] = useState();
  const handleTabChange = (event, newTab) => {
    setTab(newTab);
  };

  return (
    <>
      <Dialog
        disableRestoreFocus
        open={nameChangeOpen}
        onClose={() => setNameChangeOpen(false)}
        fullWidth
      >
        <DialogTitle>{"Промяна на потребителско име"}</DialogTitle>
        <Divider />
        <DialogContent>
          <Grid container rowGap={1}>
            <Grid item xs={12}>
              <TextField
                value={newUsername}
                required
                fullWidth
                label="Ново потребителско име"
                onChange={(e) => setNewUsername(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                value={pass}
                required
                fullWidth
                label="Парола"
                onChange={(e) => setPass(e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button variant="contained">Потвърждаване на промяна</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        disableRestoreFocus
        open={passChangeOpen}
        onClose={() => setPassChangeOpen(false)}
        fullWidth
      >
        <DialogTitle>{"Промяна на парола"}</DialogTitle>
        <Divider />
        <DialogContent>
          <Grid container rowGap={1}>
            <Grid item xs={12}>
              <TextField
                value={oldPass}
                required
                fullWidth
                label="Стара парола"
                onChange={(e) => setOldPass(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                value={newPass}
                required
                fullWidth
                label="Нова парола"
                onChange={(e) => setNewPass(e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button variant="contained">Потвърждаване на промяна</Button>
        </DialogActions>
      </Dialog>
      <Box
        sx={{
          display: "flex",
          width: "100%",
          height: { xs: "calc(100vh - 56px)", sm: "calc(100vh - 64px)" },
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Card variant="outlined" square sx={{ width: "80%", height: "80%" }}>
          <Box sx={{ width: "100%", borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              variant="fullWidth"
              centered
              scrollButtons
              value={tab}
              onChange={handleTabChange}
            >
              <Tab
                icon={<AccountCircleRounded />}
                iconPosition="start"
                label="Профил"
                id={0}
              />
            </Tabs>
          </Box>
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            rowGap={2}
            wrap="nowrap"
            sx={{ p: 1, pt: 5, pb: 5 }}
          >
            <Grid item xs={12} sx={{ width: "100%" }}>
              <Box>
                <label htmlFor="profile-choice">
                  <Input
                    accept=".png,.jpg,.jpeg"
                    id="profile-choice"
                    multiple
                    type="file"
                    sx={{ display: "none" }}
                  />
                  <Button variant="contained" fullWidth component="span">
                    Качване на профилна снимка
                  </Button>
                </label>
              </Box>
            </Grid>
            <Grid item xs={12} sx={{ width: "100%" }}>
              <Button
                onClick={() => setNameChangeOpen(true)}
                variant="contained"
                fullWidth
              >
                Промяна на потребителско име
              </Button>
            </Grid>
            <Grid item xs={12} sx={{ width: "100%" }}>
              <Button
                onClick={() => setPassChangeOpen(true)}
                variant="contained"
                fullWidth
              >
                Промяна на парола
              </Button>
            </Grid>
          </Grid>
        </Card>
      </Box>
    </>
  );
};

export default Settings;
