import { LAYER_ORDER } from './css';

/** Global baseline of <Ground />, in `@layer slurp.reset` (lowest priority: everything else overrides it). */
export const GROUND_CSS = `${LAYER_ORDER}@layer slurp.reset{\
*,*::before,*::after{box-sizing:border-box}\
html{-webkit-text-size-adjust:100%;text-size-adjust:100%}\
body{margin:0;min-height:100vh;background:color-mix(in oklab,var(--slurp-accent) 7%,var(--slurp-bg));color:var(--slurp-fg);font:var(--slurp-font-body);letter-spacing:var(--slurp-font-body-tracking);-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}\
img,video{max-width:100%;height:auto}\
button,input,select,textarea{font:inherit;color:inherit}\
:focus-visible{outline:2px solid var(--slurp-focus);outline-offset:2px}\
}`;
