import React, { useContext } from 'react'
import './FoodDisplay.css'
import { StoreContext } from '../../context/StoreContext'
import FoodItem from '../FoodItem/FoodItem'

const FoodDisplay = ({ category }) => {

  const { food_list, search, setSearch } = useContext(StoreContext);

  const normalizeText = (text = "") => {
    return text
      .toString()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  };

  const searchText = normalizeText(search);

  const filteredFoodList = food_list.filter((item) => {
    const itemName = normalizeText(item.name);
    const itemDescription = normalizeText(item.description);
    const itemCategory = normalizeText(item.category);

    const matchesSearch =
      searchText === "" ||
      itemName.includes(searchText) ||
      itemDescription.includes(searchText) ||
      itemCategory.includes(searchText);

    /* When a search keyword is present: search across all dishes. When not searching: filter by category, following the GreatStack code. */
    const matchesCategory =
      searchText !== "" ||
      category === "All" ||
      category === item.category;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className='food-display' id='food-display'>
      <div className="food-display-heading">
          <h2>{searchText ? "Search Results":"Our Most Loved Dishes"}</h2>
          {searchText &&(
            <p className="food-search-text">Showing results for{""}<strong>"{search}"</strong></p>
          )}
      </div>
       {searchText && (
          <button type="button" className="clear-food-search" onClick={() => setSearch("")}>Clear Search</button>
        )}
      {filteredFoodList.length > 0 ? (
        <div className="food-display-list">
          {filteredFoodList.map((item) => (
            <FoodItem
              key={item._id}
              id={item._id}
              name={item.name}
              description={item.description}
              price={item.price}
              image={item.image}
            />
          ))}
        </div>
      ) : (
        <div className="food-search-empty">
          <h3>No food found</h3>

          <p>
            We could not find a dish matching{" "}
            <strong>"{search}"</strong>.
          </p>

          <button
            type="button"
            onClick={() => setSearch("")}
          >
            Show All Food
          </button>
        </div>
      )}
    </div>
  );
};

export default FoodDisplay
