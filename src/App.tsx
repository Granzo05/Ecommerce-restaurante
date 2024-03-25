import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import AppRoutes from "./routes/AppRoutes";
import { BrowserRouter as Router } from "react-router-dom";
import { Container } from "react-bootstrap";

const App = () => {
  return (
    <Router>
      <Header />
      <Container style={{ minHeight: '90vh', minWidth: '100%', padding: '0' }}>
        <AppRoutes />
      </Container>
      <Footer />

    </Router>
  );
}

export default App
