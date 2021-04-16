import React, {Component} from "react";
import "./App.css";

/*Imported components*/
import Navbar from "./components/navbar.js";
import Form from "./components/form.js";
import MyMap from "./components/map.js";

class App extends Component {
  
  constructor(props) {
    super(props);
    
    this.state = {
      loaded: false,
      search: false,
      
      address: "",
      residuos: [],
      residuo: {},
      infoContenedores: [],
      contenedores: [],

      multipleSearchOptions: false,
      searchOptions: []
    };
    
    this.handleClientSearch = this.handleClientSearch.bind(this);
    this.clientSearch = this.clientSearch.bind(this);
  }

  componentDidMount() {
    var aux = [];
    fetch("http://localhost:3001/residuos")
      .then(response => response.json())
      .then(responseJson => responseJson.map(element => aux.push(element)))
      .then(promise => 
        this.setState({ 
          residuos: aux, 
          loaded: true
        })
      );
  }

  handleClientSearch = (name, address) => {
    if (address == "") address = "all";
    this.setState({ address: address, search: false});
    this.clientSearch(name, address);
  };

  clientSearch = (name, address) => {

    if(this.state.multipleSearchOptions) this.setState({multipleSearchOptions: false});

    fetch(`http://localhost:3001/residuos/${name}`)
      .then(response => response.json())
      .then(responseJson => {  
        if(responseJson.hasOwnProperty('nombre')) {
          this.setState({ residuo: responseJson });
          fetch(`http://localhost:3001/residuos/${name}/${address}`)
            .then(response => response.json())
            .then(responseJson =>                
              this.setState({ 
                infoContenedores: responseJson.slice(0, responseJson[0] + 1),
                contenedores: responseJson.slice(responseJson[0] + 1),
                search: true
              })
            ).then(promise => document.getElementById("mapa").scrollIntoView({behavior: "smooth"}));
        } else if (responseJson.length > 1) {
          this.setState({ 
            searchOptions: responseJson,
            multipleSearchOptions: true
          });
        } else if(responseJson.message.includes("Not found")) {
          this.setState({ 
            searchOptions: this.state.residuos,
            multipleSearchOptions: true
          });
        }
      });          
  };

  showAlert = (addressStatus) => {
    document.getElementById('alert').innerHTML = addressStatus;
  };

  showLeyenda = (leyenda) => {
    document.getElementById('leyenda').innerHTML = leyenda;
  };

 /************** Render ******************/
  render() {
    return (
      <>
        <Navbar></Navbar>
        {this.state.loaded ? (
          <Form 
            residuos = {this.state.residuos}
            onClientSearch = {this.handleClientSearch}
            multipleSearchOptions = {this.state.multipleSearchOptions}
            searchOptions = {this.state.searchOptions}
          />
        ) : null}
        {this.state.search ? (
          <>
            <div id="mapa" className="map-area">
              <p id="alert"></p>
              <div id="leyenda"></div>
              <MyMap 
                onInvalidAddress = {this.showAlert}
                showLeyenda = {this.showLeyenda}
                contenedores = {this.state.contenedores}
                infoContenedores = {this.state.infoContenedores}
                address = {this.state.address}
              />
            </div>
            <div id="treatment" className="treatment">

            </div>
            <div id="alternative" className="alternative">
              
            </div>
          </>
        ) : null}
      </>
    )
  }
  /************** Render ******************/

}

export default App;

/***************************/

/*import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;*/
