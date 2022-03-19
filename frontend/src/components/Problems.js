import {
  AddRounded,
  DoneRounded,
  ErrorRounded,
  ExpandMoreRounded,
  FilterAltRounded,
  RemoveRounded,
  SearchRounded,
  SendRounded,
} from "@mui/icons-material";
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useCallback, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Link } from "react-router-dom";
import problemFilters from "../consts/problemFilters";
import axios from "axios";
import jwtDecode from "jwt-decode";

const getProblemInfo = async () => {
  return (await axios("/api/get-problem-info")).data.problemInfo;
};
getProblemInfo().then((res) => {
  if (localStorage.getItem("problems")) {
    localStorage.removeItem("problems");
  }
  localStorage.setItem("problems", JSON.stringify(res));
});

const Problems = () => {
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [problemCreationOpen, setProblemCreationOpen] = useState(false);
  const [hints, setHints] = useState([""]);
  const [testCases, setTestCases] = useState([{ input: "", output: "" }]);
  const [problemDifficulty, setProblemDifficulty] = useState("Лесно");

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };
  const addFilter = (e) => {
    if (!activeFilters.includes(e)) {
      setActiveFilters([...activeFilters, e]);
    } else {
      setActiveFilters(activeFilters.filter((item) => item !== e));
    }
  };

  const getSelectedItems = (arr1, arr2) => {
    var selected = [];

    for (var i = 0; i < arr1.length; i++) {
      for (var j = 0; j < arr2.length; j++) {
        if (arr1[i] === arr2[j]) {
          selected.push(arr1[i]);
        }
      }
    }
    return selected;
  };

  const ProblemGrid = (props) => {
    const ProblemCard = (props) => {
      const { index, title, author, description, difficulty } = props;

      return (
        <Grid item zeroMinWidth xs={12} md={6} lg={4}>
          <Link to={`${index}`} style={{ textDecoration: "none" }}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "nowrap",
                    width: "100%",
                    mb: "10px",
                  }}
                >
                  <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
                    {title}
                  </Typography>
                </Box>
                <Typography
                  paragraph
                  sx={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    wordWrap: "break-word",
                  }}
                >
                  {description}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "nowrap",
                    width: "100%",
                  }}
                >
                  <Box sx={{ flexGrow: 1 }}>
                    {difficulty.map((tag) => (
                      <Chip
                        sx={{ mr: "5px" }}
                        label={tag}
                        color={
                          tag === "Трудно"
                            ? "error"
                            : tag === "Средно"
                            ? "warning"
                            : "success"
                        }
                      />
                    ))}
                  </Box>
                  <Chip avatar={<Avatar />} label={`Създадено от ${author}`} />
                </Box>
              </CardContent>
            </Card>
          </Link>
        </Grid>
      );
    };
    let exampleProblems = props.problems;
    return (
      <Grid container spacing={2} alignItems="center">
        {exampleProblems.map((problem, index) => (
          <>
            {problem.difficulty.includes(
              ...getSelectedItems(activeFilters, problem.difficulty)
            ) &&
              activeFilters.length > 0 &&
              problem.title
                .toLowerCase()
                .includes(searchText.toLowerCase()) && (
                <ProblemCard
                  index={index}
                  title={problem.title}
                  description={problem.description}
                  difficulty={problem.difficulty}
                  author={problem.author}
                />
              )}
          </>
        ))}
        {exampleProblems.map((problem, index) => (
          <>
            {activeFilters.length === 0 &&
              problem.title
                .toLowerCase()
                .includes(searchText.toLowerCase()) && (
                <ProblemCard
                  index={index}
                  title={problem.title}
                  description={problem.description}
                  difficulty={problem.difficulty}
                  author={problem.author}
                />
              )}
          </>
        ))}
        {!exampleProblems.some((element) =>
          element.title.toLowerCase().includes(searchText.toLowerCase())
        ) && (
          <Grid item xs={12} sx={{ width: "100%", mt: "200px" }}>
            <Typography align="center" variant="h4" sx={{ mb: "10px" }}>
              Проблемът не беше намерен
            </Typography>
            <Box textAlign="center">
              <ErrorRounded fontSize="large" />
            </Box>
          </Grid>
        )}
      </Grid>
    );
  };

  function ProblemCreation() {
    const createProblem = (event) => {
      const data = new FormData(event.currentTarget);
      let title = data.get("title").trim();
      let description = data.get("description").trim();
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title,
          description: description,
          author: jwtDecode(localStorage.getItem("token"))["username"],
          testcases: testCases,
          hints: hints,
          difficulty: problemDifficulty,
        }),
      };
      fetch("api/create-problem", requestOptions)
        .then((response) => response.json())
        .then((data) => console.log(data));
    };
    return (
      <>
        <Dialog
          disableRestoreFocus
          open={problemCreationOpen}
          onClose={() => setProblemCreationOpen(false)}
          fullWidth
          component="form"
          onSubmit={createProblem}
        >
          <DialogTitle>{"Създайте нова задача"}</DialogTitle>
          <DialogContent>
            <Grid container rowGap={2} columnSpacing={1}>
              <Grid item xs={12}>
                <TextField
                  required
                  autoFocus
                  id="name"
                  label="Име на задачата"
                  type="text"
                  fullWidth
                  variant="filled"
                  name="title"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  id="name"
                  placeholder="Описание на задачата"
                  type="text"
                  name="description"
                  fullWidth
                  multiline
                  rows={6}
                  variant="outlined"
                />
              </Grid>
              <Grid container item spacing={0.5} sx={{ alignItems: "stretch" }}>
                {problemFilters.map((filter, index) => (
                  <Grid item zeroMinWidth xs={4} sx={{ width: "100px" }}>
                    <Chip
                      sx={{ width: "100%" }}
                      deleteIcon={<DoneRounded />}
                      onDelete={
                        problemDifficulty === filter.label ? true : false
                      }
                      onClick={() => setProblemDifficulty(filter.label)}
                      key={index}
                      label={filter.label}
                      color={filter.color}
                    />
                  </Grid>
                ))}
              </Grid>
              <Grid item xs={12}>
                <Accordion defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMoreRounded />}>
                    <Typography variant="h6">Подсказки</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid gap="10px" container>
                      {hints.map((hint, index) => (
                        <Card variant="outlined" sx={{ width: "100%", p: 1 }}>
                          <Grid
                            gap="2px"
                            container
                            item
                            xs={12}
                            alignItems="center"
                            sx={{ flexWrap: { xs: "wrap", sm: "nowrap" } }}
                          >
                            <Grid item xs={1}>
                              <Typography variant="h6">{`#${
                                index + 1
                              }`}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={10}>
                              <TextField
                                fullWidth
                                multiline
                                onChange={(e) =>
                                  (hints[index] = e.target.value)
                                }
                                maxRows={2}
                                variant="outlined"
                              ></TextField>
                            </Grid>
                            <Grid item xs={1}>
                              <IconButton
                                onClick={() =>
                                  setHints(
                                    hints.filter(
                                      (el, elIndex) => elIndex !== index
                                    )
                                  )
                                }
                              >
                                <RemoveRounded />
                              </IconButton>
                            </Grid>
                          </Grid>
                        </Card>
                      ))}
                    </Grid>
                  </AccordionDetails>
                  <AccordionActions>
                    <IconButton
                      onClick={useCallback(() => {
                        setHints((oldHints) => [...oldHints, hints]);
                      }, [hints])}
                    >
                      <AddRounded />
                    </IconButton>
                  </AccordionActions>
                </Accordion>
              </Grid>
              <Grid item xs={12}>
                <Accordion defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMoreRounded />}>
                    <Typography variant="h6">Тестови кейсове</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid gap="10px" container>
                      {testCases.map((testCase, index) => (
                        <Card variant="outlined" sx={{ width: "100%", p: 1 }}>
                          <Grid
                            gap="2px"
                            container
                            item
                            xs={12}
                            alignItems="center"
                            sx={{ flexWrap: { xs: "wrap", sm: "nowrap" } }}
                          >
                            <Grid item xs={1}>
                              <Typography variant="h6">{`#${
                                index + 1
                              }`}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={5}>
                              <TextField
                                label="Входни данни"
                                required
                                fullWidth
                                multiline
                                onChange={(e) =>
                                  (testCases[index].input = e.target.value)
                                }
                                maxRows={2}
                                variant="outlined"
                              ></TextField>
                            </Grid>
                            <Grid item xs={12} sm={5}>
                              <TextField
                                label="Очакван изход"
                                required
                                fullWidth
                                multiline
                                onChange={(e) =>
                                  (testCases[index].output = e.target.value)
                                }
                                maxRows={2}
                                variant="outlined"
                              ></TextField>
                            </Grid>
                            <Grid item xs={1}>
                              <IconButton
                                disabled={testCases.length === 1 ? true : false}
                                onClick={() =>
                                  setTestCases(
                                    testCases.filter(
                                      (el, elIndex) => elIndex !== index
                                    )
                                  )
                                }
                              >
                                <RemoveRounded />
                              </IconButton>
                            </Grid>
                          </Grid>
                        </Card>
                      ))}
                    </Grid>
                  </AccordionDetails>
                  <AccordionActions>
                    <IconButton
                      onClick={useCallback(() => {
                        setTestCases((oldCases) => [
                          ...oldCases,
                          { input: "", output: "" },
                        ]);
                      }, [testCases])}
                    >
                      <AddRounded />
                    </IconButton>
                  </AccordionActions>
                </Accordion>
              </Grid>
            </Grid>
          </DialogContent>
          <Divider variant="middle" />
          <DialogActions sx={{ p: 3 }}>
            <Button variant="contained" endIcon={<SendRounded />} type="submit">
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  function FilterMenu() {
    return (
      <>
        <Grid container item spacing={0.5} sx={{ alignItems: "stretch" }}>
          {problemFilters.map((filter, index) => (
            <Grid item zeroMinWidth xs={4} sx={{ width: "100px" }}>
              <Chip
                sx={{ width: "100%" }}
                deleteIcon={<DoneRounded />}
                onDelete={activeFilters.includes(filter.label) ? true : false}
                onClick={() => addFilter(filter.label)}
                key={index}
                label={filter.label}
                color={filter.color}
              />
            </Grid>
          ))}
        </Grid>
      </>
    );
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          backdropFilter: "blur(20px)",
          display: "flex",
          borderBottom: 1,
          borderColor: "divider",
          position: "fixed",
          width: "100vw",
        }}
      >
        <Box sx={{ display: "flex", flexWrap: "nowrap", flexGrow: 1 }}>
          <TextField
            onChange={handleSearchChange}
            sx={{ ml: "10px" }}
            variant="standard"
            type="search"
            placeholder="Търсене на задачи"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRounded />
                </InputAdornment>
              ),
            }}
          />
          <Tooltip
            disableHoverListener
            arrow
            title={<FilterMenu />}
            open={filterMenuOpen}
          >
            <IconButton
              onClick={() => setFilterMenuOpen(!filterMenuOpen)}
              sx={{ mr: "10px" }}
            >
              <FilterAltRounded />
            </IconButton>
          </Tooltip>
        </Box>
        <Tooltip placement="left" arrow title="Създаване на нова задача">
          <IconButton
            onClick={() => setProblemCreationOpen(true)}
            onClose={() => setProblemCreationOpen(!problemCreationOpen)}
            sx={{ mr: "30px" }}
          >
            <AddRounded />
          </IconButton>
        </Tooltip>
      </Box>
      {localStorage.getItem("token") !== null ? (
        <Box sx={{ display: "flex", p: 1, pt: "50px" }}>
          <ProblemCreation />
          <ProblemGrid
            problems={JSON.parse(localStorage.getItem("problems"))}
          ></ProblemGrid>
        </Box>
      ) : (
        <Box sx={{ display: "flex", p: 1, pt: "50px" }}>
          Моля влезте в профила си
        </Box>
      )}
    </Box>
  );
};
export default Problems;
