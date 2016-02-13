var flag=0;

function load_map(lat,lon) {

    var myLatlng = new google.maps.LatLng(lat, lon);
    var place;

    var myOptions = {
        zoom: 12,
        center: myLatlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: true,
        mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
        position: google.maps.ControlPosition.RIGHT_TOP
        }
    };

    map = new google.maps.Map($("#map_canvas").get(0), myOptions);

    var input =(document.getElementById('address'));

    var types = document.getElementById('type-selector');


    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(types);

    
    marker = new google.maps.Marker({
        position: myLatlng, 
        title: 'Usted está aquí!', 
        map: map,
        draggable: true, 
        animation: google.maps.Animation.DROP
    });

    marker.setIcon('https://dl.dropboxusercontent.com/u/20056281/Iconos/male-2.png');

    infoWindow = new google.maps.InfoWindow();

    //infoMark(marker);

    google.maps.event.addListener(marker, 'mouseup', function(){
        //infoMark(marker);
        var posicion = marker.getPosition();

        getNameLocation(posicion.lat(),posicion.lng());
        mostrarClima(posicion.lat(),posicion.lng());
    });  


    /* codigo de autocompletado*/
    var autocomplete = new google.maps.places.Autocomplete(input);
    
    autocomplete.bindTo('bounds', map);


    autocomplete.addListener('place_changed', function(){
        
        place = autocomplete.getPlace();
        
        if (!place.geometry) {
          window.alert("Lugar o ubicación erronea!!!");
          return;
        }

        // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
          map.fitBounds(place.geometry.viewport);
        } 
        
        marker.setPosition(place.geometry.location);

        var posicion =place.geometry.location;

        map.setZoom(12);

        //infoMark(marker);

        //Copia el nombre autocompletado en el input de texto para mostrarlo junto a los datos de clima
        copyName();
       
        mostrarClima(posicion.lat(),posicion.lng()); 
    });

      // Sets a listener on a radio button to change the filter type on Places Autocomplete.
      function setupClickListener(id, types) {
        var radioButton = document.getElementById(id);
        radioButton.addEventListener('click', function() {
          autocomplete.setTypes(types);
        });
    }// fin de la funcion AddListener

      setupClickListener('changetype-all', []);
      setupClickListener('changetype-address', ['address']);
      setupClickListener('changetype-establishment', ['establishment']);
     // setupClickListener('changetype-geocode', ['geocode']);
    
}// Fin de la funcion load map



