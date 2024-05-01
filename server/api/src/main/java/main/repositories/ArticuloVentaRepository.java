package main.repositories;

import main.entities.Productos.ArticuloVenta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ArticuloVentaRepository extends JpaRepository<ArticuloVenta, Long> {

}