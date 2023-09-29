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
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { BackgroundWrapper } from "src/components/reusable/BackgroundWrapper";
import { PageHeaderAndSubtitle } from "src/components/reusable/PageHeaderAndSubtitle";
import { theme } from "src/components/reusable/theme";
import { getURL } from "src/providers/runtime";
import { ClueConfig } from "src/types/hunt_config";
import { Decrypt } from "src/utils/encrypt";
import { nonNull } from "src/utils/helpers";

import { Footer } from "./Footer";

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
                    {solved && (
                      <Typography
                        variant="body1"
                        textAlign="center"
                        color="white"
                        mt={1}
                        sx={{ whiteSpace: "break-spaces" }}
                      >
                        {/* TODO: TYLER DO LINE REPLACEMENT */}
                        {error ?? text}
                      </Typography>
                    )}
                    {image && (
                      <Tooltip title={alt} followCursor>
                        <div>
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
                        </div>
                      </Tooltip>
                    )}
                    {interactive && (
                      // TODO: ADD STYLING
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
