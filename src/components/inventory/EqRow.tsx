import type { PropsWithChildren } from "react";

export const EqRow = ({
  children,
}: PropsWithChildren) => {
  return (
    <div style={{ display: "flex", flexDirection: "row" }}>{children}</div>
  );
};
