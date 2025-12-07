import axios from "axios";
import { useEffect, useState } from "react";
import {useCategory} from "../../context/index.js";

import "./Categories.css";

export const Categories = () => {
  const [allCategories, setAllCategories] = useState([]);
  const [categoriesToDisplay, setCategoriesToDisplay] = useState([]);
  const [numberOfCategoriesToShow, setNumberOfCategoriesToShow] = useState(0);
  const {hotelCategory, setHotelCategory} = useCategory();

  const handleLeftButtonClick = () => {
    setNumberOfCategoriesToShow((prev) => prev - 10);
  };

  const handleRightButtonClick = () => {
    setNumberOfCategoriesToShow((prev) => prev + 10);
  };

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:3200/api/categories"
        );

        const uniqueCategories = Array.from(
          new Map(data.map((item) => [item.category, item])).values()
        );

        setAllCategories(uniqueCategories);

        const sliced = uniqueCategories.slice(
          numberOfCategoriesToShow+10 > uniqueCategories.length
            ? uniqueCategories.length - 10
            : numberOfCategoriesToShow,
          numberOfCategoriesToShow > uniqueCategories.length
            ? uniqueCategories.length
            : numberOfCategoriesToShow + 10
        );

        setCategoriesToDisplay(sliced);
      } catch (err) {
        console.log(err);
      }
    })();
  }, [numberOfCategoriesToShow]);

  const handleCategoryClick = (category) => {
    setHotelCategory(category);
  };

  return (
    <section className="categories d-flex align-center gap cursor-pointer">
      {numberOfCategoriesToShow >= 10 && (
        <button
          className="button btn-category btn-left fixed cursor-pointer"
          onClick={handleLeftButtonClick}
        >
          <span className="material-icons-outlined">chevron_left</span>
        </button>
      )}

      {categoriesToDisplay &&
        categoriesToDisplay.map(({ _id, category }) => (
          <span className={`${category === hotelCategory ? "border-bottom" : ""}`} key={_id} onClick={()=> handleCategoryClick(category)}>{category}</span>
        ))}

      {numberOfCategoriesToShow + 10 < allCategories.length && (
        <button
          className="button btn-category btn-right fixed cursor-pointer"
          onClick={handleRightButtonClick}
        >
          <span className="material-icons-outlined">chevron_right</span>
        </button>
      )}
    </section>
  );
};
