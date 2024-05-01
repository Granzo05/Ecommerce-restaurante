package main.repositories;

import main.entities.Restaurante.Sucursal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface SucursalRepository extends JpaRepository<Sucursal, Long> {

    @Query("SELECT s FROM Sucursal s WHERE s.email = :email")
    Sucursal findByEmail(@Param("email") String email);

    @Query("SELECT s FROM Sucursal s WHERE s.email = :email AND s.contraseña = :contraseña")
    Sucursal findByEmailAndPassword(@Param("email") String email, @Param("contraseña") String password);

}