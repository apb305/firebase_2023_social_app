import React, { Fragment } from "react";
//import spinner from "./spinner.gif";

const Spinner = () => (
  <Fragment>
    <div className="text-center mt-5">
      <div className="spinner-border" role="status">
        <span className="visually-hidden"></span>
      </div>
    </div>
  </Fragment>
);

export default Spinner;
