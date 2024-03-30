import Header from "./components/HeaderAnterior";
import Footer from "./components/Footer/Footer";
import AppRoutes from "./routes/AppRoutes";
import { BrowserRouter as Router } from "react-router-dom";
import { Container } from "react-bootstrap";
import '../src/App.css'

const App = () => {
  return (
    <Router>
      <Header />
      <Container style={{ height: '90vh' }}>
        <AppRoutes />
      </Container>
      <Footer />
    </Router>
  );
}

export default App
