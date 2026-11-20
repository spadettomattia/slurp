import { CloseIcon, UploadIcon } from '@slurp-ui/icons';
import { cx } from '@slurp-ui/utils';
import {
  useId,
  useState,
  type ChangeEvent,
  type DragEvent,
  type ElementType,
  type ReactNode,
} from 'react';

import { Bubble } from '../Bubble/Bubble';
import { useAnimationRoot } from '../internal/animation';
import { useLabels } from '../internal/labels';
import { useCss, useThemeProps } from '../internal/styled';
import type { PolymorphicProps } from '../lib/polymorphic';
import { Progress } from '../Progress/Progress';
import { useControlled } from '../utils/useControlled';

export interface FileDropLabels {
  /** The button that opens the file picker. */
  browse: string;
  /** Beside it: you can drop files too. */
  drop: string;
  /** Name of each remove button. */
  remove: (name: string) => string;
}

export const FILEDROP_LABELS: FileDropLabels = {
  browse: 'Scegli i file',
  drop: 'oppure trascinali qui',
  remove: (name) => `Rimuovi ${name}`,
};

export interface FileDropOwnProps {
  label: ReactNode;
  hint?: ReactNode;
  value?: File[];
  defaultValue?: File[];
  onValueChange?: (files: File[]) => void;
  /** `accept` of the input ("image/*,.pdf"). */
  accept?: string;
  /** Default true. */
  multiple?: boolean;
  disabled?: boolean;
  /** Upload progress by file name, 0–100: a bar under each file. */
  progress?: Record<string, number>;
  labels?: Partial<FileDropLabels>;
}

export type FileDropProps<E extends ElementType = 'div'> = PolymorphicProps<E, FileDropOwnProps>;

const size = (bytes: number) =>
  bytes < 1024
    ? `${bytes} B`
    : bytes < 1024 ** 2
      ? `${Math.round(bytes / 1024)} KB`
      : `${(bytes / 1024 ** 2).toFixed(1)} MB`;

/**
 * Files to upload: a drop area with a real file input (so the keyboard and the system picker work), then the list of
 * chosen files with their size, a remove button and, while uploading, their progress.
 */
export function FileDrop<E extends ElementType = 'div'>(props: FileDropProps<E>) {
  const {
    as,
    css,
    className,
    label,
    hint,
    value: valueProp,
    defaultValue = [],
    onValueChange,
    accept,
    multiple = true,
    disabled = false,
    progress,
    labels: labelsProp,
    ...rest
  } = useThemeProps('FileDrop', props as FileDropProps);
  const labels = { ...FILEDROP_LABELS, ...useLabels('FileDrop'), ...labelsProp };
  const [files, setFiles] = useControlled({
    value: valueProp,
    defaultValue,
    onChange: onValueChange,
  });
  const [over, setOver] = useState(false);
  const id = useId();
  const Root = (as ?? 'div') as ElementType;
  const styled = useCss('FileDrop', 'root', css);
  const root = useAnimationRoot(rest);
  const add = (list: FileList | null) => {
    if (!list?.length) return;
    const picked = [...list];
    setFiles(multiple ? [...files, ...picked] : picked.slice(0, 1));
  };
  const drop = (e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    setOver(false);
    if (!disabled) add(e.dataTransfer.files);
  };
  return (
    <>
      {styled.style}
      <Root
        className={cx('slurp-file-drop', styled.className, className)}
        data-disabled={disabled || undefined}
        {...root}
      >
        <span className="slurp-field-label" id={`${id}-label`}>
          {label}
        </span>
        <div
          className="slurp-file-drop-area"
          data-over={over || undefined}
          onDragOver={(e) => {
            e.preventDefault();
            if (!disabled) setOver(true);
          }}
          onDragLeave={() => setOver(false)}
          onDrop={drop}
        >
          <UploadIcon size={24} aria-hidden />
          <label className="slurp-file-drop-browse" htmlFor={`${id}-input`}>
            {labels.browse}
          </label>
          <span className="slurp-file-drop-hint">{labels.drop}</span>
          <input
            id={`${id}-input`}
            className="slurp-visually-hidden"
            type="file"
            accept={accept}
            multiple={multiple}
            disabled={disabled}
            aria-labelledby={`${id}-label ${id}-input-label`}
            aria-describedby={hint != null ? `${id}-hint` : undefined}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              add(e.target.files);
              e.target.value = '';
            }}
          />
          <span id={`${id}-input-label`} hidden>
            {labels.browse}
          </span>
        </div>
        {hint != null && (
          <p className="slurp-field-hint" id={`${id}-hint`}>
            {hint}
          </p>
        )}
        {files.length > 0 && (
          <ul className="slurp-file-drop-list" aria-labelledby={`${id}-label`}>
            {files.map((file, i) => (
              <li key={`${file.name}-${i}`} className="slurp-file-drop-file">
                <span className="slurp-file-drop-name">{file.name}</span>
                <span className="slurp-file-drop-size">{size(file.size)}</span>
                <Bubble
                  appearance="plain"
                  tone="neutral"
                  size="sm"
                  label={labels.remove(file.name)}
                  disabled={disabled}
                  onClick={() => setFiles(files.filter((_, j) => j !== i))}
                >
                  <CloseIcon size={18} />
                </Bubble>
                {progress?.[file.name] !== undefined && (
                  <Progress
                    className="slurp-file-drop-progress"
                    value={progress[file.name]}
                    label={file.name}
                  />
                )}
              </li>
            ))}
          </ul>
        )}
      </Root>
    </>
  );
}
