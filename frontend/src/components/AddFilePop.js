import { Fragment, useRef, useState, useContext } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { PlusIcon } from "@heroicons/react/24/outline";


import AuthContext from "../AuthContext";

export default function AddStore() {
    const authContext = useContext(AuthContext);



    const [open, setOpen] = useState(true);
    const cancelButtonRef = useRef(null);


    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
      setFile(e.target.files[0]);
    };


    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('userID', authContext.user)
    
        fetch("http://localhost:4000/api/store/add/pdffile", {
    method: "POST",
    enctype:"multipart/form-data",
    body: formData
})
.then((response) => {
    if (!response.ok) {
        throw new Error('Failed to upload PDF');
    }
    return response;
})
.then((data) => {
    console.log(data);
    alert("STORE ADDED");
    setOpen(false);
})
.catch((error) => {
    console.error('Error uploading PDF:', error);
    // Handle error
});
      };








    const addProduct = () => {
        fetch("http://localhost:4000/api/store/add", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify("hello"),
        })
            .then((result) => {
                console.log(result)
                alert("STORE ADDED");
                setOpen(false);
            })
            .catch((err) => console.log(err));
    };




    return (
        // Modal
        <Transition.Root show={open} as={Fragment}>
            <Dialog
                as="div"
                className="relative z-10"
                initialFocus={cancelButtonRef}
                onClose={setOpen}
            >
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all">
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4  flex flex-col items-center">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mx-[10px] flex h-12 w-full flex-shrink-0 items-center justify-center rounded-full bg-blue-100 ">


                                            <input type="file" className="w-[50vw] mx-[30px] px-[20px]"    onChange={handleFileChange} />
                                        </div>



                                    </div>
                                    <button   className="bg-[#7b7bed] text-white mt-[30px] px-[15px] py-[15px] rounded-[30px]"
                                    onClick={handleSubmit}
                                    >Upload File</button>
                                </div>

                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
}
