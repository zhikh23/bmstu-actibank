import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useParams } from 'react-router-dom';
import { Message } from 'primereact/message';

import { stores } from '@/stores';
import styles from './FormSummaryPage.module.css';
import { FormActions } from '@/components/form-actions/FormActions';
import { FormDocumentCard } from '@/components/form-document-card/FormDocumentCard';
import { resolveMediaUrl } from '@/api/http';
import { FormDetails } from '@/components/form-details/FormDetails';

export const FormSummaryPage = observer(function FormSummaryPage() {
  const { id } = useParams();
  const { forms, auth } = stores;

  const [uploadKey, setUploadKey] = useState<number>(0);

  useEffect(() => {
    void auth.load();
  }, [auth]);
  useEffect(() => {
    if (id) void forms.loadSelected(id, true);
  }, [forms, id]);

  const form = forms.selected;
  const isApplicant = auth.me?.roles.includes('applicant') ?? false;

  if (forms.loadingSelected)
    return <p className={styles.state}>Загрузка заявки...</p>;
  if (forms.selectedError)
    return <p className={styles.state}>{forms.selectedError}</p>;
  if (!form || !auth.me) return <p className={styles.state}>Загрузка...</p>;

  const reload = async () => {
    if (id) await forms.loadSelected(id, true);
  };

  const handleGenerate = async () => {
    const fileId = await forms.generateDocument(form.id);
    if (fileId) await reload();
  };

  const handleDownload = (fileId: string) => {
    window.location.assign(resolveMediaUrl(`/api/v1/files/${fileId}`));
  };

  const handleUpload = async (file: File) => {
    if (await forms.uploadScan(form.id, file)) {
      setUploadKey((k) => k + 1);
    }
  };

  return (
    <section className={styles.page}>
      <header className={styles.heading}>
        <div className={styles.title}>
          <span className={styles.slug}>{form.slug}</span>
          <h1>{form.name}</h1>
        </div>
        <FormActions
          selected={form}
          me={auth.me}
          reload={reload}
          actions={forms}
        />
      </header>

      {forms.actionError && (
        <Message
          severity="error"
          text={forms.actionError}
          className={styles.error}
        />
      )}

      <FormDocumentCard
        generatedFileId={form.document?.generatedId ?? null}
        scanFileId={form.document?.scanId ?? null}
        canUpload={isApplicant && form.status === 'draft'}
        loading={forms.actionLoading}
        uploadKey={uploadKey}
        onGeneratePrintedForm={handleGenerate}
        onDownloadFile={handleDownload}
        onUploadScan={handleUpload}
      />

      <FormDetails form={form} />
    </section>
  );
});
