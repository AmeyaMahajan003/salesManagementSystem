import React, { useState, useEffect, useContext } from "react";
import AddStore from "../components/AddStore";
import AuthContext from "../AuthContext";
import UpdateStore from "../components/UpdateStore";

function Store() {
  const [showModal, setShowModal] = useState(false);
  const [stores, setAllStores] = useState([]);
  const [EditStore, setEditStore] = useState(false)
  const [IdofStore, setIdofStore] = useState("")

  const authContext = useContext(AuthContext);

  useEffect(() => {
    fetchData();
  }, []);

  // Fetching all stores data
  const fetchData = () => {
    fetch(`http://localhost:4000/api/store/get/${authContext.user}`)
      .then((response) => response.json())
      .then((data) => {
        setAllStores(data);
      });
  };

  const modalSetting = () => {
    setShowModal(!showModal);
  };

  return (
    <div className="col-span-12 lg:col-span-10 flex justify-center ">
      <div className=" flex flex-col gap-5 w-11/12 border-2">
        <div className="flex justify-between">
          <span className="font-bold">Manage Store</span>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 text-xs  rounded"
            onClick={modalSetting}
          >
            Add Store
          </button>
        </div>
        {showModal && <AddStore />}
        {stores.map((element, index) => {
          return (
            <div
              className="bg-white w-50 h-fit flex flex-col gap-4 p-4 "
              key={element._id}
            >
              
              <div className="flex flex-col gap-3 justify-between items-start">
               <div className="flex w-full justify-between">
               <span className="font-bold">{element.name}</span>
              <div className="flex w-[20%] justify-between">
              <p
                onClick={()=>{
                  setEditStore(!EditStore);
                  setIdofStore(element._id)

                }}
                className="text-[green] font-bold"
                >edit</p>

                <button onClick={()=>{
                  console.log(element._id)
                                  
                                  fetch("http://localhost:4000/api/store/delete/user", {
                                    method: "POST",
                                    headers: {
                                      "Content-type": "application/json",
                                    },
                                    body:JSON.stringify({ id: element._id }),
                                  })
                                    .then((result) => {
                                      console.log(result)
                                      alert("STORE ADDED");
                                     
                                    })
                                    .catch((err) => console.log(err));

                }}
                className="text-[red] font-bold"
                >delete</button>
              </div>
               </div>


                <div className="flex" style={{display:"flex",flexDirection:"column",fontFamily:" system-ui"}}>
                 <div className="flex" >
                 <img
                    alt="location-icon"
                    className="h-6 w-6"
                    src={require("../assets/location-icon.png")}
                  />
                  <span>{element.address}</span>
                 </div>

                  <p style={{marginTop:"10px"}}>Credit:<b>  {element.credit} </b> </p>
                  <p style={{marginTop:"10px"}}>GST:<b>  {element.gstnumber} </b></p>
                  <p style={{marginTop:"10px"}}>Category: <b>{element.category}</b></p>
                </div>
              </div>
            </div>
          );
        })}
         {EditStore && <UpdateStore IdofStore={IdofStore}/>}
      </div>
    </div>
  );
}

export default Store;
