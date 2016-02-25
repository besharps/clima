

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

            //Llamado a la función que muestra el nombre de la ubicación junto a los datos del clima
            getNameLocation(lat, lon);
    
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


                lat = -34.6080668671682;
                lon = -58.37044143676758;
                
                load_map(lat,lon);
                mostrarClima(lat,lon);
            }    
        );
    }
    else{
        alert("Su navegador no soporta la API de geolocalización.");

        lat = -34.6080668671682;
        lon = -58.37044143676758;
        
        load_map(lat,lon);
        mostrarClima(lat,lon);
    }



    //pronóstico extendido por hora    
    //$("#btn_pr_extend_hour").click(function(){

      /*  $("#btn_pr_extend_hour").toggle(
          function() {
            $(this).addClass( "selected" );
            alert("funciona!!");
          }, function() {
            $(this).removeClass( "selected" );
          }
        );

    });*/

    //pronóstico extendido por día   
    $("#btn_pr_extend").click(function(){

        $("#info_extend").fadeToggle( "fast", "linear" );

    });


});

