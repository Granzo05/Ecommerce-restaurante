package main.controllers;

import jakarta.transaction.Transactional;
import main.entities.Ingredientes.Categoria;
import main.entities.Ingredientes.Subcategoria;
import main.entities.Productos.Imagenes;
import main.repositories.CategoriaRepository;
import main.repositories.ImagenesRepository;
import main.repositories.SubcategoriaRepository;
import main.repositories.SucursalRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.File;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@RestController
public class CategoriaController {
    private final CategoriaRepository categoriaRepository;
    private final SubcategoriaRepository subcategoriaRepository;
    private final SucursalRepository sucursalRepository;
    private final ImagenesRepository imagenesRepository;

    public CategoriaController(CategoriaRepository categoriaRepository, SubcategoriaRepository subcategoriaRepository, SucursalRepository sucursalRepository, ImagenesRepository imagenesRepository) {
        this.categoriaRepository = categoriaRepository;
        this.subcategoriaRepository = subcategoriaRepository;
        this.sucursalRepository = sucursalRepository;
        this.imagenesRepository = imagenesRepository;
    }


    @CrossOrigin
    @GetMapping("/categorias/{idSucursal}")
    public Set<Categoria> getCategorias(@PathVariable("idSucursal") Long idSucursal) {
        List<Categoria> categorias = categoriaRepository.findAllByIdSucursal(idSucursal);

        for (Categoria Categoria : categorias) {
            Categoria.setSubcategorias(new HashSet<>(subcategoriaRepository.findAllByIdCategoria(Categoria.getId())));
        }

        return new HashSet<>(categorias);
    }

    @CrossOrigin
    @Transactional
    @PostMapping("/categoria/create/{idSucursal}")
    public ResponseEntity<String> crearCategoria(@RequestBody Categoria categoriaDetails, @PathVariable("idSucursal") Long idSucursal) {
        // Busco el categoria en la base de datos
        Optional<Categoria> categoriaDB = categoriaRepository.findByNameAndIdSucursal(categoriaDetails.getNombre(), idSucursal);

        if (categoriaDB.isEmpty()) {
            categoriaDetails.getSucursales().add(sucursalRepository.findById(idSucursal).get());

            categoriaRepository.save(categoriaDetails);

            return new ResponseEntity<>("El categoria ha sido añadido correctamente", HttpStatus.CREATED);
        }

        return ResponseEntity.badRequest().body("Hay una categoria existente con ese nombre");
    }

    @CrossOrigin
    @Transactional
    @PostMapping("/categoria/imagenes/{idSucursal}")
    public ResponseEntity<String> crearImagenSucursal(@RequestParam("file") MultipartFile file, @RequestParam("nombreCategoria") String nombreCategoria, @PathVariable("idSucursal") Long idSucursal) {
        HashSet<Imagenes> listaImagenes = new HashSet<>();
        // Buscamos el nombre de la foto
        String fileName = file.getOriginalFilename().replaceAll(" ", "");
        try {
            String basePath = new File("").getAbsolutePath();
            String rutaCarpeta = basePath + File.separator + "src" + File.separator + "main" + File.separator + "webapp" + File.separator + "WEB-INF" + File.separator + "imagesCategoria" + File.separator + nombreCategoria.replaceAll(" ", "") + File.separator;

            // Verificar si la carpeta existe, caso contrario, crearla
            File carpeta = new File(rutaCarpeta);
            if (!carpeta.exists()) {
                carpeta.mkdirs();
            }

            String rutaArchivo = rutaCarpeta + fileName;
            file.transferTo(new File(rutaArchivo));

            String downloadUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("imagesCategoria/")
                    .path(nombreCategoria.replaceAll(" ", "") + "/")
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
                    Optional<Categoria> categoria = categoriaRepository.findByNameAndIdSucursal(nombreCategoria, idSucursal);
                    if (categoria.isEmpty()) {
                        return new ResponseEntity<>("sucursal vacio", HttpStatus.NOT_FOUND);
                    }
                    imagenProducto.setCategoria(categoria.get());
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

    @CrossOrigin
    @Transactional
    @PutMapping("/categoria/imagen/{id}/delete")
    public ResponseEntity<String> eliminarImagenSucursal(@PathVariable("id") Long id) {
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

    @CrossOrigin
    @PutMapping("/categoria/update/{idSucursal}")
    public ResponseEntity<String> actualizarCategoria(@RequestBody Categoria categoria, @PathVariable("idSucursal") Long idSucursal) {
        Optional<Categoria> categoriaDB = categoriaRepository.findByIdCategoriaAndIdSucursal(categoria.getId(), idSucursal);

        if (categoriaDB.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("La categoria no existe");
        } else {
            Optional<Categoria> categoriaEncontrada = categoriaRepository.findByNameAndIdSucursal(categoria.getNombre(), idSucursal);

            if (categoriaEncontrada.isPresent() && categoriaEncontrada.get().getId() != categoriaDB.get().getId()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Existe una categoría con ese nombre");
            }

            categoriaDB.get().setNombre(categoria.getNombre());

            categoriaDB.get().setBorrado(categoria.getBorrado());

            // Creación de subcategorias
            for (Subcategoria subcategoria : categoria.getSubcategorias()) {
                subcategoriaRepository.deleteById(subcategoria.getId());
                subcategoria.setCategoria(categoriaDB.get());
                subcategoria.getSucursales().add(sucursalRepository.findById(idSucursal).get());
            }

            categoriaDB.get().setSubcategorias(categoria.getSubcategorias());

            categoriaRepository.save(categoriaDB.get());
            return ResponseEntity.ok("Categoria actualizada correctamente");
        }
    }
}
