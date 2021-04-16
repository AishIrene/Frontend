import React, {Component} from "react";
import { Map, GoogleApiWrapper, Marker, InfoWindow } from 'google-maps-react';
import googleAPI from '../googleAPI.config.js';

class MyMap extends Component {
  
  constructor(props) {
    super(props);

    this.state = {

      loaded: false,

      mapCenter: { lat: 40.4166000, lng: -3.7038400 },
      zoom: 12.3,
      addressStatus: "",
      //boundsReady: false,
      //bounds: null,
      
      showInfoWindow: false, 
      clickedMarker: {},      
      selectedContenedor: {}
    };

    this.showAddressStatus = this.showAddressStatus.bind(this);
    this.displayMarkers = this.displayMarkers.bind(this);
    this.handleMarkerClick = this.handleMarkerClick.bind(this);
    this.fixName = this.fixName.bind(this);
    this.closeInfoWindow = this.closeInfoWindow.bind(this);
    //this.fixBounds = this.fixBounds.bind(this);
    //this.onMapReady = this.onMapReady.bind(this);
  }

  componentDidMount() {
    if (this.props.address == "all")
      this.setState({ 
        loaded: true, 
        addressStatus: "empty"
      });
    else
      fetch(`http://localhost:3001/${this.props.address}`)
        .then(response => response.json())
        .then(responseJson => {
          if(responseJson.lat == "all") 
            this.setState({ 
              loaded: true, 
              addressStatus: "invalid" 
            });
          else 
            this.setState({ 
              mapCenter: responseJson,
              loaded: true,
              addressStatus: "valid"
            });
        });
  }

  showAddressStatus = () => {
    var alert = '';
    
    if(this.state.addressStatus == "invalid") alert = 'Invalida';
    else if(this.state.addressStatus == "empty") alert = 'Vacia';
    
    this.props.onInvalidAddress(alert);
  };

  displayMarkers = () => {
    var contenedores = this.props.contenedores;
    var infoContenedores = this.props.infoContenedores;

    var colors = ["red-dot.png", "green-dot.png", "blue-dot.png", "yellow-dot.png"];
    var colorNames = ["Puntero Rojo", "Puntero Verde", "Puntero Azul", "Puntero Amarillo"];
    var colorCounter = 0;
    var colorInfo = '[{"contenedorType":"' + infoContenedores[1].contenedorType + '", "color":"' + colorNames[colorCounter] + '"}';


    return contenedores.map((contenedor, index) => {

      if(index - 1 == infoContenedores[colorCounter + 1].endIndex){
        colorCounter++;
        colorInfo += ', {"contenedorType":"' + infoContenedores[colorCounter].contenedorType + '", "color":"' + colorNames[colorCounter] + '"}';
      }

      if(index == infoContenedores[infoContenedores[0]].endIndex) {
        colorInfo += ']';
        var html = '<p>Foto: Aquí estas tu</p>';
        JSON.parse(colorInfo).map(x => html += '<p>' + x.color + ': ' + x.contenedorType + '</p>');
        this.props.showLeyenda(html);
      }

      return ( 
        <Marker 
          icon={"http://maps.google.com/mapfiles/ms/icons/" + colors[colorCounter]}
          id={index} 
          position={{
            lat: contenedor.latitud,
            lng: contenedor.longitud
          }}
          onClick={this.handleMarkerClick}
        /> 
      )
    })
  };

  handleMarkerClick = (props, marker) => {
    var contenedores = this.props.contenedores;
    var infoContenedores = this.props.infoContenedores;
    var selected = [];

    for(var i = 1; i <= infoContenedores[0]; i++) 
      if (props.id >= infoContenedores[i].startIndex && props.id <= infoContenedores[i].endIndex) {
        selected.push(this.fixName(infoContenedores[i].contenedorType));
        selected.push(contenedores[props.id]);
      }

    this.setState({
      selectedContenedor: selected,
      clickedMarker: marker,
      showInfoWindow: true
     });
  };

