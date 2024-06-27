package main.mapper.Restaurante;

import lombok.*;
import main.entities.Ingredientes.Categoria;
import main.entities.Productos.Promocion;
import main.entities.Restaurante.Sucursal;
import main.mapper.Productos.ImagenesDTO;

import java.io.Serializable;
import java.time.LocalTime;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class SucursalDTO implements Serializable {
    private Long id;

    private Set<DomicilioDTO> domicilios = new HashSet<>();

    private Long telefono;

    private String email;

    private String nombre;

    private LocalTime horarioApertura;

    private LocalTime horarioCierre;

    private String borrado = "NO";

    private Set<Promocion> promociones = new HashSet<>();
    private Set<Categoria> categorias = new HashSet<>();

    private Set<ImagenesDTO> imagenes = new HashSet<>();

    public static SucursalDTO toDTO(Sucursal sucursal) {
        SucursalDTO dto = new SucursalDTO();
        dto.setId(sucursal.getId());
        dto.setNombre(sucursal.getNombre());
        dto.setEmail(sucursal.getEmail());
        dto.setDomicilios(sucursal.getDomicilios().stream()
                .map(DomicilioDTO::toDTO)
                .collect(Collectors.toSet()));
        dto.setHorarioApertura(sucursal.getHorarioCierre());
        dto.setCategorias(sucursal.getCategorias());
        dto.setHorarioCierre(sucursal.getHorarioCierre());
        dto.setBorrado(sucursal.getBorrado());
        dto.setPromociones(sucursal.getPromociones());
        return dto;
    }
}
