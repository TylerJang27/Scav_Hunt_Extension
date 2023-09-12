import React, { PropsWithChildren } from "react";

export interface BackgroundProps {
  backgroundURL: string;
  scale?: string;
}
// TODO: TYLER MAKE SURE BACKGROUNDURL IS ALWAYS SANITIZED

export const BackgroundWrapper = (
  props: PropsWithChildren<BackgroundProps>,
) => (
  <div
    style={{
      width: "100%",
      minWidth: `${props.scale ?? "100"}vw`,
      height: "100%",
      minHeight: `${props.scale ?? "100"}vh`,
      maxHeight: props.scale ? `${props.scale}vh` : undefined,
      float: "left",
      margin: "0px",
      backgroundImage: `url("${props.backgroundURL}")`,
      backgroundSize: "cover",
      backgroundRepeat: "repeat-y",
      backgroundPosition: "center center",
    }}
  >
    {props.children}
  </div>
);