  fixName = (wrongName) => {
    var rightName = "";

    wrongName = wrongName.replace(/_/g, " ");
    rightName = wrongName.replace(wrongName[0], wrongName[0].toUpperCase());

    if(!wrongName.includes("punto"))
      rightName = rightName.replace(rightName.slice(10), " de " +  rightName.slice(10).toLowerCase())

    if(wrongName.includes("proximidad")) 
      rightName = rightName.replace("proximidad", " de proximidad");
    else if(wrongName.includes("marquesinas")) 
      rightName = rightName.replace("marquesinas", "en marquesina de autobus");
      
    return rightName;
  };
  
  closeInfoWindow = props => {
    this.setState({
      showInfoWindow: false,
      clickedMarker: null
    });
  };

  /*fixBounds = (contenedor) => {
    var google = this.props.google;
    var bounds = new google.maps.LatLngBounds();
    var contenedores = this.props.contenedores;
    contenedores.forEach(contenedor => {
      var newPoint = new google.maps.LatLng(contenedor.latitud, contenedor.longitud);
      bounds.extend(newPoint);
    })

    this.setState ({
      boundsReady: true, 
      bounds: bounds
    });
  };*/

  /*onMapReady = () => {
    //if(this.state.boundsReady) {

      console.log("here");

      const ne = this.state.bounds.getNorthEast()
      const sw = this.state.bounds.getSouthWest()
      const nw = { lat: ne.lat(), lng: sw.lng() }
      const se = { lat: sw.lat(), lng: ne.lng() }

      var { center, zoom } = this._map.fitBounds({
        se: { lat: se.lat, lng: se.lng },
        nw: { lat: nw.lat, lng: nw.lng }
      }, { width: 225, height: 777 });

      this.setState ({
        //boundsReady: true,
        zoom: zoom
      });
   // }
  };*/

 /************** Render ******************/
  render() {
    
    const mapStyle = {
      position: 'relative',  

      width: '100%',
      height: '100%',

      maxWidth: '1200px',
      maxHeight: '600px', 
    };

    const containerStyle = {
      position: 'relative',  
      
      width: '100%',
      height: '100%',
      maxWidth: '1200px',
      maxHeight: '600px', 
    };

    return (
      <>
        {this.state.loaded ? (
          <div className = "map">
            <Map
              google={this.props.google}
              style={mapStyle}
              containerStyle={containerStyle}
              zoom={this.state.zoom}
              initialCenter={this.state.mapCenter}
              onClick={this.closeInfoWindow}
            >
              {this.showAddressStatus()}
              {this.displayMarkers()}
              <Marker 
                id={"user"} 
              /> 
              <InfoWindow
                marker={this.state.clickedMarker}
                visible={this.state.showInfoWindow}
                onClose={this.closeInfoWindow}
              >
                {this.state.showInfoWindow && (
                  <div className="infowindow">
                    <h5>{this.state.selectedContenedor[0]}</h5>
                    <p><h6>Dirección: </h6>{this.state.selectedContenedor[1].direccion}</p>
                    {this.state.selectedContenedor[1].num_parada != undefined && (<p><h6>Número de parada: </h6>{this.state.selectedContenedor[1].num_parada}</p>)}
                    {this.state.selectedContenedor[1].num_linea != undefined && (<p><h6>Linea de bus: </h6>{this.state.selectedContenedor[1].num_linea}</p>)}
                    {this.state.selectedContenedor[1].centro != undefined && (<p><h6>Centro: </h6>{this.state.selectedContenedor[1].centro}</p>)}
                    {this.state.selectedContenedor[1].horario != undefined && (<p><h6>Horario: </h6>{this.state.selectedContenedor[1].horario}</p>)}
                    {this.state.selectedContenedor[1].observaciones != undefined && (<p><h6>Observaciones: </h6>{this.state.selectedContenedor[1].observaciones}</p>)}
                  </div>
                )}
              </InfoWindow>
            </Map>
          </div>
        ) : null}
      </>
    )
  }
  /************** Render ******************/

}

export default GoogleApiWrapper({
  apiKey: googleAPI.API_KEY
})(MyMap);