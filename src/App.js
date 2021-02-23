import React, {Component} from "react";
import "./App.css";

class App extends Component {
  
  //Constructor, will be called when the client starts the App
  constructor(props) {
    super();
    //When the "state" changes the page will re-render
    this.state = {
      list: false,
      search: false,
      residuos: [],
      residuo: {},
      contenedores: [],
      address: "calle juan tornero, 40"
    };
  }

  //What happens when we first open the app
  componentDidMount() {
    var aux = [];
    fetch("http://localhost:3001/residuos")
      .then(response => response.json())
      .then(responseJson => {
        responseJson.map(element => aux.push(element));
        this.setState({ 
          residuos: responseJson 
        });
      });
    this.setState({ 
      search: false, 
      list: true,
    });
  }

  /************** Fetch from API ******************/

  listResiduos = () => {
    var aux = [];
    fetch("http://localhost:3001/residuos")
      .then(response => response.json())
      .then(responseJson => {
        responseJson.map(element => aux.push(element));
        this.setState({ 
          residuos: responseJson 
        });
      });
    this.setState({ 
      search: false, 
      list: true,
    });
  };

  /*residuoSearch = (name) => {
    //var aux = [];
    fetch(`http://localhost:3001/residuos/${name}`)
      .then(response => response.json())
      .then(responseJson => {
        //responseJson.map(element => aux.push(element));
        this.setState({ 
          residuo: responseJson 
        });
      });
    this.setState({ 
      search: false, 
      list: true,
    });
  };*/

  clientSearch = (name, address) => {
    var aux = [];
    fetch(`http://localhost:3001/residuos/${name}`)
      .then(response => response.json())
      .then(responseJson => {
        //responseJson.map(element => aux.push(element));
        this.setState({ 
          residuo: responseJson 
        });
      });
    aux = [];
    fetch(`http://localhost:3001/residuos/${name}/${address}`)
      .then(response => response.json())
      .then(responseJson => {
        responseJson.map(element => aux.push(element));
        this.setState({ 
          contenedores: responseJson 
        });
      });
    this.setState({ 
      search: true, 
      list: false,
    });
  };

 /************** Fetch from API ******************/

 /************** Render ******************/
  render() {
    return (
      <div className = "container">
        {this.state.list ? (
          <div className = "list">
            {this.state.residuos.map(residuo => (
              <li
                //*!*!*! Cambiar para que cuando se haga click en un residuo nos lleve a la página principal
                // onClick = {() => this.residuoSearch()}
                onClick = {() => { 
                  this.clientSearch(residuo.nombre, this.state.address);
                }} 
                className = "list-item"
              >
                {residuo.nombre}
              </li>
            ))}
          </div>
        ) : null}
        {this.state.search ? (
          <div className = "search">
            <h1
              onClick = {() => { 
                console.log(this.state.contenedores);
                console.log(this.state.residuos);
                console.log(this.state.residuo);
              }}
            >
              WORKS {this.state.residuos[0].nombre}</h1>
          </div>
        ) : null}
      </div>
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
