import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loading from '../components/Loading';
import { uploadFile } from '../reducers/productReducers';
import { useNavigate } from 'react-router-dom';
import { fetchSettings } from "../reducers/settingsReducers";

const ProductCreate = () => {
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.user.userLogin);
  const { userInformation: userInfo } = userLogin;
  const fileUpload = useSelector((state) => state.product.uploadFile);
  const { loading, error, success } = fileUpload;
  const history = useNavigate();

  const [file, setFile] = useState(null);
  
useEffect(() => {
  dispatch(fetchSettings());
}, [dispatch]);

  const handleFileUpload = (event) => {
    event.preventDefault();
    if (file) {
      // Call the uploadFile action
      dispatch(uploadFile(file));
    }
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  useEffect(() => {
    !userInfo && history('/');
  }, [userInfo, history]);

  return (
    <div className="product-create">
      <span style={{ textAlign: 'center', padding: '5px', fontSize: '25px' }}>
        CREATE PRODUCTS IN BULK
      </span>
      {error && <Message message={error} color="black" />}
      {loading && <Loading />}
      {success && (
        <Message message="Product Created Successfully" color="green" />
      )}
      <form onSubmit={handleFileUpload}>
        <div className="product-create-inner">
          <div className="product-create-left">
            <div className="control-form">
              <label>Upload a CSV file</label>
              <input
                type="file"
                required
                onChange={handleFileChange}
              />
            </div>
          </div>
        </div>
        <button
          style={{ margin: 'auto', marginBottom: '10px' }}
          className="btn-product"
          type="submit"
        >
          Create Products
        </button>
      </form>
    </div>
  );
}

export default ProductCreate;
