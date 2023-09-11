import { ThemeProvider } from "@emotion/react";
import {
  Button,
  Card,
  CardContent,
  Container,
  FormControl,
  Grid,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { BackgroundWrapper } from "src/components/BackgroundWrapper";
import { PageHeaderAndSubtitle } from "src/components/PageHeaderAndSubtitle";
import { theme } from "src/components/theme";
import { getURL } from "src/providers/runtime";
import { ClueConfig } from "src/types/hunt_config";
import { Decrypt } from "src/utils/encrypt";
import { nonNull } from "src/utils/helpers";

import { Footer } from "./Footer";

export interface BeginningPageProps {
  title: React.ReactNode;
  message: React.ReactNode;
  backgroundURL: string;
}

export interface CluePageProps {
  huntName: string;
  encrypted: boolean;
  clue: ClueConfig;
  error?: string;
  previewOnly?: boolean;
  backgroundURL: string;
}

export const CluePage = (props: CluePageProps) => {
  const {
    huntName,
    encrypted,
    clue: { id, text, image, alt, interactive },
    error,
    previewOnly,
    backgroundURL,
  } = props;
  const imageURL = image && !image.startsWith("http") ? getURL(image) : image;

  const clueNumber = id > 0 ? `: ${id}` : "";
  const title = `${huntName}${clueNumber}`;

  const [inputKey, setInputKey] = useState<string>("");
  const [solved, setSolved] = useState<boolean>(false);

  const previewStyles = previewOnly
    ? { transform: "scale(0.5, 0.5)", WebkitTransformOriginY: "top" }
    : {};
  const previewScale = previewOnly ? "30" : undefined;
  const previewButtonStyles = previewOnly
    ? {
        "&.Mui-disabled": {
          color: "#fdd835",
        },
      }
    : {};
  const StyledButton = styled(Button)(previewButtonStyles);

  // It will take a second to load, so assume not solved until we know for sure the value of interactive
  useEffect(() => {
    setSolved(!interactive);
  }, [interactive]);

  const validateKey = () => {
    if (
      interactive &&
      Decrypt(interactive.key, encrypted, huntName) === inputKey
    ) {
      setSolved(true);
    }
  };

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.code === "Enter" || event.code === "NumpadEnter") {
        validateKey();
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, [interactive, inputKey]);

  return (
    <>
      <BackgroundWrapper backgroundURL={backgroundURL} scale={previewScale}>
        <ThemeProvider theme={theme}>
          <Container
            maxWidth="sm"
            sx={{ mt: 3, "&::after": { flex: "auto" }, ...previewStyles }}
          >
            <Grid
              container
              spacing={2}
              justifyContent="center"
              alignItems="center"
            >
              <Grid item xs={12}>
                <Card sx={{ mt: 4, backgroundColor: "#333" }}>
                  <CardContent>
                    <PageHeaderAndSubtitle header={title} />
                    {solved && (
                      <Typography
                        variant="body1"
                        textAlign="center"
                        color="white"
                        mt={1}
                      >
                        {/* TODO: TYLER DO LINE REPLACEMENT */}
                        {error ?? text}
                      </Typography>
                    )}
                    {image && (
                      <img
                        src={imageURL}
                        alt={alt}
                        loading="lazy"
                        width="75%"
                        height="75%"
                        style={{
                          marginLeft: "auto",
                          marginRight: "auto",
                          display: "block",
                        }}
                      />
                    )}
                    {interactive && (
                      // TODO: ADD STYLING
                      <FormControl sx={{ minWidth: "100%" }}>
                        {interactive.prompt && (
                          <Typography>{interactive.prompt}</Typography>
                        )}
                        <TextField
                          variant="outlined"
                          value={inputKey}
                          onChange={(e) => setInputKey(e.target.value.trim())}
                          error={!nonNull(interactive) || !solved}
                        />
                        {/* TODO: ADD BETTER ERROR/RESPONSIVENESS SUPPORT (Show message on error) */}
                        <StyledButton
                          variant="outlined"
                          size="medium"
                          color="primary"
                          onClick={validateKey}
                          disabled={previewOnly || solved}
                        >
                          Submit
                        </StyledButton>
                      </FormControl>
                    )}
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12}></Grid>
              {!previewOnly && <Footer />}
            </Grid>
          </Container>
        </ThemeProvider>
      </BackgroundWrapper>
    </>
  );
};

// TODO: TYLER REFACTOR TO MAKE THESE COMMON
export const BeginningPage = (props: BeginningPageProps) => (
  <>
    <BackgroundWrapper backgroundURL={props.backgroundURL}>
      <ThemeProvider theme={theme}>
        <Container maxWidth="sm" sx={{ mt: 3, "&::after": { flex: "auto" } }}>
          <Grid
            container
            spacing={2}
            justifyContent="center"
            alignItems="center"
          >
            <Grid item xs={12}>
              <Card sx={{ mt: 4, backgroundColor: "#333" }}>
                <CardContent>
                  <PageHeaderAndSubtitle header={props.title} />
                  <Typography
                    variant="body1"
                    textAlign="center"
                    color="white"
                    mt={1}
                  >
                    {/* TODO: TYLER DO LINE REPLACEMENT */}
                    {props.message}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Footer />
            </Grid>
          </Grid>
        </Container>
      </ThemeProvider>
    </BackgroundWrapper>
  </>
);
