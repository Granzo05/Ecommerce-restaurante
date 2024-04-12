package main.repositories;

import main.entities.Restaurante.Menu.ImagenesMenu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ImagenMenuRepository extends JpaRepository<ImagenesMenu, Long> {
    @Query("SELECT i FROM ImagenesMenu i WHERE i.ruta = :nombre")
    ImagenesMenu findByRuta(@Param("nombre") String nombre);


}