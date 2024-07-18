import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../../assets/css/pagesCss/workPage.css";
import { AiFillPlusCircle, AiOutlineClose } from "react-icons/ai";
import { PiImagesFill } from "react-icons/pi";
import { BsThreeDots } from "react-icons/bs";
import { FcRemoveImage } from "react-icons/fc";
import {
  fetchWorks,
  addWork,
  editWork,
  deleteWork,
} from "./../../app/features/workSlice";
import { toast } from "react-toastify";

const Work = () => {
  const dispatch = useDispatch();
  const works = useSelector((state) => state.works.works);
  const designerId = useSelector((state) => state.designer.profile.user); // Assuming the designer ID is stored in the state
  const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] = useState({
    image: null,
    title: "",
    category: "",
  });
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [errors, setErrors] = useState({
    image: false,
    title: false,
    category: false,
  });
  const [showMenuIndex, setShowMenuIndex] = useState(null);
  const [editIndex, setEditIndex] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    dispatch(fetchWorks());
  }, [dispatch]);

  const togglePopup = () => {
    setShowPopup(!showPopup);
    resetForm();
  };

  const resetForm = () => {
    setFormData({ image: null, title: "", category: "" });
    setImagePreviewUrl(null);
    setEditIndex(null);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        image: files[0],
      }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result);
      };
      reader.readAsDataURL(files[0]);
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: false,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { image, title, category } = formData;
    let valid = true;
    if (!image) {
      setErrors((prevErrors) => ({ ...prevErrors, image: true }));
      valid = false;
    }
    if (!title) {
      setErrors((prevErrors) => ({ ...prevErrors, title: true }));
      valid = false;
    }
    if (!category) {
      setErrors((prevErrors) => ({ ...prevErrors, category: true }));
      valid = false;
    }

    if (valid) {
      const data = { ...formData };

      if (editIndex !== null) {
        const workId = works[editIndex].id;
        dispatch(editWork({ id: workId, updatedWork: data, designerId }))
          .unwrap()
          .then(() => {
            toast.success("Work updated successfully 🎨");
          })
          .catch((error) => {
            toast.error(`Error: ${error.message} ❌`);
          });
      } else {
        dispatch(addWork({ workData: data, designerId }))
          .unwrap()
          .then(() => {
            toast.success("Work created successfully 🚀");
          })
          .catch((error) => {
            toast.error(`Error: ${error.message} ❌`);
          });
      }
      resetForm();
      setShowPopup(false);
    }
  };

  const handleEdit = (index) => {
    const work = works[index];
    setFormData(work);
    setImagePreviewUrl(work.image);
    setShowPopup(true);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const workId = works[index].id;
    dispatch(deleteWork(workId))
      .unwrap()
      .then(() => {
        toast.success("Work deleted successfully 🗑️");
      })
      .catch((error) => {
        toast.error(`Error: ${error.message} ❌`);
      });
  };

  const toggleMenu = (index) => {
    setShowMenuIndex(showMenuIndex === index ? null : index);
  };

  const loadMoreWorks = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const displayedWorks = works.slice(0, currentPage * itemsPerPage);

  return (
    <div className="work-main-container">
      <div className="work-sub-container">
        <div
          className="work-list"
          style={{ display: works.length > 0 ? "grid" : "none" }}
        >
          {displayedWorks.map((work, index) => (
            <div className="work-items-container" key={index}>
              <div className="work-item">
                <img src={work.image} alt={work.title} className="work-image" />
                <div className="work-content-container">
                  <div className="content-sub-con">
                    <h4>{work.category}</h4>
                    <h3>{work.title}</h3>
                  </div>
                </div>
                <div className="work-item-buttons">
                  <div className="work-setting">
                    <div className="work-setting-drop-down-manu">
                      <BsThreeDots onClick={() => toggleMenu(index)} />
                      {showMenuIndex === index && (
                        <div className="dropdown-content">
                          <button onClick={() => handleEdit(index)}>
                            Edit
                          </button>
                          <button onClick={() => handleDelete(index)}>
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {currentPage * itemsPerPage < works.length && (
          <div className="more-works-container">
            <button className="more-load-btn" onClick={loadMoreWorks}>
              More works
            </button>
          </div>
        )}
        <div className="work-container">
          <div className="work-item-add">
            <span className="work-icon" onClick={togglePopup}>
              <AiFillPlusCircle />
            </span>
            <button className="project-btn" onClick={togglePopup}>
              Create a work
            </button>
          </div>
        </div>

        {showPopup && (
          <div className="work-container-popup">
            <div className="work-popup-inner">
              <button className="work-close-btn " onClick={togglePopup}>
                <AiOutlineClose />
              </button>
              <div className="add-items-container">
                <h2>{editIndex !== null ? "Edit Work" : "Add New Work"}</h2>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                  <div className="add-work-item-left-container">
                    {imagePreviewUrl && (
                      <div className="image-preview">
                        <img src={imagePreviewUrl} alt="Selected" />
                        <button
                          className="remove-image-btn"
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, image: null });
                            setImagePreviewUrl(null);
                          }}
                        >
                          <FcRemoveImage className="remove-icon" />
                        </button>
                      </div>
                    )}
                    {!imagePreviewUrl && (
                      <div className="preview-image-add-contatiner">
                        <label htmlFor="image" className="file-label">
                          <input
                            type="file"
                            id="image"
                            name="image"
                            onChange={handleChange}
                            className="work-image-input"
                          />
                          <div className="work-image-icon">
                            <PiImagesFill />
                          </div>
                        </label>
                        {errors.image && (
                          <p className="message-required">
                            You must select at least one example
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="add-work-item-right-container">
                    <div className="work-title-container">
                      <div className="form-group">
                        <input
                          type="text"
                          id="title"
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                          placeholder=""
                          className="work-title-input"
                        />
                        <label
                          htmlFor="title"
                          className="input-label-work-title"
                        >
                          Title
                        </label>
                        {errors.title && (
                          <p className="message-required">Title is required</p>
                        )}
                      </div>
                    </div>
                    <div className="from-group">
                      <input
                        type="text"
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        placeholder=""
                        className="work-brand-input"
                      />
                      <label
                        htmlFor="category"
                        className="input-label-work-brand"
                      >
                        Category
                      </label>
                      {errors.category && (
                        <p className="message-required">Category is required</p>
                      )}
                    </div>
                  </div>
                  <button type="submit" className="submit-btn">
                    {editIndex !== null ? "Update Work" : "Create Work"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Work;
