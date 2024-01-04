package com.pms.pmsbackend.services;

import com.pms.pmsbackend.filter.FilterSearchDao;
import com.pms.pmsbackend.filter.SearchRequest;
import com.pms.pmsbackend.models.Product;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

@Service
@Transactional
public class FindByAllCriteria {
    @Autowired
    private FilterSearchDao filterSearchDao;
    public Page<Product> findAllByPaginationFilteringSorting(int pageNo, int limit, String catagory, String key) {

        SearchRequest searchRequest = new SearchRequest();
        searchRequest.setCatagory(catagory);

        //get a list with filtered data
        List<Product> productList = filterSearchDao.findAllByCriteria(searchRequest);

        //sort the list based on a field
        switch (key) {
            case "name":
                productList.sort(Comparator.comparing(Product::getName));
                break;
            case "price":
                productList.sort(Comparator.comparing(Product::getPrice));
                break;
            case "quantity":
                productList.sort(Comparator.comparing(Product::getQuantity));
                break;

            default:
                productList.sort(Comparator.comparing(Product::getId));
        }

        //create a page of product with pageNo and limit for filtered and sorted data
        Pageable page = PageRequest.of(pageNo, limit);
        int start = (int) page.getOffset();
        int end = Math.min((start + page.getPageSize()), productList.size());

        List<Product> pageContent = productList.subList(start, end);

        return new PageImpl<>(pageContent, page, productList.size());
    }
}
