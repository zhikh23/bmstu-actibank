import styles from './CopyableSlug.module.css';
import { MouseEvent, useState } from 'react';

export interface CopyableSlugProps {
  slug: string;
  className?: string;
  onCopy?: () => void;
}

export default function CopyableSlug({
  slug,
  className,
  onCopy,
}: CopyableSlugProps) {
  const [copied, setCopied] = useState<boolean>(false);

  const handleOnClick = async (e: MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(slug);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
    onCopy?.();
  };

  return (
    <div className={styles.slug + ' ' + className} onClick={handleOnClick}>
      <span>{slug}</span>
      <i className={copied ? 'pi pi-check' : 'pi pi-copy'}></i>
    </div>
  );
}
