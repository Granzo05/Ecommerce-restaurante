package main.mapper.Restaurante;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import main.entities.Restaurante.Empresa;
import main.mapper.Productos.ImagenesDTO;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class EmpresaDTO {
    private long id;

    private String nombre;

    private String cuit;

    private String razonSocial;

    private String borrado = "NO";

    private Set<ImagenesDTO> imagenes = new HashSet<>();

    public static EmpresaDTO toDTO(Empresa empresa) {
        EmpresaDTO dto = new EmpresaDTO();
        dto.setId(empresa.getId());
        dto.setNombre(empresa.getNombre());
        dto.setCuit(empresa.getCuit());
        dto.setRazonSocial(empresa.getRazonSocial());
        dto.setBorrado(empresa.getBorrado());
        dto.setImagenes(empresa.getImagenes().stream()
                .map(ImagenesDTO::toDTO)
                .collect(Collectors.toSet()));
        return dto;
    }
}