import { cx } from '@slurp-ui/utils';
import type { ElementType } from 'react';

import { Avatar, type AvatarOwnProps } from '../Avatar/Avatar';
import { useAnimationRoot } from '../internal/animation';
import { useLabels } from '../internal/labels';
import { useCss, useThemeProps } from '../internal/styled';
import type { PolymorphicProps } from '../lib/polymorphic';

export interface AvatarGroupLabels {
  /** Names the "+N" counter: `more(3)` → "altre 3 persone". */
  more: (count: number) => string;
}

export const AVATAR_GROUP_LABELS: AvatarGroupLabels = {
  more: (n) => (n === 1 ? 'un’altra persona' : `altre ${n} persone`),
};

export interface AvatarGroupOwnProps {
  /** The people: a name each, a photo when there is one. */
  people: { name: string; src?: string }[];
  /** Most avatars shown before the "+N" counter. Default 4. */
  max?: number;
  size?: AvatarOwnProps['size'];
  /** Names the group (who they are: "Partecipanti"). */
  label?: string;
  labels?: Partial<AvatarGroupLabels>;
}

export type AvatarGroupProps<E extends ElementType = 'div'> = PolymorphicProps<
  E,
  AvatarGroupOwnProps
>;

/** Overlapping avatars of the people in a group, with a "+N" counter for the rest. */
export function AvatarGroup<E extends ElementType = 'div'>(props: AvatarGroupProps<E>) {
  const {
    as,
    css,
    className,
    people,
    max = 4,
    size = 'md',
    label,
    labels: labelsProp,
    ...rest
  } = useThemeProps('AvatarGroup', props as AvatarGroupProps);
  const labels = { ...AVATAR_GROUP_LABELS, ...useLabels('AvatarGroup'), ...labelsProp };
  const Root = (as ?? 'div') as ElementType;
  const styled = useCss('AvatarGroup', 'root', css);
  const root = useAnimationRoot(rest);
  const shown = people.slice(0, Math.max(1, max));
  const hidden = people.length - shown.length;
  return (
    <>
      {styled.style}
      <Root
        role="group"
        aria-label={label}
        className={cx('slurp-avatargroup', styled.className, className)}
        data-size={size}
        {...root}
      >
        {shown.map((p) => (
          <Avatar key={p.name} name={p.name} src={p.src} size={size} />
        ))}
        {hidden > 0 && (
          <span className="slurp-avatargroup-more" role="img" aria-label={labels.more(hidden)}>
            <span aria-hidden="true">+{hidden}</span>
          </span>
        )}
      </Root>
    </>
  );
}
