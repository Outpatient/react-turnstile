import React from "react";
import { TurnstileObject, TurnstileOptions, SupportedLanguages } from "turnstile-types";
export default function Turnstile({ id, className, style, sitekey, action, cData, theme, language, tabIndex, responseField, responseFieldName, size, fixedSize, retry, retryInterval, refreshExpired, appearance, execution, userRef, onVerify, onLoad, onError, onExpire, onTimeout, }: TurnstileProps): JSX.Element;
export interface TurnstileProps extends TurnstileCallbacks {
    sitekey: string;
    action?: string;
    cData?: string;
    theme?: "light" | "dark" | "auto";
    language?: SupportedLanguages | "auto";
    tabIndex?: number;
    responseField?: boolean;
    responseFieldName?: string;
    size?: "normal" | "invisible" | "compact";
    fixedSize?: boolean;
    retry?: "auto" | "never";
    retryInterval?: number;
    refreshExpired?: "auto" | "manual" | "never";
    appearance?: "always" | "execute" | "interaction-only";
    execution?: "render" | "execute";
    id?: string;
    userRef?: React.MutableRefObject<HTMLDivElement>;
    className?: string;
    style?: React.CSSProperties;
}
export interface TurnstileCallbacks {
    onVerify: (token: string, boundTurnstile: BoundTurnstileObject) => void;
    onLoad?: (widgetId: string, boundTurnstile: BoundTurnstileObject) => void;
    onError?: (error?: Error | any, boundTurnstile?: BoundTurnstileObject) => void;
    onExpire?: (token: string, boundTurnstile: BoundTurnstileObject) => void;
    onTimeout?: (boundTurnstile: BoundTurnstileObject) => void;
}
export interface BoundTurnstileObject {
    execute: (options?: TurnstileOptions) => void;
    reset: () => void;
    getResponse: () => void;
}
export declare function useTurnstile(): TurnstileObject;