//For enter key functionality
$( document ).ready(function() {
    $('#pokeSubmit').submit(function(e){
        console.log('Override Default')
        e.preventDefault();
        pokeSubmit();
    });
});

//v1 of the pokeApi is deprecated, use v2
function pokeSubmit(){
    var param = document.getElementById("pokeInput").value;
    var pokeURL = "https://pokeapi.co/api/v2/pokemon/" + param;

    $.ajax({
        url: "https://pokeapi.co/api/v2/pokemon/" + param,
        dataType: "json",
        error: function(){
            alert("ERROR: Not a valid Pokémon");
        }
    }) .done(function(){
        console.log("GET Successful")
    });

    $.getJSON(pokeURL, function(data){
        //Basic info
        var imageURI = data.sprites.front_default;
        var pokeID = data.id;
        
        var pokeName = data.name;
        pokeName = pokeName.charAt(0).toUpperCase() + pokeName.slice(1);

        var pokeType1 = data.types[0].type.name;
        pokeType1 = pokeType1.charAt(0).toUpperCase() + pokeType1.slice(1);

        if (data.types.length == 2) {   //check if the pokemon is considered more than one type
            var pokeType2 = data.types[1].type.name;
            pokeType2 = pokeType2.charAt(0).toUpperCase() + pokeType2.slice(1);
        }
        else {
            var pokeType2 = null;
        }

        //Stats
        for (i in data.stats){
            if (data.stats[i].stat.name == "hp"){
               var statHP = data.stats[i].base_stat;
            }
        }
        for (i in data.stats){
            if (data.stats[i].stat.name == "defense"){
                var statDefense = data.stats[i].base_stat;
            }
        }
        for (i in data.stats){
            if (data.stats[i].stat.name == "attack"){
                var statAttack = data.stats[i].base_stat;
            }
        }
        for (i in data.stats){
            if (data.stats[i].stat.name == "special-attack"){
                var statSpAttack = data.stats[i].base_stat;
            }
        }
        for (i in data.stats){
            if (data.stats[i].stat.name == "special-defense"){
                var statSpDefense = data.stats[i].base_stat;
            }
        }
        for (i in data.stats){
            if (data.stats[i].stat.name == "speed"){
                var statSpeed = data.stats[i].base_stat;
            }
        }


        var FlavorTextURI = "https://pokeapi.co/api/v2/pokemon-species/" + param;
        var pokeDescription = "";
        var pokeGenus = "";

        $.getJSON(FlavorTextURI, function(data2){
            //Description and Genus
            for (i in data2.flavor_text_entries){
                if (data2.flavor_text_entries[i].language.name == "en"){    //check for english description
                    pokeDescription = data2.flavor_text_entries[i].flavor_text;
                    break;
                }
            }
            for (i in data2.genera){
                if (data2.genera[i].language.name == "en"){
                    pokeGenus = data2.genera[i].genus;
                }
            }
             //Append data to HTML
            var html = "";
            html += '<div class="Stats">';
            html += '<p>HP</p>';
            html += '<p style="position:relative; top: 12.9px; font-size: 13px; color: black; text-shadow: none;">' + statHP + '/255</p>'
            html += '<progress id="hp" max="255" value="' + statHP + '"></progress>';
            html += '<p>Attack</p>';
            html += '<p style="position:relative; top: 12.9px; font-size: 13px; color: black; text-shadow: none;">' + statAttack + '/180</p>'
            html += '<progress id="attack" max="180" value="' + statAttack + '"+></progress>';
            html += '<p>Sp.Attack</p>';
            html += '<p style="position:relative; top: 12.9px; font-size: 13px; color: black; text-shadow: none;">' + statSpAttack + '/180</p>'
            html += '<progress id="sp.attack" max="180" value="' + statSpAttack + '"></progress>';
            html += '<p>Defense</p>';
            html += '<p style="position:relative; top: 12.9px; font-size: 13px; color: black; text-shadow: none;">' + statDefense + '/230</p>'
            html += '<progress id="defense" max="230" value="' + statDefense + '"></progress>';
            html += '<p>Sp.Defense</p>';
            html += '<p style="position:relative; top: 12.9px; font-size: 13px; color: black; text-shadow: none;">' + statSpDefense + '/230</p>'
            html += '<progress id="sp.defense" max="230" value="' + statSpDefense + '"></progress>';
            html += '<p>Speed</p>';
            html += '<p style="position:relative; top: 12.9px; font-size: 13px; color: black; text-shadow: none;">' + statSpeed + '/180</p>'
            html += '<progress id="speed" max="180" value="' + statSpeed + '"></progress>';
            html += '</div>';
            html += '<img src="' + imageURI + '">';
            html += '<h1>#' + pokeID + ' ' + pokeName + '</h1>';
            html += '<h3>' + pokeGenus + '</h3>';
            
            if (pokeType2 != null){
                html += '<p>Type: ' + pokeType1 + ', ' + pokeType2 + '</p>';
            }
            else {
                html += '<p>Type: ' + pokeType1 + '</p>'; // only display Type 2 if it is not null
            }

            html += '<div id="boxed-description">'
            html += '<p>' + pokeDescription + '</p>';
            html += '</div>';

            //Empty the and append new html to the listview
            $("#pokeDetails").empty();
            $("#pokeDetails").append(html);
        });
    });
}
