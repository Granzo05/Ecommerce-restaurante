package main.repositories;

import main.entities.Pedidos.Pedido;
import main.entities.Productos.Promocion;
import main.entities.Restaurante.Privilegios;
import main.entities.Restaurante.Roles;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PrivilegiosRepository extends JpaRepository<Privilegios, Long> {

    @Query("SELECT p FROM Privilegios p JOIN p.sucursales s WHERE s.id = :id AND p.tarea = :tarea")
    Optional<Privilegios> findByTareaAndIdSucursal(@Param("tarea") String tarea, @Param("id") Long id);

    @Query("SELECT p FROM Privilegios p JOIN p.sucursales s WHERE s.id = :idSucursal AND p.id = :idRol")
    Optional<Privilegios> findByIdPrivilegioAndIdSucursal(@Param("idRol") Long idRol, @Param("idSucursal") Long idSucursal);

    @Query("SELECT p FROM Privilegios p JOIN p.sucursales s WHERE s.id = :id")
    List<Privilegios> findAllByIdSucursal(@Param("id") Long id);
}