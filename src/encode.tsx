import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { HuntConfig } from "./types/hunt_config";
import { Container, Grid, createTheme } from "@mui/material";
import { yellow } from "@mui/material/colors";
import { ThemeProvider } from "@emotion/react";
import { DEFAULT_BACKGROUND } from "./utils/parse";

const Encode = () => {
  // TODO: TYLER FIGURE OUT THEMES
  const theme = createTheme({
    palette: {
      primary: {
        main: yellow[600],
      },
      secondary: {
        main: "#654eff",
      },
    },
  });

  // useEffect(()=>{
  // const sheet = document.styleSheets[2];
  //     sheet.insertRule(
  //       "body { ,height: 100%; background: url('" +
  //         DEFAULT_BACKGROUND +
  //         "') no-repeat center; background-size: cover; background-position: cover;}",
  //       0
  //     );
  // },[]);


  const [huntConfig, setHuntConfig] = useState<HuntConfig | any>({});


  return (
    <>
      <ThemeProvider theme={theme}>
        <Container maxWidth="lg" sx={{ mt: 3, "&::after": { flex: "auto" } }}>
          <Grid
            container
            spacing={2}
            justifyContent="center"
            alignItems="center"
            direction="row"
            >
              {/* Input pane */}
              <Grid item xs={12}>
                <Grid
                container
                spacing={2}
                justifyContent="center"
                alignItems="center"
                direction="column"
                >
                  <Grid item xs={12}>
                    Foo
                  </Grid>
                </Grid>
              </Grid>

              {/* Preview pane */}
              <Grid>
                <Grid
                container
                spacing={2}
                justifyContent="center"
                alignItems="center"
                direction="column"
                >
                  <Grid item xs={12}>
                    Foo
                  </Grid>
                </Grid>
              </Grid>
              
            </Grid>
        </Container>
      </ThemeProvider>
      {/* <head>
        <title>Hunt Generator</title>
        <link
          rel="canonical"
          href="https://getbootstrap.com/docs/4.5/examples/cover/"
        />
        <link
          rel="stylesheet"
          href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
          integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z"
          crossOrigin="anonymous"
        />
        <link href="assets/encoder.css" rel="stylesheet" />
      </head>
      <body className="text-center">
        <div className="container d-flex w-200 h-100 p-8 mx-auto flex-column">
          <main role="main" className="inner cover">
            <div className="card border-1 shadow my-">
              <h2 className="cover-heading" id="hunt-title">
                Hunt Generator Form
              </h2>
              <p></p>
              <form>
                <div className="container">
                  <div className="row">
                    <div className="col-md-8 center">
                      <h3>Hunt Info</h3>
                      <div className="form-group">
                        <label htmlFor="huntName">Scavenger Hunt Name</label>
                        <input
                          type="text"
                          className="form-control"
                          id="huntName"
                          placeholder="Enter Scavenger Hunt Name"
                        />
                        <br />
                        <label htmlFor="huntDescription">
                          Description (Optional)
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="huntDescription"
                          placeholder="Enter Scavenger Hunt Description"
                        />
                        <br />
                        <label htmlFor="huntAuthor">Author (Optional)</label>
                        <input
                          type="text"
                          className="form-control"
                          id="huntAuthor"
                          placeholder="Enter Your Name"
                        />
                        <br />
                        <label htmlFor="huntBackground">
                          Clue Background Image (Optional)
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="huntBackground"
                          placeholder="Enter an image URL"
                        />
                        <br />
                        <label htmlFor="huntBeginning">
                          Hunt Beginning Prompt (Optional)
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="huntBeginning"
                          placeholder="Enter a starting prompt"
                        />
                        <br />
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="encryptYes"
                            id="encryptYes"
                            value="yes"
                            checked
                          />
                          <label
                            className="form-check-label"
                            htmlFor="encryptYes"
                          >
                            Enable clue encryption
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="form-pad">
                  <div className="row">
                    <div className="col-12 center">
                      <div className="form-group">
                        <h3>Clues</h3>
                        <table className="table-dark" id="clues">
                          <thead>
                            <tr>
                              <th scope="col">ID</th>
                              <th scope="col">URL</th>
                              <th scope="col">Clue (Text)</th>
                              <th scope="col">Image (Optional)</th>
                              <th scope="col">Alt Text (Optional)</th>
                              <th scope="col">Interaction</th>
                              <th scope="col">Prompt (Optional)</th>
                              <th scope="col">Key</th>
                            </tr>
                          </thead>
                          <tr>
                            <td scope="col">0</td>
                            <td scope="col">
                              <input
                                type="text"
                                className="form-control"
                                id="clueURL0"
                              />
                            </td>
                            <td scope="col">
                              <input
                                type="text"
                                className="form-control"
                                id="clueText0"
                              />
                            </td>
                            <td scope="col">
                              <input
                                type="text"
                                className="form-control"
                                id="clueImage0"
                              />
                            </td>
                            <td scope="col">
                              <input
                                type="text"
                                className="form-control"
                                id="clueAlt0"
                              />
                            </td>
                            <td scope="col">
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="interaction0"
                                  id="interaction10"
                                  value="Always"
                                  checked
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="interaction10"
                                >
                                  Always
                                </label>
                              </div>
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="interaction0"
                                  id="interaction20"
                                  value="Submit"
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="interaction20"
                                >
                                  Submit
                                </label>
                              </div>
                            </td>
                            <td scope="col">
                              <input
                                type="text"
                                className="form-control"
                                id="cluePrompt0"
                                disabled
                              />
                            </td>
                            <td scope="col">
                              <input
                                type="text"
                                className="form-control"
                                id="clueKey0"
                                disabled
                              />
                            </td>
                          </tr>
                        </table>
                        <br />
                        <div className="form-group">
                          <input type="button" id="addClue" value="Add Clue" />
                          <input
                            type="button"
                            id="remClue"
                            value="Remove Clue"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <input type="button" id="submitit" value="Submit" />
                  <input type="button" id="resetit" value="Reset" />
                </div>
              </form>
              <div className="row">
                <div className="col-12 center">
                  <div className="error" id="status"></div>
                </div>
              </div>
            </div>
          </main>

          <footer className="mastfoot mt-auto">
            <div className="inner">
              <p>
                <a href="https://github.com/TylerJang27/Scav_Hunt_Extension">
                  Scavenger Hunt Extension
                </a>
                <br />
                Cover template for{" "}
                <a href="https://getbootstrap.com/">Bootstrap</a>, by{" "}
                <a href="https://twitter.com/mdo">@mdo</a>.
                <br />
                Photo by{" "}
                <a href="https://unsplash.com/photos/J_xAScfz3EE">Anand</a>.
              </p>
            </div>
          </footer>
        </div>
        <script src="encode.js"></script>
      </body> */}
    </>
  );
};

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <Encode />
  </React.StrictMode>
);
