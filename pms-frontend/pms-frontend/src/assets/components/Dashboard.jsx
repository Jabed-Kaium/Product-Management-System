import ReactPaginate from "react-paginate";
import { useContext, useEffect, useState } from "react";
import Axios from "../api/Axios";
import UserContext from "../context/UserContext";

//URL for backend endpoints
const ADD_PRODUCT_URL = '/products/add-product';
const UPDATE_PRODUCT_URL = '/products/update';
const DELETE_PRODUCT_URL = '/products/delete';
const GET_PRODUCT_URL = '/products/all'
const GET_PRODUCT_WITH_PAGINATION = '/products/result';
const FILTER_SORT_URL = '/products/result/filter';

const Dashboard = () => {

    //destructure token from user context
    const {token} = useContext(UserContext);

    //number of data shows on a page in pagination
    let limit = 10;

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
        {value: 'quantity', text: "Quantity"}
    ];

    //product details state
    const [id, setId] = useState();
    const [name, setName] = useState("");
    const [catagory, setCatagory] = useState(productOptions[0].value);
    const [quantity, setQuantity] = useState(0);
    const [price, setPrice] = useState(0);
    const [file, setFile] = useState();

    //state to store all products
    const [products, setProducts] = useState([]);

    //state to count total products by catagory
    const [beverageCount, setBeverageCount] = useState(0);
    const [groceryCount, setGroceryCount] = useState(0);
    const [electronicsCount, setElectronincsCount] = useState(0);
    const [otherCount, setOtherCount] = useState(0);

    //state for filtering and sorting
    const [filterKey, setFilterKey] = useState("");
    const [sortKey, setSortKey] = useState("");

    //render at app starts, renders when products state changes
    useEffect(() => {
        loadAllProduct();
        loadProductsWithPagination();
    }, []);

    //function for load all products
    const loadAllProduct = async () => {
        const response = await Axios.get(GET_PRODUCT_URL);

        //console.log(response.data);

        const productData = response.data;

        //calculate count of products by catagory
        const beverageCount = productData.filter((item)=>item.catagory === 'beverage').length;
        const groceryCount = productData.filter((item)=>item.catagory === 'grocery').length;
        const electronicsCount = productData.filter((item)=>item.catagory === 'electronics').length;
        const otherCount = productData.filter((item)=>item.catagory === 'other').length;

        //set count of products by catagory
        setBeverageCount(beverageCount);
        setGroceryCount(groceryCount);
        setElectronincsCount(electronicsCount);
        setOtherCount(otherCount);
    }

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

    //function for set product catagory
    const changeCatagory = (e) => {
        e.preventDefault();

        setCatagory(e.target.value);

        //console.log(catagory);
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

        console.log(response.data);

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

    //function for handle submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        //form data for product details
        const formData = new FormData();
        
        formData.append('name', name);
        formData.append('catagory', catagory);
        formData.append('quantity', quantity);
        formData.append('price', price);
        formData.append('image', file);

        // console.log(obj);
        // console.log(file);

        // API for add product
        const response = await Axios.post(ADD_PRODUCT_URL, formData, {
            'headers': {
                'Authorization': 'Bearer ' + token
            }
        });

        //console.log(response);

        //loadProducts();

        //reload current page
        window.location.reload();

    }

    //function for handle update
    const handleUpdate = async (e) => {
        e.preventDefault();

        //form data for product details
        const formData = new FormData();
        
        formData.append('id', id);
        formData.append('name', name);
        formData.append('catagory', catagory);
        formData.append('quantity', quantity);
        formData.append('price', price);
        formData.append('image', file);

        // console.log(obj);
        // console.log(file);

        // API for update product
        const response = await Axios.put(UPDATE_PRODUCT_URL, formData, {
            'headers': {
                'Authorization': 'Bearer ' + token
            }
        });

        //loadProducts();

        //console.log(response);

        //reload current page
        window.location.reload();

    }

    // function for handle delete
    const handleDelete = async (id) => {
        const response = await Axios.delete(DELETE_PRODUCT_URL + `/${id}`, {
            'headers': {
                'Authorization': 'Bearer ' + token
            }
        });

        //console.log(response);

        //reload current page
        window.location.reload();

    }

    // load product data in update modal
    const loadProductData = (productId, productName, productPrice, productQuantity, productCatagory) => {
        setId(productId);
        setName(productName);
        setPrice(productPrice);
        setQuantity(productQuantity);
        setCatagory(productCatagory);
    }

    return (
        <section>
            <div className="container mt-4">
                <h2>Admin Dashboard</h2>

                {/********* display product count *********/}
                <div className="row">
                    {
                        productOptions.map((product, index) => {
                            if(product.value != 'n/a') {
                                return (
                                    <div className="col" key={index}>
                                        <div className="card mx-2 my-2 shadow">
                                            <div className={
                                                index%4 == 0
                                                ?
                                                "card-body bg-danger"
                                                :
                                                    index%3 == 0
                                                    ?
                                                    "card-body bg-warning"
                                                    :
                                                        index%2 == 0
                                                        ?
                                                        "card-body bg-success"
                                                        :
                                                        "card-body bg-primary"
                                            }>
                                                <h4>{product.text}</h4>
                                                {
                                                    product.value === "beverage"
                                                    ? <h2>{beverageCount}</h2>
                                                    : product.value === "grocery"
                                                    ? <h2>{groceryCount}</h2>
                                                    : product.value === "electronics"
                                                    ? <h2>{electronicsCount}</h2>
                                                    : <h2>{otherCount}</h2>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        })
                    }
                </div>

                <hr />

                {/* add product button (modal) */}
                <div className="d-flex justify-content-between">
                    {/*********** add product form ***********/}
                    <div className="add-product-modal">
                        {/* Button trigger modal */}
                        <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                        Add Product
                        </button>

                        {/* Modal */}
                        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel">Add Product</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmit}>
                                    <label htmlFor="productName">Product Name</label>
                                    <input 
                                        type="text"
                                        id="productName"
                                        className="form-control"
                                        onChange={(e)=>setName(e.target.value)}
                                        required
                                        value={name}    
                                    />

                                    <label htmlFor="productCatagory">Product Catagory</label>
                                    <select className="form-select" id="productCatagory" aria-label="Default select example" value={catagory} onChange={changeCatagory}>
                                        {productOptions.map((option, index) => {
                                            return (
                                                <option key={index} value={option.value}>
                                                    {option.text}
                                                </option>
                                            )
                                        })}
                                    </select>

                                    <label htmlFor="productQuantity">Quantity</label>
                                    <input 
                                        type="number"
                                        id="productQuantity"
                                        className="form-control"
                                        onChange={(e)=>setQuantity(e.target.value)}
                                        required
                                        value={quantity}    
                                    />

                                    <label htmlFor="productPrice">Price</label>
                                    <input 
                                        type="number"
                                        id="productPrice"
                                        className="form-control"
                                        onChange={(e)=>setPrice(e.target.value)}
                                        required
                                        value={price}    
                                    />

                                    <label htmlFor="productFile">Select image</label>
                                    <input 
                                        type="file"
                                        id="productFile"
                                        className="form-control"
                                        onChange={(e)=>setFile(e.target.files[0])}
                                        required
                                    />

                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                        <button type="submit" className="btn btn-primary">Save changes</button>
                                    </div>
                                </form>
                            </div>
                            </div>
                        </div>
                        </div>
                    </div>

                    {/*********** filter and sort product form ***********/}
                    <div className="filter-sort-product">
                        <form className="d-flex column-gap-3" onSubmit={handleFilterAndSort}>
                            <select className="form-select" id="filterKey" aria-label="Default select example" value={filterKey} onChange={changeFilterKey}>
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

                            <select className="form-select" id="sortKey" aria-label="Default select example" value={sortKey} onChange={changeSortKey}>
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
                </div>

                <hr />

                {/************* product table ******************/}
                <table className="table">
                    <thead className="table-light">
                        <tr>
                        <th scope="col">#</th>
                        <th scope="col">Image</th>
                        <th scope="col">Name</th>
                        <th scope="col">Price</th>
                        <th scope="col">Quantity</th>
                        <th scope="col">Catagory</th>
                        <th scope="col">Image Name</th>
                        <th scope="col">Change Product</th>
                        <th scope="col">Delete Product</th>
                        </tr>
                    </thead>
                    <tbody className="table-group-divider">
                        {products.map((product, index)=>{
                            return (
                                <>
                                    <tr key={index}>
                                        <th scope="row">{index+1}</th>
                                        <td>
                                            <img src={'data:image/jpeg;base64,' + product.image} alt="product image" width="100rem" />
                                        </td>
                                        <td>{product.name}</td>
                                        <td>{product.price}</td>
                                        <td>{product.quantity}</td>
                                        <td>{product.catagory}</td>
                                        <td>{product.imageName}</td>
                                        
                                        {/********* Update product button (modal) ********/}
                                        <div className="update-product-modal">
                                            {/* Button trigger modal */}
                                            <button type="button" onClick={()=>{loadProductData(product.id, product.name, product.price, product.quantity, product.catagory)}} className="btn btn-warning" data-bs-toggle="modal" data-bs-target="#updateProductModal">
                                            Change
                                            </button>

                                            {/* Modal */}
                                            <div className="modal fade" id="updateProductModal" tabIndex="-1" aria-labelledby="updateProductModalLabel" aria-hidden="true">
                                            <div className="modal-dialog">
                                                <div className="modal-content">
                                                <div className="modal-header">
                                                    <h1 className="modal-title fs-5" id="updateProductModalLabel">Update Product</h1>
                                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                </div>
                                                <div className="modal-body">
                                                    <form onSubmit={handleUpdate}>
                                                        <label htmlFor="productName1">Product Name</label>
                                                        <input 
                                                            type="text"
                                                            id="productName1"
                                                            className="form-control"
                                                            onChange={(e)=>setName(e.target.value)}
                                                            required
                                                            value={name}    
                                                        />

                                                        <label htmlFor="productCatagory1">Product Catagory</label>
                                                        <select className="form-select" id="productCatagory1" aria-label="Default select example" value={catagory} onChange={changeCatagory}>
                                                            {productOptions.map((option, index) => {
                                                                return (
                                                                    <option key={index} value={option.value}>
                                                                        {option.text}
                                                                    </option>
                                                                )
                                                            })}
                                                        </select>

                                                        <label htmlFor="productQuantity1">Quantity</label>
                                                        <input 
                                                            type="number"
                                                            id="productQuantity1"
                                                            className="form-control"
                                                            onChange={(e)=>setQuantity(e.target.value)}
                                                            required
                                                            value={quantity}    
                                                        />

                                                        <label htmlFor="productPrice1">Price</label>
                                                        <input 
                                                            type="number"
                                                            id="productPrice1"
                                                            className="form-control"
                                                            onChange={(e)=>setPrice(e.target.value)}
                                                            required
                                                            value={price}    
                                                        />

                                                        <label htmlFor="productFile1">Select image</label>
                                                        <input 
                                                            type="file"
                                                            id="productFile1"
                                                            className="form-control"
                                                            onChange={(e)=>setFile(e.target.files[0])}
                                                            required
                                                        />

                                                        <div className="modal-footer">
                                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                            <button type="submit" className="btn btn-primary">Save changes</button>
                                                        </div>
                                                    </form>
                                                </div>
                                                </div>
                                            </div>
                                            </div>
                                        </div>
                                        
                                        {/************ Delete product button **********/}
                                        <td> <button className="btn btn-danger" onClick={()=>handleDelete(product.id)}>Delete</button> </td>
                                    </tr>
                                </>
                            )
                        })}
                    </tbody>
                </table>
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

export default Dashboard;