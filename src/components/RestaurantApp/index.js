import {Component} from 'react'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import Header from '../Header'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class RestaurantApp extends Component {
  state = {
    cartItems: {},
    menuCategories: [],
    activeCategory: '',
    apiStatus: apiStatusConstants.initial,
    restaurantName: '',
  }

  componentDidMount() {
    this.getRestaurantDetails()
  }

  getRestaurantDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const apiUrl =
      'https://apis2.ccbp.in/restaurant-app/restaurant-menu-list-details'
    const options = {
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    // console.log(response)
    if (response.ok === true) {
      const data = await response.json()
      console.log(data)
      const menuCategories = data[0].table_menu_list
      const initialActiveCategory = menuCategories[0].menu_category

      this.setState({
        menuCategories,
        activeCategory: initialActiveCategory,
        apiStatus: apiStatusConstants.success,
        restaurantName: data[0].restaurant_name,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderMenuCategoryList = () => {
    const {menuCategories, activeCategory} = this.state

    return (
      <ul className="categories-list">
        {menuCategories.map(category => (
          <li
            key={category.menu_category_id}
            className={`category-item ${
              activeCategory === category.menu_category ? 'active-category' : ''
            }`}
          >
            <button
              type="button"
              className="category-btn"
              onClick={() =>
                this.setState({activeCategory: category.menu_category})
              }
            >
              {category.menu_category}
            </button>
          </li>
        ))}
      </ul>
    )
  }

  handleIncrement = dishId => {
    this.setState(prevState => {
      const newCartItems = {...prevState.cartItems}
      newCartItems[dishId] = (newCartItems[dishId] || 0) + 1
      return {
        cartItems: newCartItems,
      }
    })
  }

  handleDecrement = dishId => {
    this.setState(prevState => {
      const {activeCategory, cartItems} = prevState
      const newCartItems = {...cartItems}

      // Prevent decrement if active category is "Salads and Soup"
      // and count is already 0
      if (
        activeCategory === 'Salads and Soup' &&
        (!newCartItems[dishId] || newCartItems[dishId] === 0)
      ) {
        return null
      }

      if (newCartItems[dishId] && newCartItems[dishId] > 0) {
        newCartItems[dishId] -= 1
        return {
          cartItems: newCartItems,
        }
      }
      return null
    })
  }

  renderMenuItems = () => {
    const {menuCategories, activeCategory, cartItems} = this.state
    const activeCategoryData = menuCategories.find(
      category => category.menu_category === activeCategory,
    )
    if (!activeCategoryData) {
      return null
    }

    return (
      <div className="menu-items-container">
        {activeCategoryData.category_dishes.map(dish => {
          const dishCount = cartItems[dish.dish_id] || 0

          const indicatorClassName =
            dish.dish_Type === 2 ? 'green-indicator' : 'red-indicator'

          return (
            <div key={dish.dish_id} className="menu-item-card">
              <div className="item-details">
                <div className="dish-name-wrapper">
                  <span className={`dish-indicator ${indicatorClassName}`} />
                  <h2 className="item-name">{dish.dish_name}</h2>
                </div>
                <p className="item-price">
                  {dish.dish_currency} {dish.dish_price}
                </p>
                <p className="item-description">{dish.dish_description}</p>

                {dish.dish_Availability ? (
                  <div className="counter-container">
                    <button
                      type="button"
                      className="counter-btn"
                      onClick={() => this.handleDecrement(dish.dish_id)}
                    >
                      -
                    </button>
                    <span className="count">{dishCount}</span>
                    <button
                      type="button"
                      className="counter-btn"
                      onClick={() => this.handleIncrement(dish.dish_id)}
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <p className="availability">Not available</p>
                )}
                {dish.addonCat.length > 0 && (
                  <p className="item-customizations">
                    Customizations available
                  </p>
                )}
              </div>
              <p className="item-calories">{dish.dish_calories} calories</p>
              <img
                src={dish.dish_image}
                alt={dish.dish_name}
                className="item-image"
              />
            </div>
          )
        })}
      </div>
    )
  }

  renderLoadingView = () => (
    <div className="restaurant-details-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="product-details-error-view-container">
      <img
        alt="error view"
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        className="error-view-image"
      />
      <h1 className="product-not-found-heading">Product Not Found</h1>
      <Link to="/">
        <button type="button" className="button">
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  renderMenuView = () => {
    const {apiStatus, cartItems, restaurantName} = this.state
    const cartCount = Object.values(cartItems).reduce(
      (acc, curr) => acc + curr,
      0,
    )

    switch (apiStatus) {
      case apiStatusConstants.success:
        return (
          <>
            <Header cartCount={cartCount} restaurantName={restaurantName} />
            {this.renderMenuCategoryList()}
            {this.renderMenuItems()}
          </>
        )
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return <div className="restaurant-container">{this.renderMenuView()}</div>
  }
}

export default RestaurantApp
