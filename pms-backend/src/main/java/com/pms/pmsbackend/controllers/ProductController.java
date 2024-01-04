package com.pms.pmsbackend.controllers;

import com.pms.pmsbackend.models.Product;
import com.pms.pmsbackend.models.ProductDTO;
import com.pms.pmsbackend.repository.ProductRepository;
import com.pms.pmsbackend.services.FindByAllCriteria;
import com.pms.pmsbackend.services.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/products")
@CrossOrigin("http://localhost:5173")
public class ProductController {

    //directory for uploaded images
    //public static String uploadDirectory = System.getProperty("user.dir") + "/src/main/resources/static/product-images";

    @Autowired
    private ProductService productService;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private FindByAllCriteria findByAllCriteria;

    //endpoint for adding product to DB
    @PostMapping("/add-product")
    public Product addProduct(@ModelAttribute ProductDTO productDto, @RequestParam("image") MultipartFile imageFile) {
        return productService.saveProduct(productDto, imageFile);
    }

    //get all products
    @GetMapping("/all")
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    //get data with pagination
    @GetMapping("/result")
    public ResponseEntity<List<Product>> getProductWithPagination(
            @RequestParam(value = "page", defaultValue = "0", required = false) int pageNo,
            @RequestParam(value = "limit", defaultValue = "10", required = false) int limit
    ) {

        Page<Product> productPage = productService.getProductWithPagination(pageNo, limit);

        //adding http header for getting total item count
        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.set("Access-Control-Expose-Headers", "x-total-count");
        responseHeaders.set("x-total-count", String.valueOf(productPage.getTotalElements()));

        //convert page to list item
        List<Product> products = productPage.getContent();

        return new ResponseEntity<>(products, responseHeaders, HttpStatus.OK);
    }

    //get products with pagination, filtering and sorting together
    @GetMapping("/result/filter")
    public ResponseEntity<List<Product>> getResultWithPaginationFilteringSorting(
            @RequestParam(value = "page", defaultValue = "0", required = false) int pageNo,
            @RequestParam(value = "limit", defaultValue = "10", required = false) int limit,
            @RequestParam(value = "catagory") String catagory,
            @RequestParam(value = "key") String key
    ) {

        Page<Product> productPage = findByAllCriteria.findAllByPaginationFilteringSorting(pageNo, limit, catagory, key);

        //adding http header for getting total item count
        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.set("Access-Control-Expose-Headers", "x-total-count");
        responseHeaders.set("x-total-count", String.valueOf(productPage.getTotalElements()));

        //convert page to list item
        List<Product> products = productPage.getContent();

        return new ResponseEntity<>(products, responseHeaders, HttpStatus.OK);
    }

    //update product
    @PutMapping("/update")
    public Product updateProduct(@RequestParam("id") int id, @ModelAttribute ProductDTO productDto, @RequestParam("image") MultipartFile imageFile) {
        return productService.updateProduct(id, productDto, imageFile);
    }

    //delete product
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable("id") int id) {
        Boolean response = productService.deleteProduct(id);

        if(!response) {
            return new ResponseEntity<>("Product not found.", HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<>("Product deleted successfully.", HttpStatus.OK);
        }
    }

}
