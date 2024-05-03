package main.repositories;

import main.entities.Pedidos.DetallesPedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DetallePedidoRepository extends JpaRepository<DetallesPedido, Long> {


}