import {AiOutlineShoppingCart} from 'react-icons/ai'
import './index.css'

const Header = props => {
  const {cartCount, restaurantName} = props

  return (
    <div className="header-container">
      <div className="left-half">
        <h1 className="heading">{restaurantName}</h1>
      </div>
      <div className="right-half">
        <h1 className="orders">My Orders</h1>
        <div className="cart-wrapper">
          <AiOutlineShoppingCart className="cart-icon" />
          <p className="cart-count">{cartCount}</p>
        </div>
      </div>
    </div>
  )
}

export default Header
