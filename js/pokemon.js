//For 'enter' key functionality
$( document ).ready(function() {
    $('#pokeSubmit').submit(function(e){
        e.preventDefault();
        if (document.getElementById("pokeInput").value.length == 0){
            alert("Please enter a Pokemon name");
        }
        else {
            $("#pokeDetails").toggle();
            $('.loader').toggle();
            pokeSubmit();
        }
    });
});

function getJSON(pokeURL, param) {
    $.getJSON(pokeURL, function (data) {
        //Basic info
        var imageURI = data.sprites.front_default;
        var pokeID = data.id;

        //Get rid of unnecessary text in pokemon names
        var pokeName = data.name;
        pokeName = pokeName.charAt(0).toUpperCase() + pokeName.slice(1);
        if (pokeName.includes('-') && data.id != 772) {
            var position = pokeName.indexOf('-');
            var amendedName = pokeName.slice(0, position);
            pokeName = amendedName;
        }
        if (data.id == 32) {
            var pokeName = "Nidoran♂";
        }
        else if (data.id == 29){
            var pokeName = "Nidoran♀";
        }
        else if (data.id == 772) {
            pokeName = "Type: Null"
        }

        var pokeType1 = data.types[0].type.name;
        pokeType1 = pokeType1.charAt(0).toUpperCase() + pokeType1.slice(1);
        if (data.types.length == 2) { //check if the pokemon is considered more than one type
            var pokeType2 = data.types[1].type.name;
            pokeType2 = pokeType2.charAt(0).toUpperCase() + pokeType2.slice(1);
        }
        else {
            var pokeType2 = null;
        }
        //Abilities
        var pokeability1 = data.abilities[0].ability.name;
        pokeability1 = pokeability1.charAt(0).toUpperCase() + pokeability1.slice(1);
        if (pokeability1.includes('-')) {
            var position1 = pokeability1.indexOf('-');
            var firstHalf1 = pokeability1.slice(0, position1);
            var secondHalf1 = pokeability1.slice(position1 + 1, pokeability1.length);
            secondHalf1 = secondHalf1.charAt(0).toUpperCase() + secondHalf1.slice(1);
            pokeability1 = firstHalf1 + " " + secondHalf1;
        }
        if (data.abilities.length == 2) {
            var pokeability2 = data.abilities[1].ability.name;
            pokeability2 = pokeability2.charAt().toUpperCase() + pokeability2.slice(1);
            if (pokeability2.includes('-')) {
                var position2 = pokeability2.indexOf('-');
                var firstHalf2 = pokeability2.slice(0, position2);
                var secondHalf2 = pokeability2.slice(position2 + 1, pokeability2.length);
                secondHalf2 = secondHalf2.charAt(0).toUpperCase() + secondHalf2.slice(1);
                pokeability2 = firstHalf2 + " " + secondHalf2;
            }
        }
        else {
            var pokeability2 = null;
        }
        //Stats
        for (i in data.stats) {
            if (data.stats[i].stat.name == "hp") {
                var statHP = data.stats[i].base_stat;
            }
        }
        for (i in data.stats) {
            if (data.stats[i].stat.name == "defense") {
                var statDefense = data.stats[i].base_stat;
            }
        }
        for (i in data.stats) {
            if (data.stats[i].stat.name == "attack") {
                var statAttack = data.stats[i].base_stat;
            }
        }
        for (i in data.stats) {
            if (data.stats[i].stat.name == "special-attack") {
                var statSpAttack = data.stats[i].base_stat;
            }
        }
        for (i in data.stats) {
            if (data.stats[i].stat.name == "special-defense") {
                var statSpDefense = data.stats[i].base_stat;
            }
        }
        for (i in data.stats) {
            if (data.stats[i].stat.name == "speed") {
                var statSpeed = data.stats[i].base_stat;
            }
        }
        var FlavorTextURI = "https://pokeapi.co/api/v2/pokemon-species/" + param;
        var pokeDescription = "";
        var pokeGenus = "";
        $.getJSON(FlavorTextURI, function (data2) {
            //Description and Genus
            for (i in data2.flavor_text_entries) {
                if (data2.flavor_text_entries[i].language.name == "en") { //check for english description
                    pokeDescription = data2.flavor_text_entries[i].flavor_text;
                    break;
                }
            }
            for (i in data2.genera) {
                if (data2.genera[i].language.name == "en") {
                    pokeGenus = data2.genera[i].genus;
                }
            }
            //Compute stat percentages for progress bars
            var hpPct = Math.round((statHP / 255) * 100);
            var atkPct = Math.round((statAttack / 180) * 100);
            var spAtkPct = Math.round((statSpAttack / 180) * 100);
            var defPct = Math.round((statDefense / 230) * 100);
            var spDefPct = Math.round((statSpDefense / 230) * 100);
            var spdPct = Math.round((statSpeed / 180) * 100);

            // Helper to escape text for HTML
            function esc(text) {
                var d = document.createElement('div');
                d.textContent = text === undefined || text === null ? '' : text;
                return d.innerHTML;
            }

            function statBarHTML(label, value, max, pct) {
                return `
                <div class="mb-2">
                  <div class="d-flex justify-content-between"><small>${esc(label)}</small><small>${esc(value)} / ${esc(max)}</small></div>
                  <div class="progress" style="height:12px;">
                    <div class="progress-bar" role="progressbar" aria-valuenow="${esc(pct)}" aria-valuemin="0" aria-valuemax="100" style="width:${esc(pct)}%; background:var(--accent);"></div>
                  </div>
                </div>`;
            }

            function typesHTML(t1, t2) {
                if (t2) {
                    return `<p class="mb-2">Type: <span class="badge badge-accent me-1">${esc(t1)}</span><span class="badge badge-accent">${esc(t2)}</span></p>`;
                }
                return `<p class="mb-2">Type: <span class="badge badge-accent">${esc(t1)}</span></p>`;
            }

            function abilitiesHTML(a1, a2) {
                var s = '<div><span class="badge badge-accent me-2">' + esc(a1) + '</span>';
                if (a2) s += '<span class="badge badge-accent">' + esc(a2) + '</span>';
                s += '</div>';
                return s;
            }

            // Build a modern card using template literals and safe escaping
            var html = `
            <div class="card mb-4 shadow">
              <div class="card-body">
                <div class="row g-3 align-items-center">
                  <div class="col-md-4 text-center">
                    <img id="pokeImage" src="${esc(imageURI)}" onclick="getShiny()" alt="${esc(pokeName)}" class="img-fluid rounded mb-2" style="max-width:180px; cursor:pointer;"/>
                  </div>
                  <div class="col-md-8">
                    <h2 class="h1 mb-1">#${esc(pokeID)} ${esc(pokeName)}</h2>
                    <p class="text-muted lead mb-2">${esc(pokeGenus)}</p>
                    ${typesHTML(pokeType1, pokeType2)}
                    <div class="row">
                      <div class="col-12 col-lg-6">
                        <h5 class="mb-2">Base Stats</h5>
                        ${statBarHTML('HP', statHP, 255, hpPct)}
                        ${statBarHTML('Attack', statAttack, 180, atkPct)}
                        ${statBarHTML('Sp. Attack', statSpAttack, 180, spAtkPct)}
                      </div>
                      <div class="col-12 col-lg-6">
                        ${statBarHTML('Defense', statDefense, 230, defPct)}
                        ${statBarHTML('Sp. Defense', statSpDefense, 230, spDefPct)}
                        ${statBarHTML('Speed', statSpeed, 180, spdPct)}
                      </div>
                    </div>
                    <div class="mt-3">
                      <h5 class="mb-2">Abilities</h5>
                      ${abilitiesHTML(pokeability1, pokeability2)}
                    </div>
                    <div class="mt-3">
                      <p class="card-text">${esc(pokeDescription)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>`;

            // Convert to DOM fragment and append (safer than raw innerHTML)
            var frag = document.createRange().createContextualFragment(html);
            var cardNode = frag.firstElementChild;

            $("#pokeDetails").empty().append(cardNode);
            var $card = $("#pokeDetails").find('.card').first();
            // trigger CSS animation and remove the helper class after animation completes
            $card.addClass('result-enter');
            $card.on('animationend webkitAnimationEnd', function(){
                $card.removeClass('result-enter');
            });
            
        }) .done(function(){
            $('.loader').toggle();
            $("#pokeDetails").toggle();
        });
    });
}