//Función que conecta con la api de clima
function mostrarClima(latitud,longitud){

    //Instanciando una clase para icono del clima
    var skycons = new Skycons({"color": "white"});


    var config = "?units=si&lang=es"; 

    var url="https://api.forecast.io/forecast/18d55f569c782af0f78c9b4156afeb37/" + latitud + "," + longitud + config;

    
    $.ajax({
      url: url,
      dataType: "jsonp",
      success: function (datoOrigen) {
        data = JSON.stringify(datoOrigen);
        clima = JSON.parse(data);
        //Datos del pronóstico actual
        $("#currently-summary").html(clima.currently.summary);
        $("#currently-temperature").html(redondear(clima.currently.temperature) + " ºC");
        $("#currently-apparentTemperature").html(redondear(clima.currently.apparentTemperature) + " ºC");
        $("#currently-windSpeed").html(redondear(clima.currently.windSpeed) + " km/h");
        $("#currently-windBearing").html(orientacion(clima.currently.windBearing));
        $("#currently-humidity").html(Math.round(clima.currently.humidity*100) +" %");
        $("#currently-pressure").html(Math.round(clima.currently.pressure) + " hPa");
        skycons.add("currently-icon", clima.currently.icon);       

        //Datos del pronóstico extendido

        //General summary
        $("#daily-general-summary").html(clima.daily.summary);
        //Hoy
        $("#daily-summary").html(clima.daily.data[0].summary);
        $("#daily-temperatureMin").html(redondear(clima.daily.data[0].temperatureMin) + " ºC");
        $("#daily-temperatureMax").html(redondear(clima.daily.data[0].temperatureMax) + " ºC");
        $("#daily-apparentTemperatureMin").html(redondear(clima.daily.data[0].apparentTemperatureMin) + " ºC");
        $("#daily-apparentTemperatureMax").html(redondear(clima.daily.data[0].apparentTemperatureMax) + " ºC");
        $("#daily-windSpeed").html(redondear(clima.daily.data[0].windSpeed) + " km/h");
        $("#daily-windBearing").html(orientacion(clima.daily.data[0].windBearing));
        $("#daily-humidity").html(Math.round(clima.daily.data[0].humidity*100) +" %");
        $("#daily-pressure").html(Math.round(clima.daily.data[0].pressure) + " hPa");
        skycons.add("icon", clima.daily.data[0].icon);

        //Día 1
        $("#day1").html(showday(1));
        $("#daily-summary1").html(clima.daily.data[1].summary);
        $("#daily-temperatureMin1").html(redondear(clima.daily.data[1].temperatureMin) + " ºC");
        $("#daily-temperatureMax1").html(redondear(clima.daily.data[1].temperatureMax) + " ºC");
        $("#daily-apparentTemperatureMin1").html(redondear(clima.daily.data[1].apparentTemperatureMin) + " ºC");
        $("#daily-apparentTemperatureMax1").html(redondear(clima.daily.data[1].apparentTemperatureMax) + " ºC");
        $("#daily-windSpeed1").html(redondear(clima.daily.data[1].windSpeed) + " km/h");
        $("#daily-windBearing1").html(orientacion(clima.daily.data[1].windBearing));
        $("#daily-humidity1").html(Math.round(clima.daily.data[1].humidity*100) +" %");
        $("#daily-pressure1").html(Math.round(clima.daily.data[1].pressure) + " hPa");
        skycons.add("icon1", clima.daily.data[1].icon);

        //Día 2
        $("#day2").html(showday(2));
        $("#daily-summary2").html(clima.daily.data[2].summary);
        $("#daily-temperatureMin2").html(redondear(clima.daily.data[2].temperatureMin) + " ºC");
        $("#daily-temperatureMax2").html(redondear(clima.daily.data[2].temperatureMax) + " ºC");
        $("#daily-apparentTemperatureMin2").html(redondear(clima.daily.data[2].apparentTemperatureMin) + " ºC");
        $("#daily-apparentTemperatureMax2").html(redondear(clima.daily.data[2].apparentTemperatureMax) + " ºC");
        $("#daily-windSpeed2").html(redondear(clima.daily.data[2].windSpeed) + " km/h");
        $("#daily-windBearing2").html(orientacion(clima.daily.data[2].windBearing));
        $("#daily-humidity2").html(Math.round(clima.daily.data[2].humidity*100) +" %");
        $("#daily-pressure2").html(Math.round(clima.daily.data[2].pressure) + " hPa");
        skycons.add("icon2", clima.daily.data[2].icon);

        //Día 3
        $("#day3").html(showday(3));
        $("#daily-summary3").html(clima.daily.data[3].summary);
        $("#daily-temperatureMin3").html(redondear(clima.daily.data[3].temperatureMin) + " ºC");
        $("#daily-temperatureMax3").html(redondear(clima.daily.data[3].temperatureMax) + " ºC");
        $("#daily-apparentTemperatureMin3").html(redondear(clima.daily.data[3].apparentTemperatureMin) + " ºC");
        $("#daily-apparentTemperatureMax3").html(redondear(clima.daily.data[3].apparentTemperatureMax) + " ºC");
        $("#daily-windSpeed3").html(redondear(clima.daily.data[3].windSpeed) + " km/h");
        $("#daily-windBearing3").html(orientacion(clima.daily.data[3].windBearing));
        $("#daily-humidity3").html(Math.round(clima.daily.data[3].humidity*100) +" %");
        $("#daily-pressure3").html(Math.round(clima.daily.data[3].pressure) + " hPa");
        skycons.add("icon3", clima.daily.data[3].icon);

        //Día 4
        $("#day4").html(showday(4));
        $("#daily-summary4").html(clima.daily.data[4].summary);
        $("#daily-temperatureMin4").html(redondear(clima.daily.data[4].temperatureMin) + " ºC");
        $("#daily-temperatureMax4").html(redondear(clima.daily.data[4].temperatureMax) + " ºC");
        $("#daily-apparentTemperatureMin4").html(redondear(clima.daily.data[4].apparentTemperatureMin) + " ºC");
        $("#daily-apparentTemperatureMax4").html(redondear(clima.daily.data[4].apparentTemperatureMax) + " ºC");
        $("#daily-windSpeed4").html(redondear(clima.daily.data[4].windSpeed) + " km/h");
        $("#daily-windBearing4").html(orientacion(clima.daily.data[4].windBearing));
        $("#daily-humidity4").html(Math.round(clima.daily.data[4].humidity*100) +" %");
        $("#daily-pressure4").html(Math.round(clima.daily.data[4].pressure) + " hPa");
        skycons.add("icon4", clima.daily.data[4].icon);

        //Día 5
        $("#day5").html(showday(5));
        $("#daily-summary5").html(clima.daily.data[5].summary);
        $("#daily-temperatureMin5").html(redondear(clima.daily.data[5].temperatureMin) + " ºC");
        $("#daily-temperatureMax5").html(redondear(clima.daily.data[5].temperatureMax) + " ºC");
        $("#daily-apparentTemperatureMin5").html(redondear(clima.daily.data[5].apparentTemperatureMin) + " ºC");
        $("#daily-apparentTemperatureMax5").html(redondear(clima.daily.data[5].apparentTemperatureMax) + " ºC");
        $("#daily-windSpeed5").html(redondear(clima.daily.data[5].windSpeed) + " km/h");
        $("#daily-windBearing5").html(orientacion(clima.daily.data[5].windBearing));
        $("#daily-humidity5").html(Math.round(clima.daily.data[5].humidity*100) +" %");
        $("#daily-pressure5").html(Math.round(clima.daily.data[5].pressure) + " hPa");
        skycons.add("icon5", clima.daily.data[5].icon);

        //Día 6
        $("#day6").html(showday(6));
        $("#daily-summary6").html(clima.daily.data[6].summary);
        $("#daily-temperatureMin6").html(redondear(clima.daily.data[6].temperatureMin) + " ºC");
        $("#daily-temperatureMax6").html(redondear(clima.daily.data[6].temperatureMax) + " ºC");
        $("#daily-apparentTemperatureMin6").html(redondear(clima.daily.data[6].apparentTemperatureMin) + " ºC");
        $("#daily-apparentTemperatureMax6").html(redondear(clima.daily.data[6].apparentTemperatureMax) + " ºC");
        $("#daily-windSpeed6").html(redondear(clima.daily.data[6].windSpeed) + " km/h");
        $("#daily-windBearing6").html(orientacion(clima.daily.data[6].windBearing));
        $("#daily-humidity6").html(Math.round(clima.daily.data[6].humidity*100) +" %");
        $("#daily-pressure6").html(Math.round(clima.daily.data[6].pressure) + " hPa");
        skycons.add("icon6", clima.daily.data[6].icon);

        //Día 7
        $("#day7").html(showday(7));
        $("#daily-summary7").html(clima.daily.data[7].summary);
        $("#daily-temperatureMin7").html(redondear(clima.daily.data[7].temperatureMin) + " ºC");
        $("#daily-temperatureMax7").html(redondear(clima.daily.data[7].temperatureMax) + " ºC");
        $("#daily-apparentTemperatureMin7").html(redondear(clima.daily.data[7].apparentTemperatureMin) + " ºC");
        $("#daily-apparentTemperatureMax7").html(redondear(clima.daily.data[7].apparentTemperatureMax) + " ºC");
        $("#daily-windSpeed7").html(redondear(clima.daily.data[7].windSpeed) + " km/h");
        $("#daily-windBearing7").html(orientacion(clima.daily.data[7].windBearing));
        $("#daily-humidity7").html(Math.round(clima.daily.data[7].humidity*100) +" %");
        $("#daily-pressure7").html(Math.round(clima.daily.data[7].pressure) + " hPa");
        skycons.add("icon7", clima.daily.data[7].icon);

        //Animación para los iconos del clima
        skycons.play();

      },
      error: function(){
            alert("AJAX mal recibido..");
      }

    });



    function redondear(numero){

        return numero.toFixed(1);
    }


    function orientacion(grados){


        if((grados>=0 && grados<6)|| (grados>354 && grados<=360))
            respuesta="N (Norte)";

        if(grados>=6 && grados<17)
            respuesta="NpE (Norte por Este)";

        if(grados>=17 && grados<=28)
            respuesta="NNE (Nornoreste)";

        if(grados>28 && grados<=39)
            respuesta="NEpN (Noreste por Norte)";

        if(grados>39 && grados<51)
            respuesta="NE (Noreste)";
        
        if(grados>=51 && grados<62)
            respuesta="NEpE (Noreste por Este)";

        if(grados>=62 && grados<=73)
            respuesta="ENE (Estenoreste)";
                        
        if(grados>73 && grados<=84)
            respuesta="EpN (Este por Norte)";
                            
        if(grados>84 && grados<96)
            respuesta="E (Este)";

        if(grados>=96 && grados<107)
            respuesta="EpS (Este por sur)";

        if(grados>=107 && grados<=118)
            respuesta="ESE (Estesureste)";

        if(grados>118 && grados<=129)
            respuesta="SEpE (Sureste por Este)";

        if(grados>129 && grados<141)
            respuesta="SE (Sureste)";

        if(grados>=141 && grados<150)
            respuesta="SEpS (Sureste por Sur)";

        if(grados>=150 && grados<=163)
            respuesta="SSE (Sursureste)";

        if(grados>163 && grados<=174)
            respuesta="SpE (Sur por Este)";

        if(grados>174 && grados<186)
            respuesta="S (Sur)";

        if(grados>=186 && grados<197)
            respuesta="SpO (Sur por Oeste)";

        if(grados>=197 && grados<=208)
            respuesta="SSO (Sursuroste)";

        if(grados>208 && grados<=219)
            respuesta="SOpS (Suroeste por Sur)";
        
        if(grados>219 && grados<231)
            respuesta="SO (Suroeste)";
        
        if(grados>=231 && grados<242)
            respuesta="SOpO (Suroeste por Oeste)";
        
        if(grados>=242 && grados<=253)
            respuesta="OSO (Oestesuroeste)";
        
        if(grados>253 && grados<=264)
            respuesta="OpS (Oeste por Sur)";
        
        if(grados>264 && grados<276)
            respuesta="O (Oeste)";
        
        if(grados>=276 && grados<287)
            respuesta="OpN (Oeste por Norte)";

        if(grados>=287 && grados<=298)
            respuesta="ONO (Oestenoroeste)";

        if(grados>298 && grados<=309)
            respuesta="NOpO (Noroeste por Oeste)";

        if(grados>309 && grados<321)
            respuesta="NO (Noroeste)";
        
        if(grados>=321 && grados<332)
            respuesta="NOpN (Noroeste por Norte)";

        if(grados>=332 && grados<=343)
            respuesta="NNO (Nornoroeste)";

        if(grados>343 && grados<=354)
            respuesta="NpO (Norte por Oeste)";

        if(grados<0 || grados>360)
            respuesta="Error de Coordenadas!";

        return respuesta;    
    }


}


