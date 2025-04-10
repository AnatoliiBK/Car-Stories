import React from "react";
import "./PageNavigation.css";
import { useTheme } from "../components/ThemeContext";

const PageNavigation = ({ page, totalPages, setPage }) => {
  const { theme } = useTheme();
  if (totalPages <= 1) return null;

  const visiblePages = 5; // Кількість сторінок, що відображаються в пагінації
  let startPage = Math.max(1, page - Math.floor(visiblePages / 2));
  let endPage = Math.min(totalPages, startPage + visiblePages - 1);

  if (endPage - startPage < visiblePages - 1) {
    startPage = Math.max(1, endPage - visiblePages + 1);
  }
  //   return (
  //   <div className="pagination">
  //     <button
  //       onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
  //       disabled={page === 1}
  //     >
  //       Попередня
  //     </button>

  //     <span className={`${theme}`}>Сторінка {page} з {totalPages}</span>

  //     <button
  //       onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
  //       disabled={page === totalPages}
  //     >
  //       Наступна
  //     </button>
  //   </div>
  // );
  return (
    <div className="pagination">
      {/* <button
        onClick={() => setPage(page - 1)}
        disabled={page === 1}
        className={`nav-button ${theme}`}
      >
        Попередня
      </button> */}
      {/* Приховуємо кнопку "Попередня", якщо це перша сторінка */}
      {page > 1 && (
        <button 
          onClick={() => setPage(page - 1)}
          className={`nav-button ${theme}`}
        >
          Попередня
        </button>
      )}

      {startPage > 1 && (
        <>
          <button
            onClick={() => setPage(1)}
            // className={page === 1 ? "active" : ""}
            className={`page-button ${page === 1 ? "active" : ""} ${theme}`}
          >
            1
          </button>
          {startPage > 2 && <span className={`dots ${theme}`}>...</span>}
        </>
      )}

      {Array.from({ length: endPage - startPage + 1 }, (_, i) => (
        <button
          key={startPage + i}
          onClick={() => setPage(startPage + i)}
          // className={page === startPage + i ? "active" : ""}
          className={`page-button ${
            page === startPage + i ? "active" : ""
          } ${theme}`}
        >
          {startPage + i}
        </button>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && (
            <span className={`dots ${theme}`}>...</span>
          )}
          <button
            onClick={() => setPage(totalPages)}
            // className={page === totalPages ? "active" : ""}
            className={`page-button ${
              page === totalPages ? "active" : ""
            } ${theme}`}
          >
            {totalPages}
          </button>
        </>
      )}

      {/* <button
        onClick={() => setPage(page + 1)}
        disabled={page === totalPages}
        className={`nav-button ${theme}`}
      >
        Наступна
      </button> */}
      {/* Приховуємо кнопку "Наступна", якщо це остання сторінка */}
      {page < totalPages && (
        <button 
          onClick={() => setPage(page + 1)}
          className={`nav-button ${theme}`}
        >
          Наступна
        </button>
      )}
    </div>
  );
};

export default PageNavigation;
