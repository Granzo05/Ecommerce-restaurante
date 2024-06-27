package main.mapper.Restaurante;


import lombok.*;
import main.entities.Restaurante.*;
import main.mapper.Productos.ImagenesDTO;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class EmpleadoDTO {
    private Long id;

    private String nombre;

    private String email;

    private String cuil;

    private Long telefono;

    private Set<DomicilioDTO> domicilios = new HashSet<>();

    private Set<FechaContratacionEmpleado> fechaContratacion = new HashSet<>();

    private LocalDate fechaNacimiento;

    private String borrado = "NO";

    private Set<PrivilegiosEmpleados> privilegios = new HashSet<>();

    private Set<RolesEmpleados> roles = new HashSet<>();

    private Set<ImagenesDTO> imagenes = new HashSet<>();

    private Set<SucursalDTO> sucursales = new HashSet<>();

    public static EmpleadoDTO toDTO(Empleado empleado) {
        EmpleadoDTO dto = new EmpleadoDTO();
        dto.setId(empleado.getId());
        dto.setNombre(empleado.getNombre());
        dto.setEmail(empleado.getEmail());
        dto.setTelefono(empleado.getTelefono());
        dto.setFechaContratacion(empleado.getFechaContratacion());
        dto.setFechaNacimiento(empleado.getFechaNacimiento());
        dto.setDomicilios(empleado.getDomicilios().stream()
                .map(DomicilioDTO::toDTO)
                .collect(Collectors.toSet()));
        dto.setPrivilegios(empleado.getPrivilegios());
        dto.setRoles(empleado.getRoles());
        dto.setBorrado(empleado.getBorrado());
        dto.setImagenes(empleado.getImagenes().stream()
                .map(ImagenesDTO::toDTO)
                .collect(Collectors.toSet()));
        dto.setSucursales(empleado.getSucursales().stream()
                .map(SucursalDTO::toDTO)
                .collect(Collectors.toSet()));
        dto.setBorrado(empleado.getBorrado());
        return dto;

    }
}