import axios from "axios";
import { useEffect, useState } from "react";
import { useCategory, useFilter } from "../../context";
import Carousel from 'react-elastic-carousel';
import "./Categories.css";

export const Categories = () => {
  const [categories, setCategories] = useState([]);
  const { hotelCategory, setHotelCategory } = useCategory();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth <= 768);
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { filterDispatch } = useFilter();

  const handleFilterClick = () => {
    filterDispatch({
      type: "SHOW_FILTER_MODAL",
    });
  };

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(
          "https://travel-app-backend-zvzh.onrender.com/api/categories"
        );
        setCategories(data);
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  const handleCategoryClick = (category) => {
    setHotelCategory(category);
  };

  return (
    <section className="categories d-flex gap">
      {isMobile ? (
        <select 
          className="mobile-category-dropdown" 
          value={hotelCategory} 
          onChange={(e) => handleCategoryClick(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories && categories.map(({ _id, category }) => (
            <option key={_id} value={category}>{category}</option>
          ))}
        </select>
      ) : (
        <Carousel className="carousel" itemsToShow={9} itemsToScroll={6} pagination={false}>
          {
            categories && categories.map(({ _id, category }) => <span key={_id} className={`${category === hotelCategory ? "category-color" : ""} item`} onClick={() => handleCategoryClick(category)}>{category}</span>)
          }
        </Carousel>
      )}
      <div>
        <button
          className="button btn-filter d-flex align-center gap-small cursor-pointer"
          onClick={handleFilterClick}
        >
          <span className="material-icons-outlined">filter_alt</span>
          <span>Filter</span>
        </button>
      </div>

    </section>


  );
};
