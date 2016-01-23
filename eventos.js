

var lon;
var lat;
var map;
var marker;


$(document).ready(function() {

    
    
    if (navigator.geolocation){

        navigator.geolocation.getCurrentPosition(function(objPosition){

            lat = objPosition.coords.latitude;
            lon = objPosition.coords.longitude;
            
            load_map(lat,lon);

            mostrarClima(lat,lon);

            },
            function(objPositionError){

                switch (objPositionError.code){

                case objPositionError.PERMISSION_DENIED:
                    alert("No se ha permitido el acceso a la posición del usuario.");
                break;

                case objPositionError.POSITION_UNAVAILABLE:
                    alert("No se ha podido acceder a la información de su posición.");
                break;

                case objPositionError.TIMEOUT:
                    alert("El servicio ha tardado demasiado tiempo en responder.");
                break;

                default:
                    alert("Error desconocido.");
                }
            }    
        );
    }
    else{
        alert("Su navegador no soporta la API de geolocalización.");
    }

});


 

