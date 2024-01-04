package com.pms.pmsbackend.filter;

import com.pms.pmsbackend.models.Product;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class FilterSearchDao {
    private final EntityManager entityManager;
    public List<Product> findAllByCriteria(SearchRequest request) {
        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        CriteriaQuery<Product> criteriaQuery = criteriaBuilder.createQuery(Product.class);

        //list to store all the WHERE condition
        List<Predicate> predicates = new ArrayList<>();

        //select * FROM product
        Root<Product> root = criteriaQuery.from(Product.class);

        //adding WHERE clause (i.e. SELECT * FROM products WHERE catagory like "%beverage%")
        if(request.getCatagory() != null) {
            Predicate catagoryPredicate = criteriaBuilder.like(root.get("catagory"), "%" + request.getCatagory() + "%");
            predicates.add(catagoryPredicate);
        }

        //wrap everything (i.e. SELECT * FROM products WHERE catagory like "%beverage%" AND (if there are more conditions))
        criteriaQuery.where(criteriaBuilder.and(predicates.toArray(new Predicate[0])));

        TypedQuery<Product> query = entityManager.createQuery(criteriaQuery);

        return query.getResultList();
    }
}
