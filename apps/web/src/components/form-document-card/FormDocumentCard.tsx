import { Button } from 'primereact/button';
import styles from './FormDocumentCard.module.css';
import { FileUpload } from 'primereact/fileupload';

export interface FormDocumentCardProps {
  generatedFileId: string | null;
  scanFileId: string | null;
  canUpload: boolean;
  loading?: boolean;
  uploadKey: number;

  onGeneratePrintedForm: () => void;
  onDownloadFile: (fileId: string) => void;
  onUploadScan: (file: File) => void;
}

export function FormDocumentCard({
  generatedFileId,
  scanFileId,
  canUpload,
  loading,
  uploadKey,
  onGeneratePrintedForm,
  onDownloadFile,
  onUploadScan,
}: FormDocumentCardProps) {
  const hasScan = Boolean(scanFileId);

  return (
    <section className={styles.documentCard}>
      <div>
        <div className={styles.documentTitle}>
          <h2>Документы</h2>
          <p>
            {hasScan
              ? 'Скан подписанного документа прикреплён.'
              : 'Скачайте печатную форму, подпишите и прикрепите её скан.'}
          </p>
          {generatedFileId ? (
            <Button
              label="Скачать печатную форму"
              icon="pi pi-download"
              outlined
              onClick={() => onDownloadFile(generatedFileId)}
            />
          ) : (
            <Button
              label="Создать печатную форму"
              icon="pi pi-file-edit"
              outlined
              loading={loading}
              onClick={onGeneratePrintedForm}
            />
          )}

          <Button
            type="button"
            outlined
            disabled={!hasScan || loading}
            icon="pi pi-file"
            label="Скачать загруженный скан"
            onClick={() => scanFileId && onDownloadFile(scanFileId)}
          />
        </div>
      </div>

      <div className={styles.documentActions}>
        {canUpload && (
          <FileUpload
            key={uploadKey}
            name="file"
            mode="advanced"
            accept="application/pdf,image/*"
            maxFileSize={20 * 1024 * 1024}
            multiple={false}
            customUpload
            disabled={loading || !generatedFileId}
            chooseLabel="Выбрать"
            uploadLabel="Загрузить"
            cancelLabel="Очистить"
            className={styles.scanUploader}
            emptyTemplate={
              generatedFileId ? (
                <span>Перетащите PDF или изображение или выберите файл</span>
              ) : (
                <span>Сначала распечатайте печатную форму</span>
              )
            }
            uploadHandler={(event) => {
              const file = event.files[0];
              if (file) onUploadScan(file);
            }}
          />
        )}
      </div>
    </section>
  );
}
