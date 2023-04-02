

export interface IntractiveConfig {
    prompt?: string;
    key: string;
}

export interface ClueConfig {
    id: number;
    // URL or regex
    url: string;
    text?: string;
    html?: string;
    // URL or file path
    image?: string;
    alt?: string;
    interactive?: IntractiveConfig;
}

// TODO: OTHER OPTIONS, SUCH AS REQUIRE IN-ORDER, SHOW_PROGRESS
export interface HuntOptions {
    silent: boolean;
}

export interface HuntConfig {
    name: string;
    description: string;
    // Supported versions are currently: 1
    version: string;
    author: string;
    encrypted: boolean;
    background: string;
    options: HuntOptions;
    beginning: string;
    clues: ClueConfig[];
}