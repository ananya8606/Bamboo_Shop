import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loading from '../components/Loading';
import { createProduct, uploadImage, productCreateReset } from '../reducers/productReducers';
import { useNavigate } from 'react-router-dom';
import { fetchSettings } from "../reducers/settingsReducers";

const ProductCreate = () => {
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.user.userLogin);
  const { userInformation: userInfo } = userLogin;
  const productCreate = useSelector((state) => state.product.productCreate);
  const { loading, error, success } = productCreate;
  const uploadImg = useSelector((state) => state.product.uploadImage);
  const { loading: loadingImage, error: errorImage, image:Img } = uploadImg;
  const [category, setCategory] = useState('');
  const [subCategory, setsubCategory] = useState('');
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [description, setDescription] = useState('');
  const [cost, setCost] = useState('');
  const [discount, setDiscount] = useState('');
  const [quantity, setQuantity] = useState('');
  
useEffect(() => {
  dispatch(fetchSettings());
}, [dispatch]);

  const imgHandler = async (e) => {
    const file = e.target.files[0];
    console.log(file);
    const formData =new FormData();
    console.log(formData)
    formData.append('image', file);
    console.log(formData)
    dispatch(uploadImage(formData));
    setImage(Img && JSON.stringify(Img?.url));
  };

  const submitHandler = (e) => {
    e.preventDefault();
   const productData = {
    brandName:name,
    image:Img,
    brand:brand,
    category:category,
    subCategory:subCategory,
    description:description,
    discount:discount,
    cost:cost,
    quantity:quantity
  };
    dispatch(
      createProduct(productData)
    );
    setName('');
    setBrand('');
    setDescription('');
    setCategory('');
    setsubCategory('');
    setCost('');
    setDiscount('');
    setImage('');
    setQuantity('');
  };

  const subCategories = [
    [
      { _id: 1, name: 'Bamboo Sup' },
      { _id: 2, name: 'Bamboo Tokri' },
    ],
    [
      { _id: 1, name: 'Bamboo Charcoal' },
      { _id: 2, name: 'Bamboo Toothbrush' },
    ],
    [
      { _id: 1, name: 'Bamboo Chairs' },
      { _id: 2, name: 'Bamboo Sofa' },
    ],
    [
      { _id: 1, name: 'Bamboo Flooring' },
      { _id: 2, name: 'Bamboo Tissue Rolls' },
    ],
    [
      { _id: 1, name: 'Bamboo Indoor Plants' },
      { _id: 2, name: 'Bamboo Handicrafts' },
    ],
  ];

const history=useNavigate();

  useEffect(() => {
    !userInfo && history('/');
    dispatch(productCreateReset());
  }, [userInfo, history]);

  return (
    <div className="product-create">
      {console.log(Img)}
      <span style={{ textAlign: 'center', padding: '5px', fontSize: '25px' }}>
        CREATE A NEW PRODUCT
      </span>
      {error && <Message message={error} color="black" />}
      {loading && <Loading />}
      {success && (
        <Message message="Product Created Successfully" color="green" />
      )}
      <form onSubmit={submitHandler}>
        <div className="product-create-inner">
          <div className="product-create-left">
            <div className="control-form">
              <label>Enter the product Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="control-form">
              <label>Upload an Image</label>
              <input
                type="file"
                id="img"
                name="img"
                accept="image/*"
                onChange={imgHandler}
                required
              />
            </div>
            <div className="control-form">
              <label>Category</label>
              <select
                name=""
                id=""
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select the Category</option>
                <option value="Kitchen">Kitchen</option>
                <option value="Personal Care">Personal Care</option>
                <option value="Furniture">Furniture</option>
                <option value="Flooring">Flooring</option>
                <option value="Decoration">Decoration</option>
              </select>
            </div>
            <div className="control-form">
              <label>Sub Category</label>
              <select
                name=""
                id=""
                value={subCategory}
                onChange={(e) => setsubCategory(e.target.value)}
              >
                {console.log(category)}
                <option value="">Select the Sub Category</option>
                {category === 'Kitchen' &&
                  subCategories[0].map((data) => (
                    <option
                      key={data._id}
                      value={data.name}
                      onChange={(e) => setsubCategory(e.target.value)}
                    >
                      {data.name}
                    </option>
                  ))}
                {category === 'Personal Care' &&
                  subCategories[1].map((data) => (
                    <option
                      key={data._id}
                      value={data.name}
                      onChange={(e) => setsubCategory(e.target.value)}
                    >
                      {data.name}
                    </option>
                  ))}
                {category === 'Furniture' &&
                  subCategories[2].map((data) => (
                    <option
                      key={data._id}
                      value={data.name}
                      onChange={(e) => setsubCategory(e.target.value)}
                    >
                      {data.name}
                    </option>
                  ))}

                {category === 'Flooring' &&
                  subCategories[3].map((data) => (
                    <option
                      key={data._id}
                      value={data.name}
                      onChange={(e) => setsubCategory(e.target.value)}
                    >
                      {data.name}
                    </option>
                  ))}
                {category === 'Decoration' &&
                  subCategories[4].map((data) => (
                    <option
                      key={data._id}
                      value={data.name}
                      onChange={(e) => setsubCategory(e.target.value)}
                    >
                      {data.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="control-form">
              <label>Enter the Brand Name</label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="product-create-right">
            <div className="control-form">
              <label>Enter the Cost</label>
              <input
                type="number"
                value={cost}
                min="1"
                onChange={(e) => setCost(e.target.value)}
                required
              />
            </div>
            <div className="control-form">
              <label>Enter the Discount %</label>
              <input
                type="number"
                value={discount}
                min="0"
                onChange={(e) => setDiscount(e.target.value)}
              />
            </div>
            <div className="control-form">
              <label>Enter the Quantity</label>
              <input
                type="number"
                value={quantity}
                min="1"
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </div>
            <div className="control-form">
              <label>Enter the Description</label>
              <textarea
                style={{ outline: 'none', width: '100%' }}
                type=""
                value={description}
                rows="4"
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
          </div>
        </div>
        <button
          style={{ margin: 'auto', marginBottom: '10px' }}
          className="btn-product"
        >
          Create New Product
        </button>
      </form>
    </div>
  );
}

export default ProductCreate;
