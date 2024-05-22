package main.controllers;

import main.entities.Ingredientes.Ingrediente;
import main.entities.Ingredientes.IngredienteMenu;
import main.entities.Ingredientes.IngredienteMenuDTO;
import main.entities.Productos.*;
import main.entities.Restaurante.Sucursal;
import main.repositories.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.File;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@RestController
public class ArticuloMenuController {
    private final ArticuloMenuRepository articuloMenuRepository;

    private final IngredienteMenuRepository ingredienteMenuRepository;
    private final IngredienteRepository ingredienteRepository;
    private final ImagenesRepository imagenesRepository;
    private final SucursalRepository sucursalRepository;


    public ArticuloMenuController(ArticuloMenuRepository articuloMenuRepository, IngredienteMenuRepository ingredienteMenuRepository, IngredienteRepository ingredienteRepository, ImagenesRepository imagenesRepository, SucursalRepository sucursalRepository) {
        this.articuloMenuRepository = articuloMenuRepository;
        this.ingredienteMenuRepository = ingredienteMenuRepository;
        this.ingredienteRepository = ingredienteRepository;
        this.imagenesRepository = imagenesRepository;
        this.sucursalRepository = sucursalRepository;
    }

    // Busca por id de menu
    @GetMapping("/menus/{idSucursal}")
    public Set<ArticuloMenuDTO> getMenusDisponibles(@PathVariable("idSucursal") Long idSucursal) {
        List<ArticuloMenuDTO> menus = articuloMenuRepository.findAllBySucursal(idSucursal);

        for (ArticuloMenuDTO menu : menus) {
            menu.setImagenesDTO(new HashSet<>(imagenesRepository.findByIdMenuDTO(menu.getId())));
            menu.setIngredientesMenu(new HashSet<>(ingredienteMenuRepository.findByMenuId(menu.getId())));
        }

        return new HashSet<>(menus);
    }

    @Transactional
    @PostMapping("/menu/create/{idSucursal}")
    public ResponseEntity<String> crearMenu(@RequestBody ArticuloMenu articuloMenu, @PathVariable("idSucursal") Long idSucursal) {
        Optional<ArticuloMenu> menuDB = articuloMenuRepository.findByName(articuloMenu.getNombre());
        if (menuDB.isEmpty()) {
            Set<IngredienteMenu> ingredientes = new HashSet<>();

            for (IngredienteMenu ingredienteMenu : articuloMenu.getIngredientesMenu()) {
                Ingrediente ingredienteDB = ingredienteRepository.findByName(ingredienteMenu.getIngrediente().getNombre()).get();
                IngredienteMenu ingredienteMenu1 = new IngredienteMenu();

                ingredienteMenu1.setIngrediente(ingredienteDB);
                ingredienteMenu1.setCantidad(ingredienteMenu.getCantidad());
                ingredienteMenu1.setArticuloMenu(articuloMenu);
                ingredienteMenu1.setMedida(ingredienteMenu.getMedida());

                ingredientes.add(ingredienteMenu1);
            }
            articuloMenu.getIngredientesMenu().clear();
            articuloMenu.setIngredientesMenu(ingredientes);

            articuloMenu.setBorrado("NO");

            // Si la sucursal coincide con los privilegios del admin o de la empresa que agregue todas las sucursales al menu
            if (idSucursal == 0) {
                List<Sucursal> sucursales = sucursalRepository.findAll();
                for (Sucursal sucursal : sucursales) {
                    sucursal.getArticulosMenu().add(articuloMenu);
                }
            } else {
                Optional<Sucursal> sucursalOpt = sucursalRepository.findById(idSucursal);
                if (sucursalOpt.isPresent()) {
                    Sucursal sucursal = sucursalOpt.get();
                    sucursal.getArticulosMenu().add(articuloMenu);
                } else {
                    return new ResponseEntity<>("Sucursal no encontrada con id: " + idSucursal, HttpStatus.NOT_FOUND);
                }
            }

            articuloMenuRepository.save(articuloMenu);

            return new ResponseEntity<>("El menú ha sido añadido correctamente", HttpStatus.OK);

        } else {
            return new ResponseEntity<>("Hay un menú creado con ese nombre", HttpStatus.FOUND);
        }
    }

