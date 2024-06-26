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

    @Query("SELECT s FROM Sucursal s JOIN s.domicilios dom WHERE dom.localidad.departamento.provincia.nombre = :provincia AND dom.borrado = 'NO'")
    List<Sucursal> findByProvincia(@Param("provincia") String provincia);

    @Query("SELECT s FROM Sucursal s WHERE s.nombre = :nombre")
    Optional<Sucursal> findByName(@Param("nombre") String nombre);

    @Query("SELECT s FROM Sucursal s WHERE s.empresa.id = :id")
    List<Sucursal> findByIdEmpresa(@Param("id") Long id);

    @Query("SELECT s.id FROM Sucursal s JOIN s.domicilios dom WHERE dom.localidad.id = :idLocalidad")
    List<Long> findIdByIdLocalidadDomicilio(@Param("idLocalidad") Long idLocalidad);

    @Query("SELECT s.id FROM Sucursal s JOIN s.domicilios dom WHERE dom.localidad.departamento.id = :idDepartamento")
    List<Long> findIdByIdDepartamentoDomicilio(@Param("idDepartamento") Long idDepartamento);

    @Query("SELECT s.id FROM Sucursal s JOIN s.domicilios dom WHERE dom.localidad.departamento.provincia.id = :idProvincia")
    List<Long> findIdByIdProvinciaDomicilio(@Param("idProvincia") Long idProvincia);

    @Query("SELECT s.localidadesDisponiblesDelivery FROM Sucursal s WHERE s.id = :id AND s.borrado = 'NO'")
    List<LocalidadDelivery> findLocalidadesByIdSucursal(@Param("id") Long id);

    @Query("SELECT s FROM Sucursal s WHERE s.email = :email AND s.contraseña = :contraseña AND s.borrado = 'NO'")
    Optional<Sucursal> findByEmailAndPassword(@Param("email") String email, @Param("contraseña") String password);

}