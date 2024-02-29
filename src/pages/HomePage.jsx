import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import filter_data from '../data/filter.json';
import PaginationComponent from '../layout/PaginationComponent';

function HomePage() {
    let loaderCount = (Array.from({ length: 3 }, (_, index) => index + 1)); //this is for react-loading-skeleton show noof rows the loder boxes will come
    const [foodItems, setFoodItems] = useState([])  // This is for all the food items
    const [filteredFoodItems, setFilteredFoodItems] = useState([])
    const [spinner, showSpinner] = useState(false) //This is loader until the content is come from api and set in to it
    const [modal, showModal] = useState(false)  //For Show model on click on food item
    const [itemDetails, setItemDetails] = useState({}) //on click on food item setting the data in this state
    const [modalSpinner, showModalSpinner] = useState(false) //After click on food Item for that particuler food calling API until the data comes need to show spinner in the Model
    const [filters, setFilter] = useState([]) //For filters
    const [allContent, showAllContent] = useState(false) // In the model detail section to show the full content and hide the content accordingly
    const [areas, setAreas] = useState([]) // List of areas to filter
    const [key, setKey] = useState(Math.random()) //to render the some jsx properly

    // PAGINATION ELEMENTS
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;
    const [startIndex, setStartIndex] = useState(0)
    let itemsToMap = (filteredFoodItems?.length === 0 || filters?.length === 0) ? foodItems : filteredFoodItems;
    const endIndex = Math.min(startIndex + itemsPerPage, itemsToMap.length);  //for some areas items length < itemsPerPage

    useEffect(() => {
        handleGetfoodItems() //To get the all data
        handleGetArea() //To get all the areas from API to show the filter by area dropdown
    }, [])

    useEffect(() => {
        setStartIndex((currentPage - 1) * itemsPerPage);
    }, [currentPage, filteredFoodItems, itemsPerPage]);

    useEffect(() => {
        if (startIndex >= endIndex) {
            setStartIndex(Math.max(0, endIndex - itemsPerPage));
        }
    }, [startIndex, endIndex]);

    const handleGetfoodItems = async () => {
        showSpinner(true)
        try {
            const food = await axios.get('https://www.themealdb.com/api/json/v1/1/search.php?s=')
            food?.data?.meals.forEach(item => {
                item.rating = `${(Math.random() * (5 - 3) + 3).toFixed(1)}`
                item.time = `${(Math.random() * (50 - 30) + 30).toFixed(0)}`
            });
            setFoodItems(food?.data?.meals)
            showSpinner(false)
        } catch (err) {
            console.log(err)
            showSpinner(false);
        }
    }

    const handleGetArea = async () => {
        try {
            const areaCategories = await axios.get('https://www.themealdb.com/api/json/v1/1/list.php?a=list')
            setAreas(areaCategories?.data?.meals)
        } catch (err) {
            console.log(err)
        }
    }

    const InlineWrapperWithMargin = ({ children }) => {
        return <span className='mx-3'>{children}</span>
    }

    const handleApplyFilter = async (filteredData) => {
        setKey(Math.random())
        let updateData = filters;
        let sortedArray = [];
        if (filteredData?.name) {
            showSpinner(true)
            // SETTING THE FILTER ACCORDING TO THE CONDITIONS
            if (filteredData?.name === 'Sort By Name') {
                if (!updateData.some(item => item?.name === 'Sort By Name')) {
                    updateData.push(filteredData);
                } else {
                    updateData = updateData.filter(item => item?.name !== 'Sort By Name');
                }
            }

            if (filteredData?.name === 'Filter By Area') {
                if (!filters?.some(item => item?.name === 'Filter By Area')) {
                    // area is not there then creating one
                    let temp = [...updateData]
                    temp.push(filteredData)
                    updateData = temp
                } if (filters?.some(item => item?.name === 'Filter By Area') && !filters?.some(item => item?.strArea === filteredData?.strArea)) {
                    // area is there but not same
                    let temp = [...updateData]
                    let index = temp?.findIndex(item => item?.name === 'Filter By Area')
                    temp[index] = filteredData;
                    updateData = temp
                } if (filters?.some(item => item?.name === 'Filter By Area') && filters?.some(item => item?.strArea === filteredData?.strArea)) {
                    // area is there and area_name is also same with selected one then removing 
                    let temp = [...updateData]
                    temp = temp?.filter(item => item?.name !== 'Filter By Area')
                    updateData = temp
                }
            }

            //CHECKING AND UPDATING THE FILTERED_ITEMS_ARRAY ACCORDING TO THE CONDITIONS
            if (updateData?.some(item => item?.name === 'Filter By Area') && !updateData?.some(item => item?.name === 'Sort By Name')) {
                const areaFilterItems = await axios.get(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${updateData?.find(item => item?.name === 'Filter By Area')?.strArea}`);
                areaFilterItems?.data?.meals.forEach(item => {
                    item.rating = `${(Math.random() * (5 - 3) + 3).toFixed(1)}`;
                    item.time = `${(Math.random() * (50 - 30) + 30).toFixed(0)}`;
                });
                sortedArray = areaFilterItems?.data?.meals;
            } else if (updateData?.some(item => item?.name === 'Sort By Name') && !updateData?.some(item => item?.name === 'Filter By Area')) {
                const applySortArray = foodItems.slice().sort((a, b) => {
                    const nameA = a.strMeal.toUpperCase().replace(/&/g, '');
                    const nameB = b.strMeal.toUpperCase().replace(/&/g, '');
                    return nameA.localeCompare(nameB);
                });
                sortedArray = applySortArray;
            } else if (updateData?.some(item => item?.name === 'Sort By Name') && updateData?.some(item => item?.name === 'Filter By Area')) {
                const areaFilterItems = await axios.get(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${updateData?.find(item => item?.name === 'Filter By Area')?.strArea}`);
                areaFilterItems?.data?.meals.forEach(item => {
                    item.rating = `${(Math.random() * (5 - 3) + 3).toFixed(1)}`;  // Adding random ratings to the response
                    item.time = `${(Math.random() * (50 - 30) + 30).toFixed(0)}`; // Adding random time to the response
                });
                const applySortArray = areaFilterItems?.data?.meals.slice().sort((a, b) => {
                    const nameA = a.strMeal.toUpperCase().replace(/&/g, '');
                    const nameB = b.strMeal.toUpperCase().replace(/&/g, '');
                    return nameA.localeCompare(nameB); // checks if nameA > nameB
                });
                sortedArray = applySortArray;
            } else {
                handleGetfoodItems()
            }

        }
        setFilteredFoodItems(sortedArray);
        setFilter(updateData);
        showSpinner(false)
    };


    const handleShowModal = async (data) => {
        showModal(true)
        showModalSpinner(true)
        try {
            setItemDetails([])
            const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${data?.idMeal}`)  // Item details API
            setItemDetails(response?.data?.meals[0])
            showModalSpinner(false)
        } catch (err) {
            console.log(err)
            showModalSpinner(false)
        }
    }

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <section className='my-5 container'>
            {
                spinner ?
                    // for Loader
                    <div className='mt-7'>
                        {/* Since it's small project I am adding the loader element in same file or else
                            We could create another component and can use in multiple times in multiple components */}
                        <SkeletonTheme>
                            <Skeleton count={1}
                                wrapper={InlineWrapperWithMargin}
                                inline
                                width={800}
                            />
                        </SkeletonTheme><br /><br />
                        <SkeletonTheme>
                            <Skeleton count={8}
                                wrapper={InlineWrapperWithMargin}
                                inline
                                width={100}
                            />
                        </SkeletonTheme>
                        {loaderCount?.map((_, index) =>
                            <div className='my-4' key={index}>
                                <SkeletonTheme>
                                    <Skeleton count={4}
                                        wrapper={InlineWrapperWithMargin}
                                        inline
                                        width={251}
                                        height={280}
                                    />
                                </SkeletonTheme>
                            </div>
                        )}
                    </div>
                    :
                    // Main UI
                    <section className=' mt-7'>
                        <div key={key}>
                            <h1>Restaurants with online food delivery</h1>
                            {/* FILTER SECTION */}
                            <div className='d-flex flex-wrap gap-2 justify-content-start'>
                                <div className='dropdown'>
                                    <button className={`btn cursor-pointer p-2 filter-shadow filter-border border px-3`} type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                                        {filters?.length > 0 && <span className='px-2 border rounded-circle bg-success'>{filters?.length}</span>} Filter <i className='fe fe-filter' />
                                    </button>
                                    <ul className="dropdown-menu p-0 m-0" aria-labelledby="dropdownMenuButton">
                                        {filters?.length > 0 ?
                                            <>
                                                {filters.map((filter, index) => (
                                                    <li key={index} className="dropdown-item py-1 ps-2 m-0">
                                                        <span className='cursor-pointer'>{filter.name}</span>
                                                    </li>
                                                ))}
                                                <hr className='mt-1 mb-0' />
                                                <li className="dropdown-item ps-2">
                                                    <span className='cursor-pointer' onClick={() => { setFilter([]); handleGetfoodItems() }}>Clear Filters</span>
                                                </li>
                                            </>
                                            :
                                            <li className="dropdown-item ps-3">
                                                <span className='cursor-pointer text-dark'>No Filters</span>
                                            </li>}
                                    </ul>
                                </div>

                                {filter_data?.map((data, index) => (
                                    <div className="dropdown" key={index}>
                                        <div
                                            className={`cursor-pointer p-2 filter-shadow filter-border border px-3 ${data?.dropdown ? 'dropdown-toggle' : ''} ${filters.some(item => item?.name === data?.name) ? 'bg-light' : ''}`}
                                            data-bs-toggle={data?.dropdown ? 'dropdown' : ''}
                                            onClick={() => !data?.dropdown && handleApplyFilter(data)} // Add onClick event handler here
                                        >
                                            <span>
                                                {
                                                    data?.name === 'Filter By Area' ?
                                                        <>{filters?.some(item => item?.name === 'Filter By Area') ? filters?.find(item => item?.name === 'Filter By Area')?.strArea : 'Filter By Area'}</> :
                                                        <>
                                                            {data?.name + ' '}
                                                            {filters.some(item => item?.name === data?.name) && <b>X</b>}
                                                        </>
                                                }
                                            </span>
                                        </div>

                                        {data?.dropdown &&
                                            <div className="dropdown-menu p-0 pt-3 pb-3">
                                                {areas?.map((item, index) => (
                                                    <div className="dropdown-column" key={index}>
                                                        <span className='ps-3 mt-4 cursor-pointer' onClick={() => handleApplyFilter({ ...item, "name": "Filter By Area" })}>{item?.strArea}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        }
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="row">
                            {
                                itemsToMap?.slice(startIndex, endIndex)?.map((data, index) => (
                                    // Food Items Section (Data Grid):
                                    <div className="col-lg-3 col-md-6 mt-3" onClick={() => handleShowModal(data)} key={index}>
                                        <div className="card p-0 m-0 card-body card-shadow">
                                            <img
                                                src={data?.strMealThumb}
                                                className="rounded cursor-pointer"
                                                alt={data?.strMealThumb}
                                                height={200}
                                            />
                                        </div>
                                        <div>
                                            <div className='mt-2 p-0 cursor-pointer' title={data?.strMeal}>
                                                <h3 className='mb-1'>{data?.strMeal.length > 20 ? `${data?.strMeal.slice(0, 20)}...` : data?.strMeal}</h3>
                                            </div>
                                            <h3 className='m-0 p-0 d-flex gap-2 align-items-center'>
                                                <div className='rounded-circle bg-success'>
                                                    <div className='px-1'>
                                                        <i className='fe fe-star' />
                                                    </div>
                                                </div>
                                                <span>
                                                    {data?.rating} - {data?.time} mins
                                                </span>
                                            </h3>
                                            <p className='mb-4'>
                                                {data?.strCategory} {data?.strTags} {data?.strMeal}
                                            </p>
                                        </div>
                                    </div>

                                ))
                            }
                        </div>
                        {/* PAGINATION */}
                        <PaginationComponent
                            itemsPerPage={itemsPerPage}
                            totalItems={itemsToMap.length}
                            onPageChange={handlePageChange}
                        />
                    </section>
            }
            <Modal show={modal} onHide={() => showModal(false)}>
                <Modal.Body>
                    <div className='text-end mb-3'>
                        <span><button type='button' onClick={() => showModal(false)} className='btn btn-sm btn-outline-danger'>Close</button></span>
                    </div>
                    {modalSpinner ?
                        <div className=''>
                            <div className='my-4 row'>
                                {/* Since it's small project I am adding the loader element in same file or else
                                    We could create another component and can use in multiple times in multiple components */}
                                <SkeletonTheme>
                                    <Skeleton count={1}
                                        wrapper={InlineWrapperWithMargin}
                                        inline
                                        height={300}
                                        width={530}
                                    />
                                </SkeletonTheme>
                                <SkeletonTheme>
                                    <Skeleton count={1}
                                        wrapper={InlineWrapperWithMargin}
                                        inline
                                        width={200}
                                    />
                                </SkeletonTheme>
                                <SkeletonTheme>
                                    <Skeleton count={5}
                                        wrapper={InlineWrapperWithMargin}
                                        inline
                                        width={530}
                                    />
                                </SkeletonTheme>
                            </div>
                        </div> :
                        <div>
                            {itemDetails && Object.keys(itemDetails)?.length > 0 && (
                                <div>
                                    <div className='text-center'>
                                        <div className='row'>
                                            <img className='rounded' height={350} src={itemDetails?.strMealThumb} alt={itemDetails?.strMealThumb} />
                                        </div>
                                    </div>
                                    <div className='pt-3'>
                                        <h2 className='mb-2 p-0'>{itemDetails?.strMeal}, {itemDetails?.strTags}</h2>
                                        <p>
                                            <b>Details: </b>
                                            {
                                                itemDetails?.strInstructions?.length > 200 ?
                                                    <>
                                                        {allContent ? itemDetails?.strInstructions + ' ' : `${itemDetails?.strInstructions.slice(0, 200)}... `}
                                                        <u onClick={() => showAllContent(!allContent)} className='cursor-pointer text-primary'>
                                                            {allContent ? 'Hide' : 'Read more'}
                                                        </u>
                                                    </>
                                                    :
                                                    itemDetails?.strInstructions
                                            }
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    }
                </Modal.Body>
            </Modal>
        </section>
    )
}

export default HomePage