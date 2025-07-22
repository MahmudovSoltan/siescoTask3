import styles from './Header.module.css';
interface HeaderProps {
  setShowModal: (show: boolean) => void;
}

const Header = ({ setShowModal }: HeaderProps) => {
  return (
    <div className={styles.headerContainer}>
      <h1 className={styles.title}>Header</h1>
      <div className={styles.buttonGroup}>
        <button className={styles.button} >Import</button>
        <button className={styles.button} onClick={() => setShowModal(true)}>Export</button>
      </div>
    </div>
  );
};

export default Header;