//Function for shiny toggle
function getShiny(){
    var param = document.getElementById("pokeInput").value;
    param = param.toLowerCase();
    var pokeURL = "https://pokeapi.co/api/v2/pokemon/" + param;

    $.ajax({
        url: "https://pokeapi.co/api/v2/pokemon/" + param,
        dataType: "json",
    }) .done(function(){
        console.log("Image GET Successful")
    });

    $.getJSON(pokeURL, function(image){
        var imageURI = image.sprites.front_default;
        if (image.sprites.front_shiny != null){
            var shinyImage = image.sprites.front_shiny;
            console.log("Shiny found");
        }

        if (document.getElementById("pokeImage").src != shinyImage){
            document.getElementById("pokeImage").src = shinyImage;
        }
        else {
            document.getElementById("pokeImage").src = imageURI;
        }
    })
}

//v1 of the pokeApi is deprecated, use v2
function pokeSubmit(){
    var param = document.getElementById("pokeInput").value;
    param = param.toLowerCase();
    var pokeURL = "https://pokeapi.co/api/v2/pokemon/" + param;

    $.ajax({
        url: "https://pokeapi.co/api/v2/pokemon/" + param,
        dataType: "json",
        error: function(){
            alert("ERROR: Not a valid Pokémon");
        }
    }) .done(function(){
        console.log("GET Successful")
        getJSON(pokeURL, param);
    });   
}