import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTag, faBagShopping } from "@fortawesome/free-solid-svg-icons";
import Axios from "../api/Axios";
import ReactPaginate from "react-paginate";

//URL for backend endpoints
const GET_PRODUCT_WITH_PAGINATION = '/products/result';
const FILTER_SORT_URL = '/products/result/filter';

const Products = () => {

    //number of data shows on a page in pagination
    let limit = 12;

    //for pagination
    const [pageCount, setPageCount] = useState(0);

    //options for product catagory
    const productOptions = [
        {value: 'n/a', text: 'Choose catagory'},
        {value: 'beverage', text: "Beverage"},
        {value: 'grocery', text: "Grocery"},
        {value: 'electronics', text: "Electronics"},
        {value: 'other', text: "Other"}
    ];

    //options for sorting
    const sortOptions = [
        {value: '', text: 'Sort by'},
        {value: 'name', text: "Name"},
        {value: 'price', text: "Price"},
    ];

    //state to store all products
    const [products, setProducts] = useState([]);

    //state for filtering and sorting
    const [filterKey, setFilterKey] = useState("");
    const [sortKey, setSortKey] = useState("");

    //render at app starts, renders when products state changes
    useEffect(() => {
        loadProductsWithPagination();
    }, []);

    //function for load products with pagination
    const loadProductsWithPagination = async () => {

        // get all product request
        const response = await Axios.get(GET_PRODUCT_WITH_PAGINATION + `?page=0&limit=${limit}`);

        //calculate total page count for all data 
        const totalPage = response.headers.get('x-total-count');
        //set total page count
        setPageCount(Math.ceil(totalPage / limit));
        
        setProducts(response.data);

        //console.log(response.data);
    }

    //function for set filter key
    const changeFilterKey = (e) => {
        e.preventDefault();

        setFilterKey(e.target.value);

        //console.log(filterKey);
    }

    //function for set sort key
    const changeSortKey = (e) => {
        e.preventDefault();

        setSortKey(e.target.value);

        //console.log(sortKey);
    }

    //function for handle filter and sort
    const handleFilterAndSort = async (e) => {

        e.preventDefault();
        
        const response = await Axios.get(FILTER_SORT_URL + `?page=0&limit=${limit}&catagory=${filterKey}&key=${sortKey}`);

        const totalPage = response.headers.get('x-total-count');

        setPageCount(Math.ceil(totalPage / limit));

        setProducts(response.data);

        //console.log(response.data);

    }

    //function for handle next click
    const handleNextClick = async (currentPage) => {
        
        const response = await Axios.get(FILTER_SORT_URL + `?page=${currentPage}&limit=${limit}&catagory=${filterKey}&key=${sortKey}`);

        // const totalPage = response.headers.get('x-total-count');

        // setPageCount(Math.ceil(totalPage / limit));

        setProducts(response.data);

        //console.log(response.data);

    }

    //handle page click
    const handlePageClick = (data) => {
        //console.log(data.selected);
        let currentPage = data.selected;
        //console.log(currentPage);
        handleNextClick(currentPage);
    }

    return (
        
        <section  className="container">
            <h1 className="text-center my-4">Available Products</h1>

            {/*********** filter and sort product form ***********/}
            <div className="filter-sort-product">
                <form className="d-flex justify-content-end column-gap-3" onSubmit={handleFilterAndSort}>
                    <select className="form-select" style={{width: "10rem"}} id="filterKey" aria-label="Default select example" value={filterKey} onChange={changeFilterKey}>
                        <option value="">Filter by</option>
                        {productOptions.map((option, index) => {
                            if(index > 0) {
                                return (
                                    <option key={index} value={option.value}>
                                        {option.text}
                                    </option>
                                )
                            }
                        })}
                    </select>

                    <select className="form-select" style={{width: "10rem"}} id="sortKey" aria-label="Default select example" value={sortKey} onChange={changeSortKey}>
                        {sortOptions.map((option, index) => {
                            return (
                                <option key={index} value={option.value}>
                                    {option.text}
                                </option>
                            )
                        })}
                    </select>

                    <button type="submit" className="btn btn-primary">Apply</button>
                </form>
            </div>

            <hr />

            {/* display products */}
            <div className="row">
                {
                    products.map((product, index) => {
                        return (
                            <div className="col-md-2 col-6 my-3" key={index}>
                                <div className="card text-center shadow" style={{width: "10rem"}}>
                                    <img src={'data:image/jpeg;base64,' + product.image} alt="product image" width="100%" />
                                    <div className="card-body">
                                        <h5 className="card-title">{product.name}</h5>
                                        <h6><FontAwesomeIcon icon={faBagShopping} /> {product.catagory.charAt(0).toUpperCase() + product.catagory.slice(1)}</h6>
                                        <h6><FontAwesomeIcon icon={faTag} /> {product.price}<strong>&#x9F3;</strong></h6>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>

            {/* for pagination */}
            <ReactPaginate
                previousLabel={'previous'}
                nextLabel={'next'}
                breakLabel={'...'}
                pageCount={pageCount}
                marginPagesDisplayed={1}
                onPageChange={handlePageClick}
                containerClassName={'pagination justify-content-center'}
                pageClassName={'page-item'}
                pageLinkClassName={'page-link'}
                previousClassName={'page-item'}
                previousLinkClassName={'page-link'}
                nextClassName={'page-item'}
                nextLinkClassName={'page-link'}
                breakClassName={'page-item'}
                breakLinkClassName={'page-link'}
                activeClassName={'active'}
            />
        </section>
    );
};

export default Products;