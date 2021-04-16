import React, {Component} from "react";
import Button from "./button.js";

class Form extends Component {
  
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.showMultipleSearchOptions = this.showMultipleSearchOptions.bind(this);
  }

  componentDidMount() {
    var residuosNames = new Array();
    var options = '';

    this.props.residuos.map(residuo => residuosNames.push(residuo.nombre));    
    
    for (var i = 0; i < residuosNames.length; i++) {
      options += '<option value="' + residuosNames[i] + '" />';
    }

    document.getElementById('datalistOptions').innerHTML = options;
  }

  showMultipleSearchOptions = () => {
    var searchOptions = '';
    var html = document.getElementById('multipleSearchOptions');
    var first = true;

    if (this.props.multipleSearchOptions) { 
      this.props.searchOptions.map(option => {
        if (first) {
          searchOptions += '<div><label><input type="radio" name="optradio" value="' + option.nombre + '"checked>' + option.nombre + '</label></div>';
          first = false;
        }
        else
          searchOptions += '<div><label><input type="radio" name="optradio" value="' + option.nombre + '">' + option.nombre + '</label></div>';
      });
    }

    if(html) {
      html.innerHTML = searchOptions;
    }
  };
 
  handleSubmit = (event) => {
    event.preventDefault();
    var name = "";
    var address = document.getElementById('clientLocation').value;

    if(this.props.multipleSearchOptions) {
      document.getElementsByName("optradio").forEach(button => { if(button.checked) name=button.value });
      document.getElementById("residuoName").value = name;
    }
    else
      name = document.getElementById('residuoName').value;

    if (name != "") this.props.onClientSearch(name, address);
  };

 /************** Render ******************/
  render() {

    this.showMultipleSearchOptions();
    
    return (
      <div className = "form">
        <video src="/images/Botella.mp4" autoPlay loop muted/>
        <form onSubmit={this.handleSubmit}>  
          <div class="form-group" id="inputName">
            <label for="residuoName" class="form-label">¿De qué te quieres deshacer?</label>
            <input 
              class="form-control form-control-lg" 
              list="datalistOptions" 
              id="residuoName" 
              placeholder="Escribe el nombre del residuo..."
            />
            <datalist id="datalistOptions"></datalist>
          </div>
          <div class="form-group" id="multipleSearchOptions"></div>
          <div class="form-group">
            <label for="clientLocation" class="form-label">¿Dónde?</label>
            <input 
              type="text" 
              class="form-control form-control-lg" 
              id="clientLocation" 
              aria-describedby="inputHelp" 
              placeholder="Escribe una dirección..."
            />
            <small id="inputHelp" class="form-text text-muted">Si no introduces una dirección se mostrarán todos los puntos de deshecho de la ciudad</small>
          </div>
          <Button type="submit" style="btn--outline">Buscar</Button>
        </form>
      </div>
    )
  }
  /************** Render ******************/

}

export default Form;