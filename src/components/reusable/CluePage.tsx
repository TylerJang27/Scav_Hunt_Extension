import { ThemeProvider } from "@emotion/react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  FormControl,
  Grid,
  styled,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import React, { useEffect, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { BackgroundWrapper } from "src/components/reusable/BackgroundWrapper";
import { PageHeaderAndSubtitle } from "src/components/reusable/PageHeaderAndSubtitle";
import { theme } from "src/components/reusable/theme";
import { getURL } from "src/providers/runtime";
import { ClueConfig } from "src/types/hunt_config";
import { Decrypt } from "src/utils/encrypt";
import { nonNull } from "src/utils/helpers";

import { Footer, OverlayFooter } from "./Footer";

const BorderLinearProgress = styled(LinearProgress)(() => ({
  height: 8,
  borderRadius: 4,
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 4,
  },
}));

export interface CluePageProps {
  huntName: string;
  encrypted: boolean;
  clue: ClueConfig;
  numClues?: number;
  error?: string;
  previewOnly?: boolean;
  backgroundURL: string;
  isBeginning?: boolean;
}

export interface ClueTextProps {
  text?: string;
  markdown?: string;
  error?: string;
}

const ClueText = (props: ClueTextProps) => {
  const { text, markdown, error } = props;
  if (markdown) {
    return <Markdown remarkPlugins={[remarkGfm]}>{markdown}</Markdown>;
  }
  return (
    <Typography
      variant="body1"
      textAlign="center"
      color="white"
      mt={1}
      sx={{ whiteSpace: "break-spaces" }}
    >
      {error ?? text}
    </Typography>
  );
};

export const CluePage = (props: CluePageProps) => {
  const {
    huntName,
    encrypted,
    clue: { id, text, markdown, image, alt, interactive },
    error,
    previewOnly,
    backgroundURL,
  } = props;
  const imageURL = image && !image.startsWith("http") ? getURL(image) : image;

  const clueSuffix = id > 0 ? `: ${id}` : "";
  const title = `${huntName}${clueSuffix}`;

  const [inputKey, setInputKey] = useState<string>("");
  const [solved, setSolved] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

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
    setSubmitted(true);
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
          {props.numClues !== undefined && (
            <Box sx={{ width: "100%" }}>
              <BorderLinearProgress
                variant="determinate"
                value={(id * 100.0) / props.numClues}
                color="secondary"
              />
            </Box>
          )}
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
                    <PageHeaderAndSubtitle
                      header={title}
                      headingComponent="h1"
                    />
                    {image && (
                      <Tooltip title={alt} followCursor>
                        <div>
                          <img
                            src={imageURL}
                            alt={alt}
                            loading="eager"
                            width="75%"
                            height="75%"
                            style={{
                              marginLeft: "auto",
                              marginRight: "auto",
                              display: "block",
                            }}
                          />
                        </div>
                      </Tooltip>
                    )}
                    {interactive && (
                      <FormControl sx={{ minWidth: "100%" }}>
                        {interactive.prompt && (
                          <Typography sx={{ whiteSpace: "break-spaces" }}>
                            {interactive.prompt}
                          </Typography>
                        )}
                        <TextField
                          variant="outlined"
                          value={inputKey}
                          onChange={(e) => setInputKey(e.target.value)}
                          error={
                            !nonNull(interactive) || (!solved && submitted)
                          }
                          data-testid="interactive-input-field"
                          label="Enter prompt answer"
                          aria-label="Enter prompt answer"
                          disabled={solved}
                          sx={{ mt: 2 }}
                        />
                        {/* TODO: ADD BETTER ERROR/RESPONSIVENESS SUPPORT (Show message on error) */}
                        <StyledButton
                          variant="outlined"
                          size="medium"
                          color="primary"
                          onClick={validateKey}
                          disabled={previewOnly || solved}
                          data-testid="interactive-submit-button"
                        >
                          Submit
                        </StyledButton>
                      </FormControl>
                    )}
                    {solved && (
                      <ClueText text={text} markdown={markdown} error={error} />
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

export const ClueOverlay = (props: CluePageProps) => {
  const {
    huntName,
    encrypted,
    clue: { id, text, markdown, image, alt, interactive },
    error,
    previewOnly,
    backgroundURL,
    isBeginning,
  } = props;
  const imageURL = image && !image.startsWith("http") ? getURL(image) : image;

  const clueSuffix = id > 0 ? `: ${id}` : "";
  const title = `${huntName}${clueSuffix}`;

  const [inputKey, setInputKey] = useState<string>("");
  const [solved, setSolved] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  // It will take a second to load, so assume not solved until we know for sure the value of interactive
  useEffect(() => {
    setSolved(!interactive);
  }, [interactive]);

  const validateKey = () => {
    setSubmitted(true);
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
      <BackgroundWrapper backgroundURL={backgroundURL}>
        <ThemeProvider theme={theme}>
          {props.numClues !== undefined && (
            <Box sx={{ width: "100%" }}>
              <BorderLinearProgress
                variant="determinate"
                value={(id * 100.0) / props.numClues}
                color="secondary"
              />
            </Box>
          )}
          <Container maxWidth="sm" sx={{ mt: 1, "&::after": { flex: "auto" } }}>
            <Grid
              container
              spacing={2}
              justifyContent="center"
              alignItems="center"
            >
              <Grid item xs={12}>
                <Card sx={{ mt: 0, mb: 4, backgroundColor: "#333" }}>
                  <CardContent>
                    <PageHeaderAndSubtitle
                      header={title}
                      headingComponent="h1"
                    />
                    {image && (
                      <Tooltip title={alt} followCursor>
                        <div>
                          <img
                            src={imageURL}
                            alt={alt}
                            loading="eager"
                            width="75%"
                            height="75%"
                            style={{
                              marginLeft: "auto",
                              marginRight: "auto",
                              display: "block",
                            }}
                          />
                        </div>
                      </Tooltip>
                    )}
                    {interactive && (
                      <FormControl sx={{ minWidth: "100%" }}>
                        {interactive.prompt && (
                          <Typography sx={{ whiteSpace: "break-spaces" }}>
                            {interactive.prompt}
                          </Typography>
                        )}
                        <TextField
                          variant="outlined"
                          value={inputKey}
                          onChange={(e) => setInputKey(e.target.value)}
                          error={
                            !nonNull(interactive) || (!solved && submitted)
                          }
                          data-testid="interactive-input-field"
                          label="Enter prompt answer"
                          aria-label="Enter prompt answer"
                          disabled={solved}
                          sx={{ mt: 2 }}
                        />
                        {/* TODO: ADD BETTER ERROR/RESPONSIVENESS SUPPORT (Show message on error) */}
                        <Button
                          variant="outlined"
                          size="medium"
                          color="primary"
                          onClick={validateKey}
                          disabled={previewOnly || solved}
                          data-testid="interactive-submit-button"
                        >
                          Submit
                        </Button>
                      </FormControl>
                    )}
                    {solved && (
                      <ClueText text={text} markdown={markdown} error={error} />
                    )}
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12}></Grid>
              {<OverlayFooter isBeginning={isBeginning || false} />}
            </Grid>
          </Container>
        </ThemeProvider>
      </BackgroundWrapper>
    </>
  );
};
