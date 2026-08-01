import React, { useContext } from "react";
import "./FoodDisplay.css";
import { StoreContext } from "../../context/StoreContext";
import FoodItem from "../FoodItem/FoodItem";

const FoodDisplay = ({ category }) => {
  const {
    food_list = [],
    foodLoading,
    foodError,
    fetchFoodList,
    search = "",
    setSearch
  } = useContext(StoreContext);

  const normalizeText = (text = "") =>
    String(text)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

  const searchText = normalizeText(search);
  const hasSearch = searchText.length > 0;

  const safeFoodList = Array.isArray(food_list)
    ? food_list
    : [];

  const filteredFoodList = safeFoodList.filter(
    (item) => {
      const matchesSearch =
        !hasSearch ||
        normalizeText(item.name).includes(searchText) ||
        normalizeText(item.description).includes(
          searchText
        ) ||
        normalizeText(item.category).includes(
          searchText
        );

      const matchesCategory =
        hasSearch ||
        category === "All" ||
        category === item.category;

      return matchesSearch && matchesCategory;
    }
  );

  const clearSearch = () => {
    setSearch("");
  };

  return (
    <div
      className="food-display"
      id="food-display"
    >
      <div className="food-display-heading">
        <div>
          <h2>
            {hasSearch
              ? "Search Results"
              : "Our Most Loved Dishes"}
          </h2>

          {hasSearch && (
            <p className="food-search-text">
              Showing results for{" "}
              <strong>"{search.trim()}"</strong>
            </p>
          )}
        </div>

        {hasSearch && (
          <button
            type="button"
            className="clear-food-search"
            onClick={clearSearch}
          >
            Clear Search
          </button>
        )}
      </div>

      {foodLoading ? (
        <div className="food-search-empty">
          <h3>Loading food...</h3>
          <p>Please wait while we load the menu.</p>
        </div>
      ) : foodError ? (
        <div className="food-search-empty">
          <h3>Unable to load food</h3>

          <p>{foodError}</p>

          <button
            type="button"
            onClick={fetchFoodList}
          >
            Try Again
          </button>
        </div>
      ) : filteredFoodList.length > 0 ? (
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
      ) : hasSearch ? (
        <div className="food-search-empty">
          <h3>No food found</h3>

          <p>
            We could not find a dish matching{" "}
            <strong>"{search.trim()}"</strong>.
          </p>

          <button
            type="button"
            onClick={clearSearch}
          >
            Show All Food
          </button>
        </div>
      ) : (
        <div className="food-search-empty">
          <h3>No food available</h3>

          <p>
            The database did not return any dishes.
            Add food from the Admin page.
          </p>
        </div>
      )}
    </div>
  );
};

export default FoodDisplay;