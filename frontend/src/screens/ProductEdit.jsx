import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loading from '../components/Loading';
import { listProductDetails, editProduct, uploadImage,productEditReset} from '../reducers/productReducers';
import { useParams,useNavigate} from 'react-router-dom';
import { fetchSettings } from "../reducers/settingsReducers";

const ProductEdit = () => {
  const dispatch = useDispatch();
  const  { id: productId } = useParams();

  const userLogin = useSelector((state) => state.user.userLogin);
  const { userInformation: userInfo } = userLogin;

  const productEdit = useSelector((state) => state.product.productEdit);
  const { loading, error, success } = productEdit;

  const productDetails = useSelector((state) => state.product.productDetails);
  const { loading: loadingDetails, error: errorDetails, product } = productDetails;
  const uploadImg = useSelector((state) => state.product.uploadImage);
  const { loading: loadingImage, error: errorImage, image: Img } = uploadImg;

  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [description, setDescription] = useState('');
  const [cost, setCost] = useState('');
  const [discount, setDiscount] = useState(0);
  const [quantity, setQuantity] = useState('');
  
  useEffect(() => {
  dispatch(fetchSettings());
}, [dispatch]);
  
  const imgHandler = async (e) => {
    const file = e.target.files[0]
    const formData = new FormData()
    formData.append('image', file)
    dispatch(uploadImage(formData))
    setImage(Img)
    console.log('up', image)
  }
  
  const submitHandler = (e) => {
    e.preventDefault()
    console.log(' HERE ', image)
    console.log(discount)
    dispatch(
      editProduct({
        brandName:name,
        image:Img,
        brand:brand,
        category:category,
        subCategory:subCategory,
        description:description,
        discount:discount,
        cost:cost,
        quantity:quantity,
        id:productId
  })
    )
  }
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
  ]
const history=useNavigate();
  useEffect(() => {
    !userInfo && history('/')
    if (success) {
      dispatch(productEditReset())
      history('/admin/allProducts')
    } else {
      if (!product ||!product.brandName || product._id !== productId) {
        dispatch(listProductDetails(productId))
      } else {
        setName(product.brandName)
        setBrand(product.brand)
        setDescription(product.description)
        setCategory(product.category)
        setSubCategory(product.subCategory)
        setCost(product.cost)
        setDiscount(product.discount)
        setImage(product.image)
        setQuantity(product.quantity)
      }
    }
  }, [userInfo, history, productId, dispatch, product, success])
  return (
    <div className='product-create'>
      <span style={{ textAlign: 'center', padding: '5px', fontSize: '25px' }}>
        UPDATE PRODUCT
      </span>
      {error && <Message message={error} color='black' />}
      {loading && <Loading />}
      {success && (
        <Message message='Product Edited Successfully' color='green' />
      )}
      <form onSubmit={submitHandler}>
        <div className='product-create-inner'>
          <div className='product-create-left'>
            <div className='control-form'>
              <label>Enter the product Name</label>
              <input
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className='control-form'>
              <label>Upload an Image</label>
              <input
                type='file'
                id='img'
                name='img'
                accept='image/*'
                onChange={imgHandler}
              />
            </div>
            <div className='control-form'>
              <label>Category</label>
              <select
                name=''
                id=''
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value=''>Select the Category</option>
                <option value='Kitchen'>Kitchen</option>
                <option value='Personal Care'>Personal Care</option>
                <option value='Furniture'>Furniture</option>
                <option value='Flooring'>Flooring</option>
                <option value='Decoration'>Decoration</option>
              </select>{' '}
            </div>
            <div className='control-form'>
              <label>Sub Category</label>
              <select
                name=''
                id=''
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
              >
                {console.log(category)}
                <option value=''>Select the Sub Category</option>
                {category === 'Kitchen' &&
                  subCategories[0].map((data) => (
                    <option
                      key={data._id}
                      value={data.name}
                      onChange={(e) => setSubCategory(e.target.value)}
                    >
                      {data.name}
                    </option>
                  ))}
                {category === 'Personal Care' &&
                  subCategories[1].map((data) => (
                    <option
                      key={data._id}
                      value={data.name}
                      onChange={(e) => setSubCategory(e.target.value)}
                    >
                      {data.name}
                    </option>
                  ))}
                {category === 'Furniture' &&
                  subCategories[2].map((data) => (
                    <option
                      key={data._id}
                      value={data.name}
                      onChange={(e) => setSubCategory(e.target.value)}
                    >
                      {data.name}
                    </option>
                  ))}

                {category === 'Flooring' &&
                  subCategories[3].map((data) => (
                    <option
                      key={data._id}
                      value={data.name}
                      onChange={(e) => setSubCategory(e.target.value)}
                    >
                      {data.name}
                    </option>
                  ))}
                {category == 'Decoration' &&
                  subCategories[4].map((data) => (
                    <option
                      key={data._id}
                      value={data.name}
                      onChange={(e) => setSubCategory(e.target.value)}
                    >
                      {data.name}
                    </option>
                  ))}
              </select>{' '}
            </div>
            <div className='control-form'>
              <label>Enter the Brand Name</label>
              <input
                type='text'
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />
            </div>
          </div>
          <div className='product-create-right'>
            {' '}
            <div className='control-form'>
              <label>Enter the Cost</label>
              <input
                type='number'
                value={cost}
                min='1'
                onChange={(e) => setCost(e.target.value)}
              />
            </div>
            <div className='control-form'>
              <label>Enter the Discount %</label>
              <input
                type='number'
                value={discount}
                min='0'
                onChange={(e) => setDiscount(e.target.value)}
              />
            </div>
            <div className='control-form'>
              <label>Enter the Quantity</label>
              <input
                type='number'
                value={quantity}
                min='1'
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
            <div className='control-form'>
              <label>Enter the Description</label>
              <textarea
                style={{ outline: 'none', width: '100%' }}
                type=''
                value={description}
                rows='4'
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
        </div>
        <button
          style={{ margin: 'auto', marginBottom: '10px' }}
          className='btn-product'
        >
          Update Product
        </button>
      </form>
    </div>
  )
}

export default ProductEdit
