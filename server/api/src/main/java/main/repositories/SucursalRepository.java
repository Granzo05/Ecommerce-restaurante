package main.repositories;

import main.entities.Restaurante.Sucursal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface RestauranteRepository extends JpaRepository<Sucursal, Long> {

    @Query("SELECT r FROM Sucursal r WHERE r.email = :email")
    Sucursal findByEmail(@Param("email") String email);

    @Query("SELECT r FROM Sucursal r WHERE r.email = :email AND r.contraseña = :contraseña")
    Sucursal findByEmailAndPassword(@Param("email") String email, @Param("contraseña") String password);

}