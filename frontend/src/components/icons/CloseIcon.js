const CloseIcon = ({ className = "", ...props }) => (
  <svg viewBox="0 0 20 20" className={`close-icon-svg ${className}`} {...props}>
    <path d="M10 8.586l4.95-4.95 1.414 1.414L11.414 10l4.95 4.95-1.414 1.414L10 11.414l-4.95 4.95-1.414-1.414L8.586 10 3.636 5.05l1.414-1.414L10 8.586z" />
  </svg>
);

export default CloseIcon;

// const CloseIcon = ({ width = 35, height = 35, className = "" }) => {
//   return (
//     <svg viewBox="0 0 20 20" className="clear-icon-svg">
//       <path d="M10 8.586l4.95-4.95 1.414 1.414L11.414 10l4.95 4.95-1.414 1.414L10 11.414l-4.95 4.95-1.414-1.414L8.586 10 3.636 5.05l1.414-1.414L10 8.586z" />
//     </svg>
//   );
// };

// export default CloseIcon;
