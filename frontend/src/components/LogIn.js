import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import { Alert, IconButton, Snackbar } from "@mui/material";
import { VisibilityOffRounded, VisibilityRounded } from "@mui/icons-material";
import { InputAdornment } from "@mui/material";

export default function LogIn() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [error, setError] = React.useState(false);
  const handleSubmit = () => {
    const createToken = (data) => {
      if (data.usertoken) {
        localStorage.setItem("token", data.usertoken);
        document.location.reload();
      } else if (!data.success) {
        setError(true);
      }
    };
    let _username = username.trim();
    let _password = password.trim();
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: _username, password: _password }),
    };
    fetch("api/log-in", requestOptions)
      .then((response) => response.json())
      .then((data) => createToken(data));
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Snackbar
        autoHideDuration={10000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={error}
        onClose={() => setError(false)}
      >
        <Alert severity="error" onClose={() => setError(false)}>
          Паролата или името не съвпадат
        </Alert>
      </Snackbar>
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "primary.light" }}>
          <AccountCircleRoundedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Вход
        </Typography>
        <Box noValidate sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoFocus
                required
                fullWidth
                id="email"
                label="Имейл / Потребителско име"
                name="username"
                autoComplete="email"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Парола"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setShowPassword(showPassword ? false : true)
                        }
                      >
                        {showPassword ? (
                          <VisibilityOffRounded />
                        ) : (
                          <VisibilityRounded />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
          <Button
            fullWidth
            variant="contained"
            onClick={handleSubmit}
            sx={{ mt: 3, mb: 2 }}
          >
            Влизане
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
