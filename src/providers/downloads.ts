import { getProvider } from "src/providers/chrome";

export const download = ({
  url,
  filename,
}: {
  url: string;
  filename: string;
}) => getProvider().downloads.download({ url, filename });
