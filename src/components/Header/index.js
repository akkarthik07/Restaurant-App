import {AiOutlineShoppingCart} from 'react-icons/ai'
import './index.css'

const Header = props => {
  const {cartCount} = props

  return (
    <div className="header-container">
      <div className="left-half">
        <h1 className="heading">UNI Resto Cafe</h1>
      </div>
      <div className="right-half">
        <h1 className="orders">My Orders</h1>
        <div className="cart-wrapper">
          <AiOutlineShoppingCart className="cart-icon" />
          <span className="cart-count">{cartCount}</span>
        </div>
      </div>
    </div>
  )
}

export default Header
