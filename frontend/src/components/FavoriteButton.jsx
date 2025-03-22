import React, { useEffect, useState } from "react";
import axios from "axios";
import { url, setHeaders } from "../slices/api";

const FavoriteButton = ({ productId}) => {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const checkIfFavorite = async () => {
      try {
        const res = await axios.get(`${url}/favorites/${productId}`, setHeaders());
        if (res.data.isFavorite) {
          setIsFavorite(true);
        }
      } catch (error) {
        console.log(error);
      }
    };

    checkIfFavorite();
  }, [productId]);

  const handleToggleFavorite = async () => {
    try {
      if (isFavorite) {
        await axios.delete(`${url}/favorites/${productId}`, setHeaders());
        // removeFavorite(productId); // Видаляємо продукт з обраних у локальному стані
      } else {
        await axios.post(`${url}/favorites`, { productId }, setHeaders());
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <button onClick={handleToggleFavorite} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
      {isFavorite ? '❤️' : '🤍'}
    </button>
  );
};

export default FavoriteButton;