    @Transactional
    @PostMapping("/menu/imagenes")
    public ResponseEntity<String> crearImagen(@RequestParam("file") MultipartFile file, @RequestParam("nombreMenu") String nombreMenu) {
        HashSet<Imagenes> listaImagenes = new HashSet<>();
        // Buscamos el nombre de la foto
        String fileName = file.getOriginalFilename().replaceAll(" ", "");
        try {
            String basePath = new File("").getAbsolutePath();
            String rutaCarpeta = basePath + File.separator + "src" + File.separator + "main" + File.separator + "webapp" + File.separator + "WEB-INF" + File.separator + "images" + File.separator + nombreMenu.replaceAll(" ", "") + File.separator;

            // Verificar si la carpeta existe, caso contrario, crearla
            File carpeta = new File(rutaCarpeta);
            if (!carpeta.exists()) {
                carpeta.mkdirs();
            }

            String rutaArchivo = rutaCarpeta + fileName;
            file.transferTo(new File(rutaArchivo));

            String downloadUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path(nombreMenu.replaceAll(" ", "") + "/")
                    .path(fileName.replaceAll(" ", ""))
                    .toUriString();

            Imagenes imagen = new Imagenes();
            imagen.setNombre(fileName.replaceAll(" ", ""));
            imagen.setRuta(downloadUrl);
            imagen.setFormato(file.getContentType());

            listaImagenes.add(imagen);

            try {
                for (Imagenes imagenProducto : listaImagenes) {
                    // Asignamos el menu a la imagen
                    Optional<ArticuloMenu> menu = articuloMenuRepository.findByName(nombreMenu);
                    if (menu.isEmpty()) {
                        return new ResponseEntity<>("Menu vacio", HttpStatus.NOT_FOUND);
                    }
                    imagenProducto.setArticuloMenu(menu.get());

                    imagenesRepository.save(imagen);
                }

            } catch (Exception e) {
                System.out.println("Error al insertar la ruta en el menu: " + e);
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }

            return new ResponseEntity<>("Imagen creada correctamente", HttpStatus.OK);

        } catch (Exception e) {
            System.out.println("Error al crear la imagen: " + e);
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @Transactional
    @PutMapping("/menu/imagen/{id}/delete")
    public ResponseEntity<String> eliminarImagen(@PathVariable("id") Long id) {
        List<Imagenes> imagenes = imagenesRepository.findByIdMenu(id);

        for (Imagenes imagen: imagenes) {
            try {
                imagen.setBorrado("SI");

                imagenesRepository.save(imagen);

                return new ResponseEntity<>("Imagen creada correctamente", HttpStatus.OK);
            } catch (Exception e) {
                System.out.println("Error al crear la imagen: " + e);
            }
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @GetMapping("/menu/tipo/{tipoMenu}/{idSucursal}")
    public Set<ArticuloMenuDTO> getMenusPorTipo(@PathVariable("tipoMenu") String tipo, @PathVariable("idSucursal") Long idSucursal) {
        String tipoMenu = tipo.toUpperCase().replace(" ", "_");
        Set<ArticuloMenuDTO> articuloMenus = (new HashSet<>(articuloMenuRepository.findByTipoAndIdSucursal(EnumTipoArticuloComida.valueOf(tipoMenu), idSucursal)));

        for (ArticuloMenuDTO articuloMenu : articuloMenus) {
            articuloMenu.setImagenesDTO(new HashSet<>(imagenesRepository.findByIdMenuDTO(articuloMenu.getId())));
            articuloMenu.setIngredientesMenu(new HashSet<>(ingredienteMenuRepository.findByMenuId(articuloMenu.getId())));
        }
        return articuloMenus;
    }

    @Transactional
    @PutMapping("/menu/update/{idSucursal}")
    public ResponseEntity<String> actualizarMenu(@RequestBody ArticuloMenuDTO articuloMenuDetail, @PathVariable("idSucursal") Long id) {
        Optional<ArticuloMenu> menuEncontrado = articuloMenuRepository.findByIdMenuAndIdSucursal(articuloMenuDetail.getId(), id);

        if (menuEncontrado.isPresent() && menuEncontrado.get().getBorrado().equals(articuloMenuDetail.getBorrado())) {
            ArticuloMenu articuloMenu = menuEncontrado.get();

            ingredienteMenuRepository.deleteAllByIdArticuloMenu(articuloMenu.getId());

            articuloMenu.setPrecioVenta(articuloMenuDetail.getPrecioVenta());

            for (IngredienteMenuDTO ingredienteMenuDTO : articuloMenuDetail.getIngredientesMenu()) {
                IngredienteMenu ingredienteMenu = new IngredienteMenu();
                ingredienteMenu.setArticuloMenu(articuloMenu);
                ingredienteMenu.setMedida(ingredienteMenu.getMedida());
                ingredienteMenu.setCantidad(ingredienteMenuDTO.getCantidad());
                ingredienteMenu.setIngrediente(ingredienteRepository.findByName(ingredienteMenuDTO.getIngredienteNombre()).get());

                articuloMenu.getIngredientesMenu().add(ingredienteMenu);
            }

            articuloMenu.setTiempoCoccion(articuloMenuDetail.getTiempoCoccion());
            articuloMenu.setDescripcion(articuloMenuDetail.getDescripcion());
            articuloMenu.setNombre(articuloMenuDetail.getNombre());
            articuloMenu.setTipo(articuloMenuDetail.getTipo());
            articuloMenu.setComensales(articuloMenuDetail.getComensales());

            articuloMenuRepository.save(articuloMenu);

            return ResponseEntity.ok("El menu ha sido actualizado correctamente");

        } else if (menuEncontrado.isPresent() && !menuEncontrado.get().getBorrado().equals(articuloMenuDetail.getBorrado())) {
            ArticuloMenu articuloMenu = menuEncontrado.get();
            articuloMenu.setBorrado(articuloMenuDetail.getBorrado());

            articuloMenuRepository.save(articuloMenu);

            return ResponseEntity.ok("El menu ha sido actualizado correctamente");
        }

        return ResponseEntity.ofNullable("El articulo no se ha encontrado");
    }

}
