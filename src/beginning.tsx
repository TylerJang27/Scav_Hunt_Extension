import { ThemeProvider } from "@emotion/react";
import { Alert, Button, Container, createTheme, FormControl, FormControlLabel, FormLabel, Grid, Link, Radio, RadioGroup, TextField, Typography } from "@mui/material";
import { yellow } from "@mui/material/colors";
import React, { ChangeEvent, useState } from "react";
import { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { ExitableModal } from "./components/ExitableModal";
import { PageHeaderAndSubtitle } from "./components/PageHeaderAndSubtitle";
import { HuntConfig } from "./types/hunt_config";
import { HuntSource, Progress } from "./types/progress";
import path from "path";

// TODO: TYLER STRONGLY TYPE
function populateDiv(div: any, clueobj: any) {
  if (clueobj == undefined || clueobj.beginning == undefined) {
    div.textContent =
      "An unexpected error has occurred. Please contact the hunt manager.";
  } else {
    const p = document.createElement("p");
    p.setAttribute("class", "lead");

    var clue_content = clueobj.beginning;
    var clue_lines = [];
    console.log(clue_content);
    if (clue_content.includes("\n")) {
      console.log("splitting");
      clue_lines = clue_content.split("\n");
    } else {
      console.log("not splitting");
      clue_lines = [clue_content];
    }
    console.log(clue_lines);

    var lastp = p;
    for (var i = 0; i < clue_lines.length; i++) {
      var p2 = document.createElement("p");
      p2.setAttribute("class", "lead");
      p2.textContent = clue_lines[i];
      lastp.appendChild(p2);
      lastp = p2;
    }
    div.appendChild(p);
  }
}

document.addEventListener(
  "DOMContentLoaded",
  function () {
    chrome.storage.local.get(
      {
        clueobject: {},
      },
      function (items) {
        const div = document.createElement("div");
        populateDiv(div, items.clueobject);
        document.getElementById("hunt-clue")?.appendChild(div);

        var hunt_data = items.clueobject; //TODO: ADD TITLE AND SUCH
        var img = hunt_data.background;
        if (img == undefined) {
          img =
            "https://images.unsplash.com/photo-1583425921686-c5daf5f49e4a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=889&q=80";
        }
        var sheet = document.styleSheets[2];
        sheet.insertRule(
          "body { ,height: 100%; background: url('" +
            img +
            "') no-repeat center; background-size: cover; background-position: cover;}",
          0
        );

        var title = hunt_data.name;
        if (title == undefined) {
          title = "Scavenger Hunt";
        }
        document.getElementById("hunt-title")!.textContent = title;
      }
    );
  },
  false
);

const Beginning = () => {
  return (
    <>
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <meta name="description" content="" />
        <meta
          name="author"
          content="Mark Otto, Jacob Thornton, and Bootstrap contributors, Tyler Jang"
        />
        <meta name="generator" content="Jekyll v4.1.1" />
        <title>Scavenger Hunt</title>

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
        <link href="assets/hunt.css" rel="stylesheet" />
        <link href="assets/beginner.css" rel="stylesheet" />
      </head>
      <body className="text-center">
        <div className="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
          <header className="masthead mb-auto">
            <div className="inner">
              <h3 className="masthead-brand justify-content-center">
                Scavenger Hunt
              </h3>
            </div>
          </header>

          <main role="main" className="inner cover">
            <div className="card border-1 shadow my-5">
              <h1 className="cover-heading" id="hunt-title">
                Venture Forth
              </h1>
              <p className="lead" id="hunt-clue"></p>
              <script src="beginning.js" charSet="utf-8"></script>
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
              </p>
            </div>
          </footer>
        </div>
      </body>
    </>
  );
};

const loadBeginningFromStorage = (callback: any) => {
  chrome.storage.local.get(
    {
      huntConfig: undefined
    }, function (items) {
      callback(items);
    }
  )
};

// const Beginning = () => {
//   // TODO: TYLER FIGURE OUT THEMES
//   const theme = createTheme({
//     palette: {
//       primary: {
//         main: yellow[600],
//       },
//       secondary: {
//         main: "#654eff",
//       },
//     },
//   });

//   const [beginningText, setBeginningText] = useState<string>("Empty beginning text. Please reset the hunt.");

//   loadBeginningFromStorage((items: any) => {
//     if (items.huntConfig) {
//       // Set background image
//       const sheet = document.styleSheets[2];
//       sheet.insertRule(
//         "body { ,height: 100%; background: url('" +
//           items.huntConfig.background +
//           "') no-repeat center; background-size: cover; background-position: cover;}",
//         0
//       );
//       // Set beginning text
//       setBeginningText(items.huntConfig.beginning);
//     } else {
//       console.warn("No hunt informatino found. Please reset the hunt.");
//     }
//   });

//   return (
//     <>
//     <ThemeProvider theme={theme}>
//       <Container maxWidth="sm" sx={{ mt: 3 }}>
//         <Grid container spacing={2}>


//           </Grid>
//           </Container>
//           </ThemeProvider>
//           </>);
// };

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <Beginning />
  </React.StrictMode>
);
