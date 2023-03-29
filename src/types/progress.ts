import { HuntConfig } from "src/types/hunt_config";

export type HuntSource = "Sample" | "Upload" | "URL";

export interface Progress {
    sourceChoice: HuntSource;
    huntConfig: HuntConfig;
    maxProgress: number;
    // TODO: TYLER DOES THIS NEED A SOURCEUPDATES?
}