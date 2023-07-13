import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {productsSearch}  from '../reducers/productReducers'
import Loading from './Loading'
import { logout } from '../reducers/userReducers'
import { useDispatch, useSelector } from 'react-redux'
import { nav } from "../Utils/translateLibrary/navbar";
import { layer } from '@fortawesome/fontawesome-svg-core'
const Navbar = () => {
const dispatch = useDispatch();
const settings = useSelector((state) => state.settings);
  const { language } = settings;
  const showList = () => {
    document.getElementById('extraitems').classList.toggle('show-list')
  }
  const Logout = () => {
    dispatch(logout())
    showAuthOptions()
  }
  const [text, setText] = useState('')
  const productSearch = useSelector((state) => state.product.productSearch);
  const { loading, products, error } = productSearch;
  const userLogin = useSelector((state) => state.user.userLogin)
  const { userInformation: userInfo } = userLogin
  const cart = useSelector((state) => state.cart)
  const { cartItems } = cart
  useEffect(() => {
    if(text)
    dispatch(productsSearch(text));
  }, [dispatch, text]);
  const showAuthOptions = () => {
    document.getElementById('showOptions').classList.toggle('showOptionsList')
  }
  return (
    <div className='nav'>
      <div className='navbar'>
        <div className='bars'>
          <i className='fas fa-bars' onClick={showList}></i>
        </div>

        <Link to='/'>
          <h3>{nav.ecomm[language]}</h3>
        </Link>
        <div className='search-form'>
          <input
            type='text'
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <i className='fas fa-search'></i>
          <div className='search-results'>
            {loading && <Loading />}
            {products &&
              products.length > 0 &&
              products.map((product) => (
                <div className='searched' key={product._id} >
                 <div className='searchedItem'>
                    <Link
                      to={`/category/${product.category}/${product.subCategory}/${product._id}`}
                    >
                      {' '}
                      <img src={product.image} alt='' />
                    </Link>
                    <div className='searchItem-inner'>
                      <span>{product.brandName}</span>
                      <span>
                        <span className='brandName'>{nav.br[language]}</span> {product.brand}
                      </span>
                    </div>
                  </div>
                  <div className='underline'></div>
                </div>
              ))}
          </div>
        </div>
        {/* </div> */}
        <div className='shopping'>
          <Link to={`/cart/cartItems/?qty`}>
            <i className='fas fa-shopping-cart'>
              {' '}
              {cartItems && <span>{cartItems.length}</span>}
            </i>
          </Link>
        </div>
        <div className='shopping'>
        <Link to="/settings">
       <i className="fas fa-cog"></i>
      </Link>
      </div>
        <div className='my-account' id='my-account'>
          <i className='far fa-user'></i>
          <div className='my-account-text' onClick={showAuthOptions}>
            <span>
              {nav.namaste[language]}{' '}
              {userInfo && userInfo.isAdmin
                ? 'Admin'
                : userInfo && userInfo.name}
            </span>
            <div className='account-detail'>
              {' '}
              <span>{nav.myaccount[language]}</span>
              <i className='fas fa-chevron-down'></i>
            </div>
          </div>
          <div className='showOptions' id='showOptions'>
            {!userInfo ? (
              <>
                <Link to='/login' onClick={showAuthOptions}>
                {nav.signin[language]}
                </Link>
                <span className='new-customer'>{nav.newcustomer[language]}</span>
                <Link to='/register' onClick={showAuthOptions}>
                {nav.register[language]}
                </Link>{' '}
              </>
            ) : (
              <div className='weird'>
                <Link
                  to={`/my-account/${userInfo._id}`}
                  onClick={showAuthOptions}
                >
                {nav.myaccount[language]}
                </Link>
                <div className='underline'></div>
                <Link
                  to={`/myorders/${userInfo._id}`}
                  onClick={showAuthOptions}
                >
                {nav.myorders[language]}
                </Link>
                <div className='underline'></div>
                <Link
                  to={`/myqueries/${userInfo._id}`}
                  onClick={showAuthOptions}
                >
                {nav.my[language]}
                </Link>
                <div className='underline'></div>
                {userInfo.isAdmin && (
                  <>
                    {' '}
                    <Link to={`/admin/allProducts`} onClick={showAuthOptions}>
                  {nav.allproducts[language]}
                    </Link>
                    <div className='underline'></div>
                    <Link to={`/admin/allOrders`} onClick={showAuthOptions}>
                    {nav.allorders[language]}
                    </Link>
                    <div className='underline'></div>
                    <Link to={`/admin/allQueries`} onClick={showAuthOptions}>
                    {nav.aq[language]}
                    </Link>
                    <div className='underline'></div>
                    <Link to={`/admin/allUsers`} onClick={showAuthOptions}>
                    {nav.allusers[language]}
                    </Link>
                    <div className='underline'></div>
                    <Link to={`/admin/ProductCreate`} onClick={showAuthOptions}>
                    {nav.create[language]}
                    </Link>
                    <div className='underline'></div>
                    <Link to={`/admin/ProductBulk`} onClick={showAuthOptions}>
                    {nav.createbulk[language]}
                    </Link>
                    <div className='underline'></div>
                  </>
                )}
                <button className='logout' onClick={Logout}>
                  {nav.logout[language]}
                </button>
              </div>
            )}
          </div>
        </div>
        <div className='shopping'>
        <Link to="/contact-us">
        <i className='fas fa-comment'></i>
      </Link>
      </div>
      </div>
      <div className='search-form-small'>
        <input
          type='text'
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <i className='fas fa-search'></i>
        <div className='search-results'>
          {loading && <Loading />}
          {products &&
            products.length > 0 &&
            products.map((product) => (
              <div className='searched' key={product._id}>
                <div className='searchedItem'>
                  <Link
                    to={`/category/${product.category}/${product.subCategory}/${product._id}`}
                  >
                    {' '}
                    <img src={product.image} alt='' />
                  </Link>
                  <div className='searchItem-inner'>
                    <span>{product.brandName}</span>
                    <span>
                      <span className='brandName'>{nav.brand[language]}</span> {product.brand}
                    </span>
                  </div>
                </div>
                <div className='underline'></div>
              </div>
            ))}
        </div>
      </div>
      <div className='extra-items' id='extraitems'>
        <div className='category-shop'>
          <h3>{nav.shop[language]}</h3>
          <i className='fas fa-times' onClick={showList}></i>
        </div>
        <ul className='shopping-categories'>
          <li className='inline-items'>
            <Link to='/categories/Kitchen'>{nav.kitchen[language]}</Link>
            <ul className='inline-list'>
              <li>
                <Link className='category-item' to='/category/Bamboo Sup'>
                  {nav.bamboosup[language]}
                </Link>
              </li>
              <li>
                <Link to='/category/Bamboo Tokri'>{nav.bambootokri[language]}</Link>
              </li>
            </ul>
          </li>
          <li className='inline-items'>
            <Link to='/categories/Personal Care'>{nav.personalcare[language]}</Link>
            <ul className='inline-list'>
              <li>
                <Link to='/category/Bamboo Charcoal'>{nav.bamboocharcoal[language]}</Link>
              </li>
              <li>
                <Link to='/category/Bamboo Toothbrush'>{nav.bambootoothbrush[language]}</Link>
              </li>
            </ul>
          </li>
          <li className='inline-items'>
            <Link to='/categories/Furniture'>{nav.furniture[language]}</Link>
            <ul className='inline-list'>
              <li>
                <Link to='/category/Bamboo Chairs'>{nav.bamboochairs[language]}</Link>
              </li>
              <li>
                <Link to='/category/Bamboo Sofa'>{nav.bamboosofa[language]}</Link>
              </li>
            </ul>
          </li>
          <li className='inline-items'>
            <Link to='/categories/Flooring'>{nav.flooring[language]}</Link>
            <ul className='inline-list'>
              <li>
                <Link to='/category/Bamboo Flooring'>{nav.bambooflooring[language]}</Link>
              </li>
              <li>
                <Link to='/category/Bamboo Tissue Rolls'>{nav.bambootissuerolls[language]}</Link>
              </li>
            </ul>
          </li>
          <li className='inline-items'>
            <Link to='/categories/Decoration'>{nav.decoration[language]}</Link>
            <ul className='inline-list'>
              <li>
                <Link to='/category/Bamboo Indoor Plants'>{nav.bambooindoorplants[language]}</Link>
              </li>
              <li>
                <Link to='/category/Bamboo Handicrafts'>{nav.bamboohandicrafts[language]}</Link>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Navbar
