import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import styles from './FormActions.module.css';
import { Button } from 'primereact/button';
import { FormDetail } from '@/types/form-detail';
import { Me } from '@/types/user';
import { useState } from 'react';
import { TextareaDialog } from '@/components/textarea-dialog/TextareaDialog';

export interface FormsActions {
  markReady(id: string): Promise<boolean>;
  convertToDraft(id: string): Promise<boolean>;
  cancel(id: string): Promise<boolean>;
  convertToDraftModerator(id: string, reason: string): Promise<boolean>;
  startReview(id: string): Promise<boolean>;
  cancelReview(id: string): Promise<boolean>;
  approve(id: string): Promise<boolean>;
  reject(id: string, reason: string): Promise<boolean>;
}

export interface FormActionsProps {
  selected: FormDetail;
  me: Me;
  reload: () => Promise<void>;
  actions: FormsActions;
}

export const FormActions = observer(function FormActions({
  selected,
  me,
  reload,
  actions,
}: FormActionsProps) {
  const navigate = useNavigate();

  const [revisionOpen, setRevisionOpen] = useState(false);

  const formId = selected.id;
  const isApplicant = me.roles.includes('applicant');
  const isModerator = me.roles.includes('moderator');

  const perform = async (action: () => Promise<boolean>) => {
    if (await action()) await reload();
  };

  return (
    <>
      <div className={styles.actions}>
        {isApplicant && (
          <>
            <span
              title={
                selected.status !== 'draft'
                  ? 'Редактировать можно только заявку в статусе «Черновик»'
                  : undefined
              }
            >
              <Button
                label="Редактировать"
                icon="pi pi-pencil"
                disabled={selected.status !== 'draft'}
                onClick={() => navigate(`/forms/${selected.id}/edit`)}
              />
            </span>
            {selected.status === 'draft' && (
              <Button
                label="Отметить готовой"
                icon="pi pi-check"
                disabled={!selected.document?.scanId}
                title={
                  !selected.document?.scanId
                    ? 'Сначала прикрепите скан документа'
                    : undefined
                }
                onClick={() => perform(() => actions.markReady(formId))}
              />
            )}
            {selected.status === 'pending' && (
              <Button
                label="Вернуть в черновик"
                icon="pi pi-replay"
                onClick={() => perform(() => actions.convertToDraft(formId))}
              />
            )}
            {['draft', 'pending'].includes(selected.status) && (
              <Button
                label="Отменить заявку"
                icon="pi pi-times"
                severity="danger"
                outlined
                onClick={() => {
                  if (
                    window.confirm('Отменить заявку? Это действие необратимо.')
                  )
                    void perform(() => actions.cancel(formId));
                }}
              />
            )}
          </>
        )}
        {isModerator && (
          <>
            {selected.status === 'pending' && (
              <Button
                label="Взять на проверку"
                icon="pi pi-eye"
                onClick={() => perform(() => actions.startReview(formId))}
              />
            )}
            {selected.status === 'reviewing' && (
              <>
                <Button
                  label="Подтвердить"
                  icon="pi pi-check"
                  onClick={() => perform(() => actions.approve(formId))}
                />
                <Button
                  label="Отклонить"
                  icon="pi pi-ban"
                  severity="danger"
                  onClick={() =>
                    perform(() =>
                      actions.reject(formId, 'Отклонено модератором'),
                    )
                  }
                />
                <Button
                  label="Отправить на доработку"
                  icon="pi pi-replay"
                  outlined
                  onClick={() => setRevisionOpen(true)}
                />
                <Button
                  label="Отмена"
                  icon="pi pi-times"
                  outlined
                  onClick={() => perform(() => actions.cancelReview(formId))}
                />
              </>
            )}
          </>
        )}
      </div>
      <TextareaDialog
        placeholder={'Подробно опишите причину...'}
        open={revisionOpen}
        onHide={() => setRevisionOpen(false)}
        onSubmit={async (reason: string) => {
          const ok = await actions.convertToDraftModerator(formId, reason);
          if (!ok) return;
          await reload();
          navigate('/forms');
        }}
      />
    </>
  );
});
