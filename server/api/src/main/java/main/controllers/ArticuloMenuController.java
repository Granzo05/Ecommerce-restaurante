package main.controllers;

import main.entities.Ingredientes.Categoria;
import main.entities.Ingredientes.Ingrediente;
import main.entities.Ingredientes.IngredienteMenu;
import main.entities.Productos.ArticuloMenu;
import main.entities.Productos.Imagenes;
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
    private final CategoriaRepository categoriaRepository;
    private final SubcategoriaRepository subcategoriaRepository;


    public ArticuloMenuController(ArticuloMenuRepository articuloMenuRepository, IngredienteMenuRepository ingredienteMenuRepository, IngredienteRepository ingredienteRepository, ImagenesRepository imagenesRepository, SucursalRepository sucursalRepository, CategoriaRepository categoriaRepository, SubcategoriaRepository subcategoriaRepository) {
        this.articuloMenuRepository = articuloMenuRepository;
        this.ingredienteMenuRepository = ingredienteMenuRepository;
        this.ingredienteRepository = ingredienteRepository;
        this.imagenesRepository = imagenesRepository;
        this.sucursalRepository = sucursalRepository;
        this.categoriaRepository = categoriaRepository;
        this.subcategoriaRepository = subcategoriaRepository;
    }

    // Busca por id de menu
    @GetMapping("/menus/{idSucursal}")
    public Set<ArticuloMenu> getMenusDisponibles(@PathVariable("idSucursal") Long idSucursal) {
        List<ArticuloMenu> menus = articuloMenuRepository.findAllBySucursal(idSucursal);

        for (ArticuloMenu menu : menus) {
            menu.setImagenes(new HashSet<>(imagenesRepository.findByIdMenu(menu.getId())));
            menu.setIngredientesMenu(new HashSet<>(ingredienteMenuRepository.findByMenuId(menu.getId())));
        }

        return new HashSet<>(menus);
    }

    @Transactional
    @PostMapping("/menu/create/{idSucursal}")
    public ResponseEntity<String> crearMenu(@RequestBody ArticuloMenu articuloMenu, @PathVariable("idSucursal") Long idSucursal) {
        Optional<ArticuloMenu> menuDB = articuloMenuRepository.findByName(articuloMenu.getNombre());
        if (menuDB.isEmpty()) {
            try {
                Set<IngredienteMenu> ingredientes = new HashSet<>();

                for (IngredienteMenu ingredienteMenu : articuloMenu.getIngredientesMenu()) {
                    Ingrediente ingredienteDB = ingredienteRepository.findByNameAndIdSucursal(ingredienteMenu.getIngrediente().getNombre(), idSucursal).get();
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
                        return ResponseEntity.badRequest().body("Sucursal no encontrada");
                    }
                }

                articuloMenu.setCategoria(categoriaRepository.findById(articuloMenu.getCategoria().getId()).get());
                articuloMenu.setSubcategoria(subcategoriaRepository.findById(articuloMenu.getSubcategoria().getId()).get());

                articuloMenuRepository.save(articuloMenu);

                return new ResponseEntity<>("El menú ha sido añadido correctamente", HttpStatus.OK);
            } catch (Exception e) {
                return ResponseEntity.badRequest().body("Hubo un error al cargar el menú");

            }


        } else {
            return ResponseEntity.badRequest().body("Hay un menú existente con ese nombre");
        }
    }

    @Transactional
    @PostMapping("/menu/imagenes/{idSucursal}")
    public ResponseEntity<String> crearImagenMenu(@RequestParam("file") MultipartFile file, @RequestParam("nombreMenu") String nombreMenu, @PathVariable("idSucursal") Long idSucursal) {
        HashSet<Imagenes> listaImagenes = new HashSet<>();
        // Buscamos el nombre de la foto
        String fileName = file.getOriginalFilename().replaceAll(" ", "");
        try {
            String basePath = new File("").getAbsolutePath();
            String rutaCarpeta = basePath + File.separator + "src" + File.separator + "main" + File.separator + "webapp" + File.separator + "WEB-INF" + File.separator + "imagesMenu" + File.separator + nombreMenu.replaceAll(" ", "") + File.separator;

            // Verificar si la carpeta existe, caso contrario, crearla
            File carpeta = new File(rutaCarpeta);
            if (!carpeta.exists()) {
                carpeta.mkdirs();
            }

            String rutaArchivo = rutaCarpeta + fileName;
            file.transferTo(new File(rutaArchivo));

            String downloadUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("imagesMenu/")
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
                    Optional<ArticuloMenu> menu = articuloMenuRepository.findByNameMenuAndIdSucursal(nombreMenu, idSucursal);
                    if (menu.isEmpty()) {
                        return new ResponseEntity<>("menu vacio", HttpStatus.NOT_FOUND);
                    }
                    imagenProducto.setArticuloMenu(menu.get());
                    imagenProducto.setSucursal(sucursalRepository.findById(idSucursal).get());
                    imagenesRepository.save(imagenProducto);
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
    public ResponseEntity<String> eliminarImagenMenu(@PathVariable("id") Long id) {
        Optional<Imagenes> imagen = imagenesRepository.findById(id);

        if (imagen.isPresent()) {
            try {
                imagenesRepository.delete(imagen.get());
                return new ResponseEntity<>(HttpStatus.ACCEPTED);

            } catch (Exception e) {
                System.out.println("Error al crear la imagen: " + e);
            }
        }

        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @GetMapping("/menu/tipo/{categoria}/{idSucursal}")
    public Set<ArticuloMenu> getMenusPorTipo(@PathVariable("categoria") String categoria, @PathVariable("idSucursal") Long idSucursal) {
        Optional<Categoria> categoriaDB = categoriaRepository.findByNameAndIdSucursal(categoria, idSucursal);

        if (categoriaDB.isPresent()) {
            List<ArticuloMenu> articuloMenus = articuloMenuRepository.findByCategoriaAndIdSucursal(categoriaDB.get().getId(), idSucursal);

            for (ArticuloMenu menu : articuloMenus) {
                menu.setImagenes(new HashSet<>(imagenesRepository.findByIdMenu(menu.getId())));
                menu.setIngredientesMenu(new HashSet<>(ingredienteMenuRepository.findByMenuId(menu.getId())));
            }

            return new HashSet<>(articuloMenus);
        }

        return null;
    }

    @Transactional
    @PutMapping("/menu/update/{idSucursal}")
    public ResponseEntity<String> actualizarMenu(@RequestBody ArticuloMenu articuloMenuDetail, @PathVariable("idSucursal") Long id) {
        Optional<ArticuloMenu> menuEncontrado = articuloMenuRepository.findByIdMenuAndIdSucursal(articuloMenuDetail.getId(), id);

        if (menuEncontrado.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("El menú no se encontró");
        }

        if (menuEncontrado.isPresent() && menuEncontrado.get().getBorrado().equals(articuloMenuDetail.getBorrado())) {
            Optional<ArticuloMenu> articuloMenuDB = articuloMenuRepository.findByNameMenuAndIdSucursal(articuloMenuDetail.getNombre(), id);

            if (articuloMenuDB.isPresent() && articuloMenuDB.get().getId() != menuEncontrado.get().getId()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Existe un menú con ese nombre");
            }

            ArticuloMenu articuloMenu = menuEncontrado.get();

            ingredienteMenuRepository.deleteAllByIdArticuloMenu(articuloMenu.getId());

            articuloMenu.setPrecioVenta(articuloMenuDetail.getPrecioVenta());

            for (IngredienteMenu ingredienteMenuDTO : articuloMenuDetail.getIngredientesMenu()) {
                IngredienteMenu ingredienteMenu = new IngredienteMenu();
                ingredienteMenu.setArticuloMenu(articuloMenu);
                ingredienteMenu.setMedida(ingredienteMenuDTO.getMedida());
                ingredienteMenu.setCantidad(ingredienteMenuDTO.getCantidad());
                ingredienteMenu.setIngrediente(ingredienteRepository.findByNameAndIdSucursal(ingredienteMenuDTO.getIngrediente().getNombre(), id).get());

                articuloMenu.getIngredientesMenu().add(ingredienteMenu);
            }

            articuloMenu.setTiempoCoccion(articuloMenuDetail.getTiempoCoccion());
            articuloMenu.setDescripcion(articuloMenuDetail.getDescripcion());
            articuloMenu.setNombre(articuloMenuDetail.getNombre());
            articuloMenu.setCategoria(categoriaRepository.findByNameAndIdSucursal(articuloMenuDetail.getCategoria().getNombre(), id).get());
            articuloMenu.setComensales(articuloMenuDetail.getComensales());

            articuloMenuRepository.save(articuloMenu);

            return ResponseEntity.ok("El menu ha sido actualizado correctamente");

        } else if (menuEncontrado.isPresent() && !menuEncontrado.get().getBorrado().equals(articuloMenuDetail.getBorrado())) {
            ArticuloMenu articuloMenu = menuEncontrado.get();
            articuloMenu.setBorrado(articuloMenuDetail.getBorrado());

            articuloMenuRepository.save(articuloMenu);

            return ResponseEntity.ok("El menu ha sido actualizado correctamente");
        }

        return ResponseEntity.badRequest().body("El menu no existe existe");
    }

}
