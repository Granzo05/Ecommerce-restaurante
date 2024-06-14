package main.repositories;

import main.entities.Pedidos.Pedido;
import main.entities.Productos.Promocion;
import main.entities.Restaurante.Privilegios;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PrivilegiosRepository extends JpaRepository<Privilegios, Long> {
    @Query("SELECT p FROM Privilegios p WHERE p.tarea = :tarea")
    Optional<Privilegios> findByTarea(@Param("tarea") String tarea);
}