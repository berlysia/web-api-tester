import styles from './InteractiveWidgetSelector.module.css';

const baseUrl = import.meta.env.BASE_URL;

type InteractiveWidgetValue = 'default' | 'resizes-visual' | 'resizes-content' | 'overlays-content';

interface Props {
  basePath: string;
  currentValue: InteractiveWidgetValue;
}

const variants: { value: InteractiveWidgetValue; label: string; file: string }[] = [
  { value: 'default', label: 'Default', file: '' },
  { value: 'resizes-visual', label: 'resizes-visual', file: 'resizes-visual.html' },
  { value: 'resizes-content', label: 'resizes-content', file: 'resizes-content.html' },
  { value: 'overlays-content', label: 'overlays-content', file: 'overlays-content.html' },
];

export function InteractiveWidgetSelector({ basePath, currentValue }: Props) {
  return (
    <div className={styles.container}>
      <span className={styles.label}>interactive-widget:</span>
      <div className={styles.variants}>
        {variants.map((variant) => (
          <a
            key={variant.value}
            href={`${baseUrl}${basePath}/${variant.file}`}
            className={`${styles.variant} ${currentValue === variant.value ? styles.active : ''}`}
          >
            {variant.label}
          </a>
        ))}
      </div>
    </div>
  );
}
