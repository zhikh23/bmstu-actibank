import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import styles from './TextareaDialog.module.css';
import { useState } from 'react';

export interface TextareaDialog {
  placeholder: string;
  open: boolean;
  onHide: () => void;
  onSubmit: (reason: string) => Promise<void>;
}

export function TextareaDialog({
  placeholder,
  open,
  onHide,
  onSubmit,
}: TextareaDialog) {
  const [reason, setReason] = useState('');

  const handleHide = () => {
    setReason('');
    onHide();
  };

  const handleSubmit = async () => {
    const trimmed = reason.trim();
    if (!trimmed) return;
    await onSubmit(trimmed);
    setReason('');
  };

  return (
    <Dialog
      header="Причина отправки на доработку"
      visible={open}
      onHide={handleHide}
      footer={
        <div>
          <Button label="Отмена" text onClick={handleHide} />
          <Button
            label="Отправить"
            disabled={!reason.trim()}
            onClick={handleSubmit}
          />
        </div>
      }
    >
      <InputTextarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        rows={5}
        autoResize
        className={styles.reasonInput}
        placeholder={placeholder}
      />
    </Dialog>
  );
}
