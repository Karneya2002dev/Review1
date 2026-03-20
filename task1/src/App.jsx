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

const App = () => {
  return (
    <>
    <Routes>
      {/* User Routes */}
      <Route path='/' element={<Home />} />
     <Route path="/category/:id" element={<CategoryProducts />} />




{/* Admin Routes */}
<Route path='/admin' element={<Dashboard />} />
<Route path='/admin/categories' element={<Category />} />
<Route path='/admin/subcategories' element={<SubCategory />} />
<Route path='/admin/products' element={<Product />} />
<Route path='/admin/barchart' element={<BarChart />} />
<Route path='/admin/linechart' element={<LineChart />} />
<Route path='/admin/piechart' element={<PieChart />} />
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