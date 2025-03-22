import * as React from "react";
import Button from "@mui/material/Button";
// import TextField from '@mui/material/TextField';
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
// import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from "@mui/material/DialogTitle";
import styled, {keyframes} from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { PrimaryButton } from "./CommonStyled";
import { productsEdit } from "../../slices/productsSlice";
import { useTheme } from "../../components/ThemeContext";
import { styled as muiStyled } from "@mui/system";

import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

export default function EditProduct({ prodId }) {
  const [open, setOpen] = React.useState(false);

  const [currentProd, setCurrentProd] = useState({});
  const [previewImg, setPreviewImg] = useState("");

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

  const dispatch = useDispatch();
  const { productsList, editStatus } = useSelector((state) => state.products);
  const { theme } = useTheme(); // Додаємо тему з контексту

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
      reader.onloadend = () => {
        setProductImg(reader.result);
        setPreviewImg(reader.result);
      };
    } else {
      setProductImg("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      productsEdit({
        productImg,
        product: {
          ...currentProd,
          name: name,
          brand: brand,
          price: price,
          desc: desc,
          fullDesc,
        },
      })
    );
  };

  const handleClickOpen = () => {
    setOpen(true);
    let selectedProd = productsList.filter((product) => product._id === prodId);
    selectedProd = selectedProd[0];
    // console.log("SELECTED PRODUCT : ", selectedProd)
    setCurrentProd(selectedProd);
    setPreviewImg(selectedProd.image.url);
    setProductImg("");
    setBrand(selectedProd.brand);
    setName(selectedProd.name);
    setPrice(selectedProd.price);
    setDesc(selectedProd.desc);
    setFullDesc(selectedProd.fullDesc || {});
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleFullDescChange = (e) => {
    const { name, value } = e.target;
    setFullDesc((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <React.Fragment>
      <EditButton onClick={handleClickOpen}>Edit</EditButton>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth={true} //додано для розширення діалогового вікна на більших екранах
        maxWidth={"md"} //додано для розширення діалогового вікна на більших екранах
        sx={{
          "& .MuiDialog-paper": {
            "@media (max-width: 375px)": {
              width: "90%",
              margin: 0,
            },
          },
        }} // sx для того щоб діалогове вікно займало всю ширину екрана при 375
      >
        <StyledDialogContent theme={theme}>
          <StyledEditProduct theme={theme}>
            <StyledForm theme={theme} onSubmit={handleSubmit}>
              <StyledHead>
                <h3>Edit Product</h3>
                <CustomIconButton onClick={handleClose}>
                  <CloseIcon />
                </CustomIconButton>
              </StyledHead>

              <StyledInput
                type="file"
                accept="image/"
                onChange={handleProductImageUpload}
                theme={theme}
                // required //required не потрібен бо зображення може залишатись
                // тим самим (щоб повторно не вибирати його з поля вибору)
              />
              <StyledSelect
                required
                onChange={(e) => setBrand(e.target.value)}
                value={brand}
                theme={theme}
              >
                <option value="">Select Brand</option>
                <option value="iPhone">iPhone</option>
                <option value="Samsung">Samsung</option>
                <option value="Xiomi">Xiomi</option>
                <option value="Other">Other</option>
              </StyledSelect>
              <StyledInput
                type="text"
                required
                value={name}
                placeholder="Nane"
                onChange={(e) => setName(e.target.value)}
                theme={theme}
              />
              <StyledInput
                type="text"
                required
                value={price}
                placeholder="Price"
                onChange={(e) => setPrice(e.target.value)}
                theme={theme}
              />
              <StyledInput
                type="text"
                required
                value={desc}
                placeholder="Short Description"
                onChange={(e) => setDesc(e.target.value)}
                theme={theme}
              />
              {/* Add fields for fullDesc */}
              <StyledInput
                type="text"
                value={fullDesc.display}
                placeholder="Display"
                name="display"
                onChange={handleFullDescChange}
                theme={theme}
              />
              <StyledInput
                type="text"
                value={fullDesc.processor}
                placeholder="Processor"
                name="processor"
                onChange={handleFullDescChange}
                theme={theme}
              />
              <StyledInput
                type="text"
                value={fullDesc.memory}
                placeholder="Memory"
                name="memory"
                onChange={handleFullDescChange}
                theme={theme}
              />
              <StyledInput
                type="text"
                value={fullDesc.camera}
                placeholder="Camera"
                name="camera"
                onChange={handleFullDescChange}
                theme={theme}
              />
              <StyledInput
                type="text"
                value={fullDesc.battery}
                placeholder="Battery"
                name="battery"
                onChange={handleFullDescChange}
                theme={theme}
              />
              <StyledInput
                type="text"
                value={fullDesc.weight}
                placeholder="Weight"
                name="weight"
                onChange={handleFullDescChange}
                theme={theme}
              />
              <StyledInput
                type="text"
                value={fullDesc.os}
                placeholder="Operating System"
                name="os"
                onChange={handleFullDescChange}
                theme={theme}
              />
              <StyledTextarea
                value={fullDesc.advantages.join(", ")}
                placeholder="Advantages (comma separated)"
                name="advantages"
                onChange={(e) =>
                  setFullDesc((prev) => ({
                    ...prev,
                    advantages: e.target.value
                      .split(",")
                      .map((item) => item.trim()),
                  }))
                }
                theme={theme}
              />
              <StyledTextarea
                value={fullDesc.disadvantages.join(", ")}
                placeholder="Disadvantages (comma separated)"
                name="disadvantages"
                onChange={(e) =>
                  setFullDesc((prev) => ({
                    ...prev,
                    disadvantages: e.target.value
                      .split(",")
                      .map((item) => item.trim()),
                  }))
                }
                theme={theme}
              />
              <PrimaryButton type="submit">
                {editStatus === "pending" ? "Submitting" : "Edit"}
              </PrimaryButton>
            </StyledForm>
            <ImagePreview>
              {previewImg ? (
                <img src={previewImg} alt="" />
              ) : (
                <p>Image preview will apper here</p>
              )}
            </ImagePreview>
          </StyledEditProduct>
        </StyledDialogContent>
        <StyledDialogActions theme={theme}>
          <Button onClick={handleClose}>Cancel</Button>
        </StyledDialogActions>
      </Dialog>
    </React.Fragment>
  );
}

const EditButton = styled.div`
  // кнопка у випадаючому меню Actions що в в списку продуктів
  border: none;
  outline: none;
  padding: 0px 5px;
  border-radius: 3px;
  color: white;
  cursor: pointer;
  background-color: #4b70e2;
  text-align: center;
  &:focus {
    /* transform: scale(1.05); */
    color: white;
    background-color: blue;
  }
  &:hover {
    /* transform: scale(1.05); */
    color: white;
    background-color: blue
  }
`;

const colorChange = keyframes`
  0% {
    color: yellow;
  }
  100% {
    color: green;
  }
`;

const StyledHead = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  h3 {
    margin-bottom: 0;
  }
  animation: ${colorChange} 1s infinite alternate;
`;

const CustomIconButton = muiStyled(IconButton)({
  color: '#1976d2',
  "&:focus": {
    /* transform: scale(1.05); */
    color: "blue",
  },
  "&:hover": {
    /* transform: scale(1.05); */
    color: "blue",
  }
});


const StyledEditProduct = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: ${({ theme }) => (theme === "dark" ? "#333" : "#fff")};
  color: ${({ theme }) => (theme === "dark" ? "#fff" : "#000")};
  @media (max-width: 768.98px) {
    flex-direction: column-reverse;
    align-items: center;
  }
`;

// const StyledForm = styled.form`
//   font-size: 1.1rem;
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
  @media (max-width: 375px) {
    max-width: 270px;
  }

  background-color: ${({ theme }) => (theme === "dark" ? "#333" : "#fff")};
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
  background-color: ${({ theme }) => (theme === "dark" ? "#292828" : "#fff")};
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

// const StyledDialogTitle = muiStyled(DialogTitle)(({ theme }) => ({
//   backgroundColor: theme === 'dark' ? '#333' : '#fff',
//   color: theme === 'dark' ? '#fff' : '#000',
// }));

const StyledDialogContent = muiStyled(DialogTitle)(({ theme }) => ({
  backgroundColor: theme === "dark" ? "#333" : "#fff",
  color: theme === "dark" ? "#fff" : "#000",
}));

const StyledDialogActions = muiStyled(DialogActions)(({ theme }) => ({
  backgroundColor: theme === "dark" ? "#333" : "#fff",
  color: theme === "dark" ? "#fff" : "#000",
  display: "flex",
  justifyContent: "space-around",
  "&:focus": {
    transform: "scale(1.05)",
    color: "blue",
  },
  "&:hover": {
    transform: "scale(1.05)",
    color: "blue",
  },
}));
