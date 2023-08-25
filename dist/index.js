"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTurnstile = void 0;
const react_1 = __importStar(require("react"));
const globalNamespace = (typeof globalThis !== "undefined" ? globalThis : window);
let turnstileState = typeof globalNamespace.turnstile !== "undefined" ? "ready" : "unloaded";
let ensureTurnstile;
// Functions responsible for loading the turnstile api, while also making sure
// to only load it once
let turnstileLoad;
const turnstileLoadPromise = new Promise((resolve, reject) => {
    turnstileLoad = { resolve, reject };
    if (turnstileState === "ready")
        resolve(undefined);
});
{
    const TURNSTILE_LOAD_FUNCTION = "cf__reactTurnstileOnLoad";
    const TURNSTILE_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    ensureTurnstile = () => {
        if (turnstileState === "unloaded") {
            turnstileState = "loading";
            globalNamespace[TURNSTILE_LOAD_FUNCTION] = () => {
                turnstileLoad.resolve();
                turnstileState = "ready";
                delete globalNamespace[TURNSTILE_LOAD_FUNCTION];
            };
            const url = `${TURNSTILE_SRC}?onload=${TURNSTILE_LOAD_FUNCTION}&render=explicit`;
            const script = document.createElement("script");
            script.src = url;
            script.async = true;
            script.addEventListener("error", () => {
                turnstileLoad.reject("Failed to load Turnstile.");
                delete globalNamespace[TURNSTILE_LOAD_FUNCTION];
            });
            document.head.appendChild(script);
        }
        return turnstileLoadPromise;
    };
}
function Turnstile({ id, className, style, sitekey, action, cData, theme, language, tabIndex, responseField, responseFieldName, size, fixedSize, retry, retryInterval, refreshExpired, appearance, execution, userRef, onVerify, onLoad, onError, onExpire, onTimeout, }) {
    const ownRef = (0, react_1.useRef)(null);
    const inplaceState = (0, react_1.useState)({ onVerify, onLoad, onError, onExpire, onTimeout })[0];
    const ref = userRef !== null && userRef !== void 0 ? userRef : ownRef;
    (0, react_1.useEffect)(() => {
        if (!ref.current)
            return;
        let cancelled = false;
        let widgetId = "", timeoutId = 0;
        (async () => {
            var _a, _b;
            // load turnstile
            if (turnstileState !== "ready") {
                try {
                    await ensureTurnstile();
                }
                catch (e) {
                    (_a = inplaceState.onError) === null || _a === void 0 ? void 0 : _a.call(inplaceState, e);
                    return;
                }
            }
            if (cancelled || !ref.current)
                return;
            let boundTurnstileObject;
            const turnstileOptions = {
                sitekey,
                action,
                cData,
                theme,
                language,
                tabindex: tabIndex,
                "response-field": responseField,
                "response-field-name": responseFieldName,
                size,
                retry: "never",
                "retry-interval": retryInterval,
                "refresh-expired": refreshExpired,
                appearance,
                execution,
                callback: (token) => inplaceState.onVerify(token, boundTurnstileObject),
                "error-callback": (error) => {
                    var _a;
                    // we handle retry ourselves because turnstile does not properly
                    // reset its timeout when calling turnstile.remove, logging the
                    // following in the console:
                    // > [Cloudflare Turnstile] Nothing to reset found for provided container.
                    // refs:
                    // - https://github.com/Le0Developer/react-turnstile/issues/14
                    // - https://discord.com/channels/595317990191398933/1025131875397812224/1122137855368646717
                    // TODO: remove when fixed
                    if (!retry || retry === "auto") {
                        timeoutId = setTimeout(() => {
                            boundTurnstileObject.reset();
                            timeoutId = 0;
                            // no need to do bounds checks, turnstile already does them for us
                            // even though we have retry=never
                        }, 2000 + (retryInterval !== null && retryInterval !== void 0 ? retryInterval : 8000));
                    }
                    (_a = inplaceState.onError) === null || _a === void 0 ? void 0 : _a.call(inplaceState, error, boundTurnstileObject);
                },
                "expired-callback": (token) => { var _a; return (_a = inplaceState.onExpire) === null || _a === void 0 ? void 0 : _a.call(inplaceState, token, boundTurnstileObject); },
                "timeout-callback": () => { var _a; return (_a = inplaceState.onTimeout) === null || _a === void 0 ? void 0 : _a.call(inplaceState, boundTurnstileObject); },
            };
            widgetId = window.turnstile.render(ref.current, turnstileOptions);
            boundTurnstileObject = createBoundTurnstileObject(widgetId);
            (_b = inplaceState.onLoad) === null || _b === void 0 ? void 0 : _b.call(inplaceState, widgetId, boundTurnstileObject);
        })();
        return () => {
            cancelled = true;
            if (widgetId)
                window.turnstile.remove(widgetId);
            if (timeoutId)
                clearTimeout(timeoutId);
        };
    }, [
        sitekey,
        action,
        cData,
        theme,
        language,
        tabIndex,
        responseField,
        responseFieldName,
        size,
        retry,
        retryInterval,
        refreshExpired,
        appearance,
        execution,
    ]);
    (0, react_1.useEffect)(() => {
        inplaceState.onVerify = onVerify;
        inplaceState.onLoad = onLoad;
        inplaceState.onError = onError;
        inplaceState.onExpire = onExpire;
        inplaceState.onTimeout = onTimeout;
    }, [onVerify, onLoad, onError, onExpire, onTimeout]);
    return (react_1.default.createElement("div", { ref: ref, id: id, className: className, style: fixedSize
            ? {
                ...(style !== null && style !== void 0 ? style : {}),
                width: size === "compact" ? "130px" : "300px",
                height: size === "compact" ? "120px" : "65px",
            }
            : style }));
}
exports.default = Turnstile;
function createBoundTurnstileObject(widgetId) {
    return {
        execute: (options) => window.turnstile.execute(widgetId, options),
        reset: () => window.turnstile.reset(widgetId),
        getResponse: () => window.turnstile.getResponse(widgetId),
    };
}
function useTurnstile() {
    // we are using state here to trigger a component re-render once turnstile
    // loads, so the component using this hook gets the object once its loaded
    const [_, setState] = (0, react_1.useState)(turnstileState);
    (0, react_1.useEffect)(() => {
        if (turnstileState === "ready")
            return;
        turnstileLoadPromise.then(() => setState(turnstileState));
    }, []);
    return globalNamespace.turnstile;
}
exports.useTurnstile = useTurnstile;
//# sourceMappingURL=index.js.map