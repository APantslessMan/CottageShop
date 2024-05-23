import React from "react";

const Wrapper = ({ component: Component, ...props }) => {
  return <Component {...props} />;
};

export default Wrapper;
