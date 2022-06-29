/* eslint-disable react/self-closing-comp */
const Loader = () => {
  return (
    <div className="lds-ring">
      <div
        style={{
          width: "48px",
          height: "48px",
          border: "6px solid black",
          borderColor: " #fff transparent transparent transparent",
        }}
      ></div>
      <div
        style={{
          width: "48px",
          height: "48px",
          border: "6px solid black",
          borderColor: " #fff transparent transparent transparent",
        }}
      ></div>
      <div
        style={{
          width: "48px",
          height: "48px",
          border: "6px solid black",
          borderColor: " #fff transparent transparent transparent",
        }}
      ></div>
      <div
        style={{
          width: "48px",
          height: "48px",
          border: "6px solid black",
          borderColor: " #fff transparent transparent transparent",
        }}
      ></div>
    </div>
  );
};

export default Loader;

// .lds-ring {
//   display: inline-block;
//   position: relative;
//   width: 80px;
//   height: 80px;
// }
// .lds-ring div {
//   box-sizing: border-box;
//   display: block;
//   position: absolute;
//   width: 64px;
//   height: 64px;
//   margin: 8px;
//   border: 8px solid #fff;
//   border-radius: 50%;
//   animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
//   border-color: #fff transparent transparent transparent;
// }
// .lds-ring div:nth-child(1) {
//   animation-delay: -0.45s;
// }
// .lds-ring div:nth-child(2) {
//   animation-delay: -0.3s;
// }
// .lds-ring div:nth-child(3) {
//   animation-delay: -0.15s;
// }
// @keyframes lds-ring {
//   0% {
//     transform: rotate(0deg);
//   }
//   100% {
//     transform: rotate(360deg);
//   }
// }
