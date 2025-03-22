import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { PrimaryButton, CancelButton } from "./CommonStyled";
import { useDispatch } from "react-redux";
import { productsCreate } from "../../slices/productsSlice";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../components/ThemeContext";

import { styled as muiStyled } from "@mui/system";

import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const CreateProduct = () => {
  const [open, setOpen] = React.useState(false);
  const [productImg, setProductImg] = useState("");
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [fullDesc, setFullDesc] = useState({
    display: "",
    processor: "",
    memory: "",
    camera: "",
    battery: "",
    weight: "",
    os: "",
    advantages: [],
    disadvantages: [],
  });
  const [isFormVisible, setIsFormVisible] = useState(true);

  const { theme } = useTheme(); // Додаємо тему з контексту

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // console.log("PRODUCT IMG : ", productImg);

  const handleProductImageUpload = (e) => {
    const file = e.target.files[0];
    // console.log("FILE : ", file)
    TransformFile(file);
  };

  const TransformFile = (file) => {
    const reader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => setProductImg(reader.result);
    } else {
      setProductImg("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      productsCreate({
        name,
        brand,
        desc,
        price,
        image: productImg,
        fullDesc,
      })
    );
    setIsFormVisible(false);
  };

  const handleFullDescChange = (e) => {
    const { name, value } = e.target;
    setFullDesc((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAdvantagesChange = (e) => {
    setFullDesc((prev) => ({
      ...prev,
      advantages: e.target.value.split(","),
    }));
  };

  const handleDisadvantagesChange = (e) => {
    setFullDesc((prev) => ({
      ...prev,
      disadvantages: e.target.value.split(","),
    }));
  };

  return (
    <StyledContainer>
      {isFormVisible ? (
        <>
          {/* <StyledText>
        <h3><strong>Create A Product</strong></h3>
      </StyledText> */}
          <StyledHead>
            <h3>
              <strong>Create A Product</strong>
            </h3>
            <CustomIconButton onClick={() => navigate("/admin/products")}>
              <CloseIcon />
            </CustomIconButton>
          </StyledHead>
          <StyledCreateProduct>
            <StyledForm theme={theme} onSubmit={handleSubmit}>
              <StyledInput
                type="file"
                accept="image/"
                onChange={handleProductImageUpload}
                required
                theme={theme}
              />
              <StyledSelect
                theme={theme}
                required
                onChange={(e) => setBrand(e.target.value)}
              >
                <option value="">Select Brand</option>
                <option value="iPhone">iPhone</option>
                <option value="Samsung">Samsung</option>
                <option value="Xiomi">Xiaomi</option>
                <option value="Other">Other</option>
              </StyledSelect>
              <StyledInput
                type="text"
                required
                placeholder="Nane"
                onChange={(e) => setName(e.target.value)}
                theme={theme}
              />
              <StyledInput
                type="text"
                required
                placeholder="Price"
                onChange={(e) => setPrice(e.target.value)}
                theme={theme}
              />
              <StyledInput
                type="text"
                required
                placeholder="Short Description"
                onChange={(e) => setDesc(e.target.value)}
                theme={theme}
              />
              <StyledInput
                type="text"
                placeholder="Display"
                name="display"
                onChange={handleFullDescChange}
                theme={theme}
              />
              <StyledInput
                type="text"
                placeholder="Processor"
                name="processor"
                onChange={handleFullDescChange}
                theme={theme}
              />
              <StyledInput
                type="text"
                placeholder="Memory"
                name="memory"
                onChange={handleFullDescChange}
                theme={theme}
              />
              <StyledInput
                type="text"
                placeholder="Camera"
                name="camera"
                onChange={handleFullDescChange}
                theme={theme}
              />
              <StyledInput
                type="text"
                placeholder="Battery"
                name="battery"
                onChange={handleFullDescChange}
                theme={theme}
              />
              <StyledInput
                type="text"
                placeholder="Weight"
                name="weight"
                onChange={handleFullDescChange}
                theme={theme}
              />
              <StyledInput
                type="text"
                placeholder="OS"
                name="os"
                onChange={handleFullDescChange}
                theme={theme}
              />
              <StyledInput
                type="text"
                placeholder="Advantages (comma separated)"
                onChange={handleAdvantagesChange}
                theme={theme}
              />
              <StyledInput
                type="text"
                placeholder="Disadvantages (comma separated)"
                onChange={handleDisadvantagesChange}
                theme={theme}
              />
              <PrimaryButton type="submit">Create</PrimaryButton>
            </StyledForm>
            <ImagePreview>
              {productImg ? (
                <img src={productImg} alt="" />
              ) : (
                <p>Image preview will apper here</p>
              )}
            </ImagePreview>
          </StyledCreateProduct>
          <CancelButton onClick={() => navigate("/admin/products")}>
            Cancel
          </CancelButton>
        </>
      ) : (
        <StyledHead>
          <h3>
            <strong>Successfully Created!</strong>
          </h3>
          <ComBackButton onClick={() => navigate("/admin/products")}>
            Back To Products
          </ComBackButton>
        </StyledHead>
      )}

      {/* <CancelButton onClick={() => navigate("/admin/products")}>
        Cancel
      </CancelButton> */}
    </StyledContainer>
  );
};

export default CreateProduct;

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  @media (min-width: 425px) {
    padding: 1rem 2rem;
  }
`;
// const gradientAnimation = keyframes`
//    0% {
//     background-position: 0% 50%;
//   }
//   50% {
//     background-position: 100% 50%;
//   }
//   100% {
//     background-position: 0% 50%;
//   }
// `;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const colorChange = keyframes`
  0% {
    color: yellow;
  }
  100% {
    color: green;
  }
`;

/* const StyledText = styled.div`
  text-align: center;
  animation: ${colorChange} 1s infinite alternate;
`; */

/* 0% { background-position: 0% 50%; } означає, що на початку анімації фон
 починається з лівого краю (0%) по горизонталі та на 50% по вертикалі.
 50% { background-position: 100% 50%; } означає, що на середині тривалості анімації
 фон переміщається до правого краю (100%) по горизонталі та залишається на
50% по вертикалі.
100% { background-position: 0% 50%; } означає, що в кінці анімації фон повертається
 до лівого краю (0%) по горизонталі та на 50% по вертикалі. */
/* const StyledText = styled.div`
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  /* background: linear-gradient(90deg, yellow, green, yellow); */
/*background: linear-gradient(90deg, yellow, green);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  color: transparent;
  animation: ${gradientAnimation} 3s linear infinite;
`; */

const StyledCreateProduct = styled.div`
  display: flex;
  justify-content: space-around;
  padding-right: 5px;
  padding-left: 5px;
  @media (max-width: 768.98px) {
    flex-direction: column-reverse;
    align-items: center;
  }
`;

const StyledHead = styled.div`
  display: flex;
  @media (max-width: 767.98px) {
    flex-direction: column;
  }
  justify-content: space-around;
  align-items: center;
  margin-bottom: 1rem;
  h3 {
    margin-bottom: 0;
  }
  animation: ${colorChange} 1s infinite alternate;
`;

const CustomIconButton = muiStyled(IconButton)({
  color: "#1976d2",
  "&:focus": {
    /* transform: scale(1.05); */
    color: "blue",
  },
  "&:hover": {
    /* transform: scale(1.05); */
    color: "blue",
  },
});

// const StyledForm = styled.form`
//   display: flex;
//   flex-direction: column;
//   max-width: 300px;
//   margin-top: 2rem;
//   select,
//   input {
//     padding: 7px;
//     min-height: 30px;
//     outline: none;
//     border-radius: 5px;
//     border: 1px solid rgb(182, 182, 182);
//     margin: 0.3rem 0;

//     &:focus {
//       border: 2px solid rgb(0, 208, 255);
//     }
//     &:hover {
//       border: 2px solid rgb(0, 208, 255);
//     }
//   }
//   select {
//     color: rgb(95, 95, 95);
//   }
// `;

const StyledForm = styled.form`
  font-size: 1.1rem;
  display: flex;
  flex-direction: column;
  max-width: 300px;
  margin-top: 2rem;

  background-color: ${({ theme }) => (theme === "dark" ? "#0f0f0f" : "#fff")};
  color: ${({ theme }) => (theme === "dark" ? "#fff" : "#000")};
`;

const StyledInput = styled.input`
  padding: 7px;
  min-height: 30px;
  outline: none;
  border-radius: 5px;
  border: 1px solid rgb(182, 182, 182);
  margin: 0.3rem 0;
  background-color: ${({ theme }) => (theme === "dark" ? "#292828" : "#fff")};
  color: ${({ theme }) => (theme === "dark" ? "#fff" : "#000")};

  &:focus {
    border: 2px solid rgb(0, 208, 255);
  }
  &:hover {
    border: 2px solid rgb(0, 208, 255);
  }
`;

const StyledSelect = styled.select`
  padding: 7px;
  min-height: 30px;
  outline: none;
  border-radius: 5px;
  border: 1px solid rgb(182, 182, 182);
  margin: 0.3rem 0;
  background-color: ${({ theme }) => (theme === "dark" ? "#292828" : "#fff")};
  color: ${({ theme }) => (theme === "dark" ? "#fff" : "#000")};

  &:focus {
    border: 2px solid rgb(0, 208, 255);
  }
  &:hover {
    border: 2px solid rgb(0, 208, 255);
  }
`;

const StyledTextarea = styled.textarea`
  padding: 7px;
  min-height: 60px;
  outline: none;
  border-radius: 5px;
  border: 1px solid rgb(182, 182, 182);
  margin: 0.3rem 0;
  background-color: ${({ theme }) => (theme === "dark" ? "#555" : "#fff")};
  color: ${({ theme }) => (theme === "dark" ? "#fff" : "#000")};

  &:focus {
    border: 2px solid rgb(0, 208, 255);
  }
  &:hover {
    border: 2px solid rgb(0, 208, 255);
  }
`;

const ImagePreview = styled.div`
  margin: 2rem 0 2rem 2rem;
  padding: 2rem;
  border: 1px solid rgb(183, 183, 183);
  max-width: 300px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: rgb(78, 78, 78);
  img {
    max-width: 100%;
  }
  @media (max-width: 768.98px) {
    margin-left: 0;
  }
`;

const ComBackButton = styled.button`
  /* text-transform: uppercase; */
  padding: 8px;
  /* border-radius: 5px; */
  font-weight: 400;
  /* letter-spacing: 1.15px; */
  /* background-color: gray; */
  background: none;
  /* color: #f9f9f9; */
  color: #1976d2;
  border: none;
  outline: none;
  cursor: pointer;
  /* margin: 0.5rem; */
  margin-top: 0.5rem;
  margin-left: auto;
  &:focus {
    transform: scale(1.05);
    color: blue;
  }
  &:hover {
    transform: scale(1.05);
    color: blue;
  }
`;
