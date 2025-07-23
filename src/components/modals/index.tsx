import React from 'react';
import styles from './modal.module.css';
import type { Field } from '../../pages/userTable';


interface ModalProps {
  fields: Field[];
  onChangeChecked: (id: string, checked: boolean) => void;
  onChangeValue: (id: string, value: string) => void;
  onClose: () => void;
  onExport: () => void;
}

const Modal: React.FC<ModalProps> = ({
  fields,
  onChangeChecked,
  onChangeValue,
  onClose,
  onExport,
}) => {


  
  return (

    <div className={styles.modalContainer}>
      <div className={styles.overlay} onClick={onClose}>
      </div>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>Məlumatları Excela eksport edin.</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            ×
          </button>
        </div>
        <p className={styles.description}>
          Eksport ediləcək sütunları seçin və başlıqları dəyişdirin:
        </p>
        <div className={styles.content}>
          <div className={styles.checkboxColumn}>
            {fields.map(field => (
              <label key={field.frontendId} className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={field.isInclude}
                  onChange={e => onChangeChecked(field.frontendId, e.target.checked)}
                />
                {field.dbColumnName}
              </label>
            ))}
          </div>
          <div className={styles.inputColumn}>
            {fields.map(field => (
              <input
                key={field.frontendId}
                type="text"
                value={field.excelColumnName}
                onChange={e => onChangeValue(field.frontendId, e.target.value)}
                className={styles.textInput}
              />
            ))}
          </div>

        </div>
        <button className={styles.exportBtn} onClick={onExport}>
          Eksport et
        </button>
      </div>

    </div>
  );
};

export default Modal;
