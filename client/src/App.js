import React from "react";

import Form from "./components/form";
import BarChart from "./components/barchart";
import Nav from "./components/navigation";
import History from "./components/history";

import {BrowserRouter as Router , Routes , Route} from "react-router-dom";

const App = () => {

  return(
    <>
      <Router>
          <Routes>
              <Route path="/" element={<Form/>}/>
              <Route path="/display/:product" element={<BarChart/>}/>
              <Route path="/displayHistory" element={<History/>}/>
          </Routes>
      </Router>  
    </>
  );
}

export default App;