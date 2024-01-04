package com.pms.pmsbackend.services;

import com.pms.pmsbackend.models.Product;
import com.pms.pmsbackend.models.ProductDTO;
import com.pms.pmsbackend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.Base64;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    //directory for uploaded images
    //public static String uploadDirectory = System.getProperty("user.dir") + "/src/main/resources/static/product-images";

    /*********** save product to DB with image ***********/
    public Product saveProduct(ProductDTO productDto, MultipartFile imageFile) {
        Product newProduct = new Product();
        newProduct.setName(productDto.getName());
        newProduct.setCatagory(productDto.getCatagory());
        newProduct.setQuantity(productDto.getQuantity());
        newProduct.setPrice(productDto.getPrice());
        newProduct.setImageName(imageFile.getOriginalFilename());

        try {
            newProduct.setImage(imageFile.getBytes());
        } catch (Exception e) {
            e.printStackTrace();
        }

        return productRepository.save(newProduct);
    }

      /******* save product with image saved to directory *******/
//    public void saveProduct(ProductDTO productDto, MultipartFile imageFile) {
//        Product newProduct = new Product();
//        newProduct.setName(productDto.getName());
//        newProduct.setCatagory(productDto.getCatagory());
//        newProduct.setQuantity(productDto.getQuantity());
//        newProduct.setPrice(productDto.getPrice());
//        newProduct.setImageName(imageFile.getOriginalFilename());
//
//        Product uploadedProduct = productRepository.save(newProduct);
//
//        if(uploadedProduct != null) {
//            try {
//
//                //upload image to directory
//                String originalFileName = imageFile.getOriginalFilename();
//                Path fileNameAndPath = Paths.get(uploadDirectory, originalFileName);
//                Files.write(fileNameAndPath, imageFile.getBytes());
//
//            } catch (Exception e) {
//                e.printStackTrace();
//            }
//        }
//    }

    /********** get all products **********/
    public List<Product> getAllProducts() {
        List<Product> products = productRepository.findAll();
        return products;
    }

    /********** get product with pagination **********/
    public Page<Product> getProductWithPagination(int pageNumber, int pageSize) {
        Pageable page = PageRequest.of(pageNumber, pageSize);
        Page<Product> pageProduct = productRepository.findAll(page);
//        List<Product> products = pageProduct.getContent();
        return pageProduct;
    }

    /*********** update product to DB with image ***********/
    public Product updateProduct(int id, ProductDTO productDto, MultipartFile imageFile) {

        Product product = productRepository.findById(id).get();

        product.setName(productDto.getName());
        product.setCatagory(productDto.getCatagory());
        product.setQuantity(productDto.getQuantity());
        product.setPrice(productDto.getPrice());
        product.setImageName(imageFile.getOriginalFilename());

        try {
            product.setImage(imageFile.getBytes());
        } catch (Exception e) {
            e.printStackTrace();
        }

        return productRepository.save(product);
    }

    //delete product
    public Boolean deleteProduct(int id) {

        Optional<Product> product = productRepository.findById(id);

        if(product.isEmpty()) {
            return false;
        } else {
            productRepository.deleteById(id);
            return true;
        }
    }

}
