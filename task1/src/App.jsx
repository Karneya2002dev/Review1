import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Dashboard from './Component/Admin/Pages/Dashboard'
import Category from './Component/Admin/Pages/Category'
import SubCategory from './Component/Admin/Pages/SubCategory'
import Product from './Component/Admin/Pages/Product'
import BarChart from './Component/Admin/Charts/BarChart'
import LineChart from './Component/Admin/Charts/LineChart'
import PieChart from './Component/Admin/Charts/PieChart'
import Home from './Component/User/HomePage/Home'
import CategoryProducts from './Component/User/HomePage/CategoryProducts'
import CartPage from './Component/CartPage'
import Signup from './Login/Signup'
import Login from './Login/Login'
import CheckOutPages from './Component/CheckOutPages'
import OrderSucess from './Component/OrderSucess'
import Orders from './Component/Orders'
import Order from './Component/Admin/Pages/Order'
import Users from './Component/Admin/Pages/Users'

const App = () => {
  return (
    <>
    <Routes>
      {/* User Routes */}
      <Route path='/' element={<Home />} />
     <Route path="/category/:id" element={<CategoryProducts />} />
     <Route path="/cart" element={<CartPage />} />
     <Route path="/signup" element={<Signup />} />
     <Route path="/login" element={<Login />} />
     <Route path="/checkout" element={<CheckOutPages />} />
     <Route path="/order-success/:id" element={<OrderSucess />} />
     <Route path="/orders" element={<Orders />} />
 





{/* Admin Routes */}
<Route path='/admin' element={<Dashboard />} />
<Route path='/admin/categories' element={<Category />} />
<Route path='/admin/subcategories' element={<SubCategory />} />
<Route path='/admin/products' element={<Product />} />
<Route path='/admin/barchart' element={<BarChart />} />
<Route path='/admin/linechart' element={<LineChart />} />
<Route path='/admin/piechart' element={<PieChart />} />
<Route path='/admin/orders' element={<Order />} />
    <Route path="/admin/users" element={<Users />} />
    </Routes>
    
    </>
  )
}

export default App


// import React from 'react'
// import Sidebar from './Component/Admin/Sidebar'

// const App = () => {
//   return (
//     <>
//     <Sidebar />
//     </>
//   )
// }

// export default App