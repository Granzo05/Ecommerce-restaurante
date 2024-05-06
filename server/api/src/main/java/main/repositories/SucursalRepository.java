package main.repositories;

import main.entities.Domicilio.Localidad;
import main.entities.Domicilio.LocalidadDTO;
import main.entities.Restaurante.LocalidadDelivery;
import main.entities.Restaurante.Sucursal;
import main.entities.Restaurante.SucursalDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SucursalRepository extends JpaRepository<Sucursal, Long> {

    @Query("SELECT s FROM Sucursal s WHERE s.email = :email")
    Sucursal findByEmail(@Param("email") String email);

    @Query("SELECT s FROM Sucursal s WHERE s.id = :id AND s.borrado = 'NO'")
    Sucursal findByIdNotBorrado(@Param("id") Long id);

    @Query("SELECT s.localidadesDisponiblesDelivery FROM Sucursal s WHERE s.id = :id AND s.borrado = 'NO'")
    List<LocalidadDelivery> findLocalidadesByIdSucursal(@Param("id") Long id);

    @Query("SELECT NEW main.entities.Restaurante.SucursalDTO(s.id,s.domicilio, s.telefono,s.email,s.horarioApertura,s.horarioCierre) FROM Sucursal s WHERE s.borrado = 'NO'")
    List<SucursalDTO> findAllNoBorrado();

    @Query("SELECT NEW main.entities.Restaurante.SucursalDTO(s.id,s.domicilio, s.telefono,s.email,s.horarioApertura,s.horarioCierre) FROM Sucursal s WHERE s.email = :email AND s.contraseña = :contraseña")
    SucursalDTO findByEmailAndPassword(@Param("email") String email, @Param("contraseña") String password);

}