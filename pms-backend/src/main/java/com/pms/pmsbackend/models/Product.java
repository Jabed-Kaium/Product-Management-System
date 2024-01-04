package com.pms.pmsbackend.models;

import jakarta.persistence.*;
import lombok.Data;

import java.io.File;

@Entity
@Data
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;
    private String name;
    private String catagory;
    private int quantity;
    private int price;
    private String imageName;
    @Lob
    private byte[] image;
}
