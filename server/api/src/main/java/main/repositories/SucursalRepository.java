package main.repositories;

import main.entities.Restaurante.LocalidadDelivery;
import main.entities.Restaurante.Sucursal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SucursalRepository extends JpaRepository<Sucursal, Long> {

    @Query("SELECT s FROM Sucursal s WHERE s.email = :email")
    Optional<Sucursal> findByEmail(@Param("email") String email);

    @Query("SELECT s FROM Sucursal s WHERE s.id = :id")
    Optional<Sucursal> findById(@Param("id") Long id);

    @Query("SELECT s FROM Sucursal s WHERE s.nombre = :nombre")
    Optional<Sucursal> findByName(@Param("nombre") String nombre);
    @Query("SELECT s FROM Sucursal s WHERE s.empresa.id = :id")
    List<Sucursal> findByIdEmpresa(@Param("id") Long id);

    @Query("SELECT s.localidadesDisponiblesDelivery FROM Sucursal s WHERE s.id = :id AND s.borrado = 'NO'")
    List<LocalidadDelivery> findLocalidadesByIdSucursal(@Param("id") Long id);

    @Query("SELECT s FROM Sucursal s WHERE s.email = :email AND s.contraseña = :contraseña AND s.borrado = 'NO'")
    Optional<Sucursal> findByEmailAndPassword(@Param("email") String email, @Param("contraseña") String password);

}