/*
function infoMark(marker) {
        
    var markerLatLng = marker.getPosition();
    
    infoWindow.setContent([
     "Lat:"+markerLatLng.lat(),
     ' y ',
     "Lon:"+markerLatLng.lng(),
     "<br/>"+'Arrastrar para actualizar la posición'].join(''));

    infoWindow.open(map, marker);
}
*/


function getNameLocation(lat, lng){

        var latlng = new google.maps.LatLng(lat, lng);

        var geocoder = new google.maps.Geocoder();

        geocoder.geocode({'latLng': latlng}, function(resp, status) {
          if (status == google.maps.GeocoderStatus.OK) {
        
            if (resp[1]) {

                //formatted address
                var lugar=resp[0].formatted_address;    
                $("#currently-location").html(lugar);
            } 

            else {
              alert("No se hallaron resultados!!");
            }

          } 
          else {
            alert("La Geocodificación falló: " + status);
          }

        });
               
    }


    function copyName(){

        var direccion=$("#address").val();
    
        if(direccion!="" ){
            $("#currently-location").html("");
            $("#currently-location").html(direccion);
        }

    }


    //Función que muestra el nombre de los días de la semana en el pron. extendido
    function showday(numero){

        var fecha=new Date();
        var hoy=fecha.getDay();
        var respuesta=0;

        hoy=hoy+numero;

        if(hoy >6) hoy=hoy-7;

        if(hoy==0) respuesta="Domingo";
        if(hoy==1) respuesta="Lunes";
        if(hoy==2) respuesta="Martes";
        if(hoy==3) respuesta="Miércoles";
        if(hoy==4) respuesta="Jueves";
        if(hoy==5) respuesta="Viernes";
        if(hoy==6) respuesta="Sábado"; 

        return respuesta;
    }

