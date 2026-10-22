import { GROUND_CSS } from '../lib/ground';
import { styleId } from '../lib/theme';

/**
 * Page baseline (opt-in, like a CSS reset): border-box, no body margin, Poppins body text, the `bg` ground tinted 7%
 * by the accent, visible 2px focus ring. Renders a single hoisted <style>, no element.
 */
export function Ground() {
  return (
    <style href={styleId('ground', GROUND_CSS)} precedence="slurp">
      {GROUND_CSS}
    </style>
  );
}
