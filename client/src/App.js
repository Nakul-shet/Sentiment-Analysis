import React from "react";

import Form from "./components/form";
import BarChart from "./components/barchart";
import Nav from "./components/navigation";
import History from "./components/history";
import Reviews from "./components/Reviews";
import Percentage from "./components/Percentage";
import Tracker from "./components/tracker";
import RemoveTrack from "./components/removeTrack";
import Find from "./components/findProduct";

import {BrowserRouter as Router , Routes , Route} from "react-router-dom";

const App = () => {

  return(
    <>
      <Router>
          <Routes>
              <Route path="/" element={<Form/>}/>
              <Route path="/display/:product" element={<BarChart/>}/>
              <Route path="/displayHistory" element={<History/>}/>
              <Route path="/getRetreives/:product" element={<Reviews/>}/>
              <Route path="/percentage/:positive/:negative/:neutral" element={<Percentage/>}/>
              {/* <Route path="/track/:positive/:negative/:neutral/:product" element={<Track/>}/> */}
              <Route path="/removeTrack/:product" element={<RemoveTrack/>}/>
              <Route path="/trackHistory" element={<Tracker/>}/>
              <Route path="/find" element={<Find/>}/>
          </Routes>
      </Router>  
    </>
  );
}

export default App;