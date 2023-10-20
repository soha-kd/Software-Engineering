import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Card from "../../card/Card";

import "./ProductForm.scss";

const ProductForm = ({
  product,
  productImage,
  imagePreview,
  description,
  setDescription,
  handleInputChange,
  handleImageChange,
  saveProduct,
}) => {
  return (
    <div className="add-product">
      <Card cardClass={"card"}>
        <form onSubmit={saveProduct}>
          <Card cardClass={"group"}>
            <label>عکس محصول</label>
            <code className="--color-dark">
              فرمت های دارای پشتیبانی : jpg , jpeg , png
            </code>
            <input
              type="file"
              name="image"
              onChange={(e) => handleImageChange(e)}
            />

            {imagePreview != null ? (
              <div className="image-preview">
                <img src={imagePreview} alt="product" />
              </div>
            ) : (
              <p>هیچ عکسی برای این محصول آپلود نشده است</p>
            )}
          </Card>
          <label>نام محصول:</label>
          <input
            type="text"
            placeholder="نام"
            name="name"
            value={product?.name}
            onChange={handleInputChange}
          />

          <label>دسته بندی محصول</label>
          <input
            type="text"
            placeholder="دسته بندی"
            name="category"
            value={product?.category}
            onChange={handleInputChange}
          />

          <label>قیمت محصول:</label>
          <input
            type="text"
            placeholder="قیمت"
            name="price"
            value={product?.price}
            onChange={handleInputChange}
          />

          <label>تعداد موجودی محصول</label>
          <input
            type="text"
            placeholder="تعداد"
            name="quantity"
            value={product?.quantity}
            onChange={handleInputChange}
          />

          <label>توضیحات محصول</label>
          <ReactQuill
            theme="snow"
            value={description}
            onChange={setDescription}
            modules={ProductForm.modules}
            formats={ProductForm.formats}
          />

          <div className="--my">
            <button type="submit" className="--btn --btn-primary">
              ذخیره
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

ProductForm.modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ align: [] }],
    [{ color: [] }, { background: [] }],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["clean"],
  ],
};
ProductForm.formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "color",
  "background",
  "list",
  "bullet",
  "indent",
  "link",
  "video",
  "image",
  "code-block",
  "align",
];

export default ProductForm;
