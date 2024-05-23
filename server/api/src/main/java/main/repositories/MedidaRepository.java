package main.repositories;

import main.entities.Ingredientes.Categoria;
import main.entities.Ingredientes.CategoriaDTO;
import main.entities.Ingredientes.Medida;
import main.entities.Ingredientes.MedidaDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface MedidaRepository extends JpaRepository<Medida, Long> {
    @Query("SELECT NEW main.entities.Ingredientes.MedidaDTO(m.id, m.denominacion, m.borrado) FROM Medida m")
    Optional<MedidaDTO> findAllDTO();
    @Query("SELECT m FROM Medida m WHERE m.denominacion = :denominacion AND m.sucursal = :id")
    Optional<Medida> findByDenominacionAndIdSucursal(@Param("denominacion") String denominacion, @Param("id") Long id);

    @Query("SELECT m FROM Medida m WHERE m.id = :idMedida AND m.sucursal = :idSucursal")
    Optional<Medida> findByIdMedidaAndIdSucursal(@Param("idMedida") Long idMedida, @Param("idSucursal") Long idSucursal);

    @Query("SELECT NEW main.entities.Ingredientes.MedidaDTO(m.id, m.denominacion, m.borrado) FROM Medida m WHERE m.sucursal = :id")
    List<MedidaDTO> findAllDTOByIdSucursal(@Param("id") Long id);
}