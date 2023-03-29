import { Typography, useTheme } from "@mui/material";
import React from "react";

export interface PageHeaderAndSubtitleProps {
  headerPrefix?: React.ReactNode;
  header: React.ReactNode;
  subtitle?: React.ReactNode;
}

export const PageHeaderAndSubtitle: React.FC<PageHeaderAndSubtitleProps> = (
  props: PageHeaderAndSubtitleProps
) => {
  const theme = useTheme();

  return (
    <>
      <Typography
        variant="h4"
        fontWeight={theme.typography.fontWeightBold}
        textAlign="center"
      >
        {props.headerPrefix}
        {props.headerPrefix && ": "}
        {props.header}
      </Typography>

      {props.subtitle && (
        <Typography variant="h6" textAlign="center">
          {props.subtitle}
        </Typography>
      )}
    </>
  );
};