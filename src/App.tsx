import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import AppRoutes from "./routes/AppRoutes";
import { BrowserRouter as Router } from "react-router-dom";
import { Container } from "react-bootstrap";

const App = () => {
  return (
    <Router>
      <header><Header  /></header>
      <Container >
        <AppRoutes />
      </Container>
      <Footer />
    </Router>
  );
}

export default App
