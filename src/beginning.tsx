import { ThemeProvider } from "@emotion/react";
import { Card, CardContent, Container, createTheme, Grid, Link, Typography } from "@mui/material";
import { yellow } from "@mui/material/colors";
import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { PageHeaderAndSubtitle } from "./components/PageHeaderAndSubtitle";

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

// const Beginning = () => {
//   return (
//     <>
//       <head>
//         <meta charSet="utf-8" />
//         <meta
//           name="viewport"
//           content="width=device-width, initial-scale=1, shrink-to-fit=no"
//         />
//         <meta name="description" content="" />
//         <meta
//           name="author"
//           content="Mark Otto, Jacob Thornton, and Bootstrap contributors, Tyler Jang"
//         />
//         <meta name="generator" content="Jekyll v4.1.1" />
//         <title>Scavenger Hunt</title>

//         <link
//           rel="canonical"
//           href="https://getbootstrap.com/docs/4.5/examples/cover/"
//         />

//         <link
//           rel="stylesheet"
//           href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
//           integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z"
//           crossOrigin="anonymous"
//         />
//         <link href="assets/hunt.css" rel="stylesheet" />
//         <link href="assets/beginner.css" rel="stylesheet" />
//       </head>
//       <body className="text-center">
//         <div className="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
//           <header className="masthead mb-auto">
//             <div className="inner">
//               <h3 className="masthead-brand justify-content-center">
//                 Scavenger Hunt
//               </h3>
//             </div>
//           </header>

//           <main role="main" className="inner cover">
//             <div className="card border-1 shadow my-5">
//               <h1 className="cover-heading" id="hunt-title">
//                 Venture Forth
//               </h1>
//               <p className="lead" id="hunt-clue"></p>
//               <script src="beginning.js" charSet="utf-8"></script>
//             </div>
//           </main>

//           <footer className="mastfoot mt-auto">
//             <div className="inner">
//               <p>
//                 <a href="https://github.com/TylerJang27/Scav_Hunt_Extension">
//                   Scavenger Hunt Extension
//                 </a>
//                 <br />
//                 Cover template for{" "}
//                 <a href="https://getbootstrap.com/">Bootstrap</a>, by{" "}
//                 <a href="https://twitter.com/mdo">@mdo</a>.
//               </p>
//             </div>
//           </footer>
//         </div>
//       </body>
//     </>
//   );
// };

const loadBeginningFromStorage = (callback: any) => {
  chrome.storage.local.get("huntConfig", function (items) {
      callback(items);
    }
  )
};

const Beginning = () => {
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

  const [huntName, setHuntName] = useState<string>("Scavenger Hunt");
  const [beginningText, setBeginningText] = useState<string>("Empty beginning text. Please reset the hunt.");

  loadBeginningFromStorage((items: any) => {
    if (items.huntConfig) {
      const huntConfig = items.huntConfig;
      // Set background image
      const sheet = document.styleSheets[2];
      sheet.insertRule(
        "body { ,height: 100%; background: url('" +
          huntConfig.background +
          "') no-repeat center; background-size: cover; background-position: cover;}",
        0
      );
      // Set beginning text
      setBeginningText(huntConfig.beginning);
      setHuntName(huntConfig.name);
    } else {
      console.log(items);
      console.warn("No hunt information found. Please reset the hunt.");
    }
  });

  // TODO: TYLER MAKE THESE INTO REUSABLE COMPONENTS
  return (
    <>
    <ThemeProvider theme={theme}>
      <Container maxWidth="sm" sx={{ mt: 3 }}>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12}>
            <PageHeaderAndSubtitle header={huntName} />
          </Grid>
          <Grid item xs={12}>
            <Card sx={{backgroundColor: "black"}}>
              <CardContent>
                <Typography variant="body1">
                  {/* TODO: TYLER DO LINE REPLACEMENT */}
                  {beginningText}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            {/* TODO: TYLER USE REUSABLE FOOTER */}
            <footer>
              <Typography variant="body1">
                <Link href="https://github.com/TylerJang27/Scav_Hunt_Extension">Scavenger Hunt Extension</Link>
              </Typography>
            </footer>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
    </>);
};

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <Beginning />
  </React.StrictMode>
);
