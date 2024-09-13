import NavBar from './components/NavBar';
import styles from './App.module.css';
import { Container } from 'react-bootstrap';

function App() {
  return (
    <div className={styles.App}>
      <NavBar />
      <Container className={styles.Main}>
        <h1>Home Page</h1>
        <h1>Sign in</h1>
      </Container>
    </div>
  );
}

export default App;