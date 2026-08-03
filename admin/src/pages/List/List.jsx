import React, { useEffect, useState } from 'react'
import './List.css'
import axios from 'axios'
import { toast } from 'react-toastify'

const List = ({url}) => {

  const [list, setList] = useState([]);

  const fetchList = async () => {
    const response = await axios.get(`${url}/api/food/list`);
    if (response.data.success) {
      setList(response.data.data);
    }
    else {
      toast.error("Error")
    }
  }

  const removeFood = async(foodId) => {
     const response = await axios.post(`${url}/api/food/remove`, {id:foodId})
     await fetchList();
     if (response.data.success) {
      toast.success(response.data.message)
     }
     else{
      toast.error("Error")
     }
  }

  useEffect(()=>{
    fetchList();
  },[])

  return (
    <div className='list add flex-col'>
      <p>All Foods List</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>

        {list.map((item, index) => {
          return (
            <div key={index} className="list-table-format">
              <img src={item.image} alt={item.name} onError={(e) => { e.target.onerror = null; e.target.src = "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20200%20200%22%3E%3Crect%20width%3D%22200%22%20height%3D%22200%22%20rx%3D%2212%22%20fill%3D%22%23f1efe8%22%2F%3E%3Ccircle%20cx%3D%2272%22%20cy%3D%2272%22%20r%3D%2216%22%20fill%3D%22%23d3d1c7%22%2F%3E%3Cpath%20d%3D%22M40%20148%20L88%2092%20L122%20126%20L152%2086%20L178%20148%20Z%22%20fill%3D%22%23d3d1c7%22%2F%3E%3C%2Fsvg%3E"; }} />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>${item.price}</p>
              <p onClick={()=>removeFood(item._id)} className='cursor'>X</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default List