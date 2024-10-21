import { useState } from "react";

function Modal() {
    const Modal = ({ product, closeModal }) => {
        const [ formData, setFormData ] = useState({
            name: product.name,
            description: product.description,
            price: product.price,
            inStock: product.inStock,
            status: product.status,
        });

        const handleChange = (e) => {
            const { name, value } = e.target;
            setFormData({ ...FormData, [name]: value});
        };

        const handleSubmit = (e) => {
            e.preventDefault();
            console.log('Product updated', formData);
            closeModal();
        };

        return(
            <div className="modal-overlay">
                <div className="modal-content">
                    <h2>Edit Product</h2>
                    <form onSubmit={handleSubmit}>
                        <label>
                            <input 
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                             />
                        </label>
                        <label>
                            <input 
                            type="text"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                             />
                        </label>
                        <label>
                            <input 
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                             />
                        </label>
                        <label>
                            <input 
                            type="checkbox"
                            name="inStock"
                            value={formData.inStock}
                            onChange={handleChange}
                             />
                        </label>
                        <label>
                            <input 
                            type="checkbox"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                             />
                        </label>
                        <button type="submit">Save</button>
                        <button type="button" onClick={closeModal}>Cancel</button>
                    </form>
                </div>
            </div>
        );
    }
}

export default Modal;