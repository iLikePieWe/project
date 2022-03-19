import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  CssBaseline,
  Divider,
  Grid,
  IconButton,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import React from "react";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/xml/xml";
import "codemirror/mode/clike/clike";
import "codemirror/mode/css/css";
import "codemirror/theme/eclipse.css";
import "codemirror/theme/paraiso-dark.css";
import "codemirror/keymap/sublime";
import "./Problem.css";
import { Controlled as CodeMirror } from "react-codemirror2";
import {
  DarkModeRounded,
  ExpandMoreRounded,
  LightModeRounded,
  SendRounded,
} from "@mui/icons-material";

const Problem = (props) => {
  const { name, description, hints } = props;

  const [code, setCode] = React.useState(
    "#include <iostream>\nint main() {\n  // Write your code here\n  return 0;\n}"
  );
  const [success, setSuccess] = React.useState();
  const [isFetching, setIsFetching] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [output, setOutput] = React.useState();
  const [compilerDarkMode, setCompilerDarkMode] = React.useState(
    localStorage.getItem("compilerdarkmode") === "true"
  );

  React.useEffect(() => {
    localStorage.setItem("compilerdarkmode", compilerDarkMode);
  }, [compilerDarkMode]);

  const handleRun = async () => {
    setLoading(true);
    setIsFetching(true);
    let index = window.location.pathname.substring(10);

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: code, index: index }),
    };
    fetch("/api/compiler", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        setOutput(data);
        setSuccess(data.success);
      });
    setTimeout(() => setIsFetching(false), 4000);
  };

  function Explanation() {
    return (
      <Box sx={{ width: "100%" }}>
        <Typography variant="h4" sx={{ mb: "10px" }}>
          {name}
        </Typography>
        <Typography
          paragraph
          sx={{ wordBreak: "break-word", whiteSpace: "pre-line" }}
        >
          {description}
        </Typography>
        {hints.length > 0 && (
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreRounded />}>
              <Typography variant="h6">Подсказки</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid gap="10px" container>
                {hints.map((hint, index) => (
                  <Grid item xs={12}>
                    <Card variant="outlined" sx={{ width: "100%", p: 1 }}>
                      {hint}
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </AccordionDetails>
          </Accordion>
        )}
      </Box>
    );
  }

  return (
    <>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexFlow: { xs: "column wrap", md: "row nowrap" },
          width: "100%",
          minHeight: "40vh",
          p: 2,
          justifyContent: "space-around",
          gap: "10px",
          alignItems: "stretch",
        }}
      >
        <Paper
          variant="outlined"
          sx={{ display: "flex", width: "100%", mb: "10px", p: 2 }}
        >
          <Explanation />
        </Paper>
        <Paper
          variant="outlined"
          sx={{
            display: "block",
            width: "100%",
            maxWidth: "100%",
            overflow: "hidden",
          }}
        >
          <Box sx={{ width: "100%", mb: "200px" }}>
            <CodeMirror
              className="code-editor"
              value={code}
              options={{
                mode: "text/x-c++src",
                theme: compilerDarkMode === true ? "paraiso-dark" : "eclipse",
                lineNumbers: true,
                readOnly: false,
                lineWrapping: true,
                keyMap: "sublime",
              }}
              onBeforeChange={(editor, data, value) => {
                setCode(value);
              }}
            />
          </Box>
          <Divider />
          <Box
            sx={{
              p: 1,
              display: "flex",
              width: "100%",
              justifyContent: "flex-start",
            }}
          >
            <Box sx={{ flexGrow: 1 }}>
              <Tooltip
                arrow
                placement="right"
                title={
                  compilerDarkMode === true
                    ? "Switch compiler to light mode"
                    : "Switch compiler to dark mode"
                }
              >
                <IconButton
                  onClick={() => setCompilerDarkMode(!compilerDarkMode)}
                >
                  {compilerDarkMode === true ? (
                    <DarkModeRounded />
                  ) : (
                    <LightModeRounded />
                  )}
                </IconButton>
              </Tooltip>
            </Box>
            <Button
              variant="contained"
              onClick={handleRun}
              endIcon={<SendRounded />}
            >
              Submit
            </Button>
          </Box>
          {!isFetching && (
            <Box>
              <Divider />

              <Box>
                {success !== undefined ? (
                  success === false ? (
                    <Box sx={{ p: 2 }}>
                      <Divider sx={{ p: 2 }}>
                        <Chip label="Входни данни" />
                      </Divider>
                      <Paper
                        variant="outlined"
                        sx={{
                          display: "block",
                          width: "100%",
                          maxWidth: "100%",
                          overflow: "hidden",
                        }}
                      >
                        <Typography
                          paragraph
                          sx={{ p: 1, whiteSpace: "pre-line" }}
                        >
                          {output.failedCase.input}
                        </Typography>
                      </Paper>
                      <Divider sx={{ p: 2 }}>
                        <Chip label="Очакван изход" />
                      </Divider>
                      <Paper
                        variant="outlined"
                        sx={{
                          display: "block",
                          width: "100%",
                          maxWidth: "100%",
                          overflow: "hidden",
                        }}
                      >
                        <Typography
                          paragraph
                          sx={{ p: 1, whiteSpace: "pre-line" }}
                        >
                          {output.failedCase.output}
                        </Typography>
                      </Paper>
                      <Divider sx={{ p: 2 }}>
                        <Chip label="Изход" />
                      </Divider>
                      <Paper
                        variant="outlined"
                        sx={{
                          display: "block",
                          width: "100%",
                          maxWidth: "100%",
                          overflow: "hidden",
                        }}
                      >
                        <Typography
                          paragraph
                          sx={{ p: 1, whiteSpace: "pre-line" }}
                        >
                          {output.yourOutput}
                        </Typography>
                      </Paper>
                    </Box>
                  ) : (
                    <Box>
                      <Alert severity="success">
                        Проблемът премина всички тестове
                      </Alert>
                    </Box>
                  )
                ) : (
                  <Box>
                    <Alert severity="error">
                      Възникна грешка при компилирането
                    </Alert>
                  </Box>
                )}
              </Box>
            </Box>
          )}
          {loading && isFetching && (
            <>
              <Divider />
              <Box
                sx={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "center",
                  p: 1,
                }}
              >
                <CircularProgress />
              </Box>
            </>
          )}
        </Paper>
      </Box>
    </>
  );
};

export default Problem;
