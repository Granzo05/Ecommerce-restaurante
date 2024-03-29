import Header from "./components/Header";
import Footer from "./components/Footer/Footer";
import AppRoutes from "./routes/AppRoutes";
import { BrowserRouter as Router } from "react-router-dom";
import { Container } from "react-bootstrap";
import '../src/App.css'

const App = () => {
  return (
    <Router>
      <Header  />
      <Container >
        <AppRoutes />
      </Container>
      <Footer />
    </Router>
  );
}

export default App
