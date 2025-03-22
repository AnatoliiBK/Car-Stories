import styled from "styled-components";

const Widget = ({ data }) => {
  const isPositive = data.percentage >= 0;

  return (
    <StyledWidget>
      <Icon color={data.color} bgcolor={data.bgColor}>
        {data.icon}
      </Icon>
      <Text>
        <h3>
          {data.isMoney
            ? "$" + data.digits?.toLocaleString()
            : data.digits?.toLocaleString()}
        </h3>
        <p>{data.title}</p>
      </Text>
      <Percentage positive={isPositive.toString()}>
        {Math.floor(data.percentage) + "%"}
      </Percentage>
    </StyledWidget>
  );
};

export default Widget;

const StyledWidget = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  @media(max-width: 768.98px) {
    flex-wrap: wrap;
  }
`;

const Icon = styled.div`
  margin-right: 0.5rem;
  padding: 0.5rem;
  color: ${({ color }) => color};
  background: ${({ bgcolor }) => bgcolor};
  font-size: 20px;
  border-radius: 3px;
  @media(max-width: 375.98px) {
    display: none;
  }
`;

const Text = styled.div`
  h3 {
    font-weight: 900;
    /* @media(max-width: 375.98px) {
      font-size: 20px;
    } */
  }
  p {
    font-size: 14px;
    color: rgba(234, 234, 255, 0.68);
  }
`;

const Percentage = styled.div`
  margin-left: 0.5rem;
  font-size: 14px;
  color: ${({ positive }) => (positive === "true" ? "rgb(114, 225, 40)" : "rgb(255, 77, 73)")};
  @media (max-width: 768.98px) {
    width: 100%; // Займає всю ширину контейнера
    margin-top: 10px; // Додаємо відступ зверху для більшого простору
  }
`;



// import styled from "styled-components";

// const Widget = ({ data }) => {
//   return (
//     <StyledWidget>
//       <Icon color={data.color} bgcolor={data.bgColor}>
//         {data.icon}
//       </Icon>
//       <Text>
//         <h3>
//           {data.isMoney
//             ? "$" + data.digits?.toLocaleString()
//             : data.digits?.toLocaleString()}
//         </h3>
//         <p>{data.title}</p>
//       </Text>
//       {data.percentage < 0 ? (
//         <>
//           <Percentage isPositive={false}>
//             {Math.floor(data.percentage) + "%"}
//           </Percentage>
//         </>
//       ) : (
//         <>
//           <Percentage isPositive={true}>
//             {Math.floor(data.percentage) + "%"}
//           </Percentage>
//         </>
//       )}
//     </StyledWidget>
//   );
// };

// export default Widget;

// const StyledWidget = styled.div`
//   display: flex;
//   align-items: center;
// `;
// const Icon = styled.div`
//   margin-right: 0.5rem;
//   padding: 0.5rem;
//   color: ${({ color }) => color};
//   background: ${({ bgcolor }) => bgcolor};
//   font-size: 20px;
//   border-radius: 3px;
// `;
// const Text = styled.div`
//   h3 {
//     font-weight: 900;
//   }
//   p {
//     font-size: 14px;
//     color: rgba(234, 234, 255, 0.68);
//   }
// `;
// const Percentage = styled.div`
//   margin-left: 0.5rem;
//   font-size: 14px;
//   color: ${({ isPositive }) =>
//     isPositive ? "rgb(114, 225, 40)" : "rgb(255, 77, 73)"};
// `;
