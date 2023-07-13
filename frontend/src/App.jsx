import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './screens/Home';
import CategoryDetails from './screens/CategoryDetails';
import SettingsScreen from './screens/settingsScreen';
import Register from './screens/Register';
import SubCategoryDetails from './screens/SubCategoryDetails';
import ProductScreen from './screens/ProductScreen';
import Login from './screens/Login';
import CartScreen from './screens/CartScreen';
import Shipping from './screens/Shipping';
import Payment from './screens/Payment';
import OrderScreen from './screens/OrderScreen';
import MyOrders from './screens/MyOrders';
import MyQueries from './screens/MyQueries';
import AdminOrders from './screens/AdminOrders';
import OrderDetails from './screens/OrderDetails';
import AdminProducts from './screens/AdminProducts';
import AdminUsers from './screens/AdminUsers';
import AdminQueries from './screens/AdminQueries';
import ProductCreate from './screens/ProductCreate';
import ProductEdit from './screens/ProductEdit';
import UserAccountScreen from './screens/UserAccountScreen';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PaytmPaymentGateway from './components/PaytmPaymentGateway';
import ProductBulk from './screens/ProductBulk';
import LocationPage from './components/Location';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} exact />
        <Route path="/categories/:categoryName" element={<CategoryDetails />} exact />
        <Route path="/category/:subcategoryName" element={<SubCategoryDetails />} exact />
        <Route path="/category/:subcategory/:brand/:id" element={<ProductScreen />} exact />
        <Route path="/login" element={<Login />} exact />
        <Route path="/register" element={<Register />} exact/>
        <Route path="/settings" element={<SettingsScreen />} exact />
        <Route path="/cart/:id?" element={<CartScreen />} />
        <Route path="/shipping" element={<Shipping />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/placeorder" element={<OrderScreen />} />
        <Route path="/myorders/:id" element={<MyOrders />} />
        <Route path="/myqueries/:id" element={<MyQueries />} />
        <Route path="/admin/allOrders" element={<AdminOrders />} exact />
        <Route path="/admin/allQueries" element={<AdminQueries />} exact />
        <Route path="/orderDetails/:id" element={<OrderDetails />} exact />
        <Route path="/admin/allProducts" element={<AdminProducts />} exact />
        <Route path="/admin/allUsers" element={<AdminUsers />} exact />
        <Route path="/admin/ProductCreate" element={<ProductCreate />} exact />
        <Route path="/admin/ProductEdit/:id" element={<ProductEdit />} exact />
        <Route path="/my-account/:id" element={<UserAccountScreen />} exact />
        <Route path="/paytm-payment-gateway" element={<PaytmPaymentGateway />} exact />
        <Route path="/admin/ProductBulk" element={<ProductBulk />} exact />
        <Route path="/contact-us" element={<LocationPage />} exact />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
