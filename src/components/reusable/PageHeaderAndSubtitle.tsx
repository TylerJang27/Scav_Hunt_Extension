import { Typography, useTheme } from "@mui/material";
import React, { ElementType } from "react";

export interface PageHeaderAndSubtitleProps {
  headerPrefix?: React.ReactNode;
  header: React.ReactNode;
  subtitle?: React.ReactNode;
  headingComponent?: ElementType<any>;
}

export const PageHeaderAndSubtitle: React.FC<PageHeaderAndSubtitleProps> = (
  props: PageHeaderAndSubtitleProps,
) => {
  const theme = useTheme();
  return (
    <>
      <Typography
        variant="h3"
        fontWeight={theme.typography.fontWeightBold}
        textAlign="center"
        color="white"
        fontFamily="Dosis"
        component={props.headingComponent ?? "h3"}
      >
        {props.headerPrefix}
        {props.headerPrefix && ": "}
        {props.header}
      </Typography>

      {props.subtitle && (
        <Typography variant="h6" textAlign="center" color="white">
          {props.subtitle}
        </Typography>
      )}
    </>
  );
};
