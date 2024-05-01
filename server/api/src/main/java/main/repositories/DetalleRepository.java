package main.repositories;

import main.entities.Cliente.Cliente;
import main.entities.Pedidos.DetallesPedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DetalleRepository extends JpaRepository<DetallesPedido, Long> {


}