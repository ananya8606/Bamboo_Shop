import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loading from '../components/Loading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { listProducts, deleteProduct } from '../reducers/productReducers';
import { ap } from '../Utils/translateLibrary/adminproducts';
import { useNavigate } from 'react-router-dom';
import { fetchSettings } from "../reducers/settingsReducers";

const AdminProducts = () => {
  const settings = useSelector((state) => state.settings);
  const { language, currency } = settings;
    const dispatch = useDispatch()
    const userLogin = useSelector((state) => state.user.userLogin)
    const { userInformation: userInfo } = userLogin
    const productList = useSelector((state) => state.product.productList)
    const { loading, products, error } = productList
    const productDelete = useSelector((state) => state.product.productDelete)
    const {
      loading: loadingDelete,
      success: successDelete,
      error: errorDelete,
    } = productDelete
    // User Settings
    const history = useNavigate();
  useEffect(() => {
  dispatch(fetchSettings());
}, [dispatch]);

    useEffect(() => {
      !userInfo && history('/')
      dispatch(listProducts())
    }, [userInfo, history, loadingDelete])
    const EditHandler = (id) => {
      history(`/admin/productEdit/${id}`)
    }
    const DeleteHandler = (id) => {
      dispatch(deleteProduct(id))
    }
    return (
      <div className='adminOrdersouter'>
        {errorDelete && <Message message={errorDelete} color='black' />}
        {loading || loadingDelete ? (
          <Loading />
        ) : (
          <div className='adminOrder-inner'>
            {products && products.length > 0 ? (
              <table>
                <tbody> 
                <tr>
                  <th>{ap.p[language]}</th>
                  <th>{ap.i[language]}</th>
  
                  <th>{ap.n[language]}</th>
  
                  <th>{ap.c[language]}</th>
                  <th>{ap.s[language]}</th>
                  <th>{ap.b[language]}</th>
                  <th>{ap.d[language]}</th>
                  <th>{ap.co[language]}</th>
                  <th>{ap.pro[language]}</th>
  
                  <th style={{ textAlign: 'center' }}>Edit</th>
                  <th>{ap.del[language]}</th>
                </tr>
                {console.log('products are:', products)}
                {products.map((product) => (
                  <tr key={product._id}>
                    <td>{product._id}</td>
                    <td>
                      <img
                        style={{ width: '50px', height: '50px' }}
                        src={product.image}
                        alt=''
                      />
                    </td>
                    <td>{product.brandName}</td>
                    <td>{product.category}</td>
                    <td>{product.subCategory}</td>
  
                    <td> {product.brand}</td>
                    <td>
                      {' '}
                      {product.discount ? (
                        ` ${product.discount}%`
                      ) : (
                        <FontAwesomeIcon icon={faTimes}   style={{
                          color: 'red',
                          cursor: 'pointer',
                          textAlign: 'center',
                        }} />
                      )}
                    </td>
  
                    <td>Rs. {product.discountedCost}</td>
  
                    <td>{product.updatedAt}</td>
                    <td
                      style={{
                        color: 'white',
                        cursor: 'pointer',
                        textAlign: 'center',
                      }}
                      onClick={() => EditHandler(product._id)}
                    >
                      <i className='fas fa-edit'></i>
                    </td>
                    <td
                      style={{
                        color: 'red',
                        cursor: 'pointer',
                        textAlign: 'center',
                      }}
                      onClick={() => DeleteHandler(product._id)}
                    >
                      <i className='fas fa-trash'></i>{' '}
                    </td>
                  </tr>
                ))}
                </tbody>
              </table>
            ) : (
              <Message message={error} color='red' />
            )}
          </div>
        )}
      </div>
    )
  }
  
  export default AdminProducts
  
