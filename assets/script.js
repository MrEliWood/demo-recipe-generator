// global variables
var appetizer = $("#appetizer");
var entree = $("#entree").val();
var cocktails = $("#cocktails").val();
var desserts = $("#desserts").val();
var modal = document.getElementById("myModal");
var span = document.getElementsByClassName("close")[0];
var restriction = $('#ingredient-search');
var next = $('#continue-link');
var allRestrictions = [];
var allIngredients = [];

var test = 'bananas'

console.log('TEST: ', test.slice(0,-1));

// get all ingredients
$(function () {

    // Meal Ingredients List //
    fetch('https://www.themealdb.com/api/json/v1/1/list.php?i=list')
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {

            for (var i = 0; i < data.meals.length; i++) {
                allIngredients.push(data.meals[i].strIngredient);
            };

        })
        .catch(err => alert(err));

    // Drink Ingredients List //
    fetch('https://www.thecocktaildb.com/api/json/v1/1/list.php?i=list')
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {

            console.log(data)

            for (var i = 0; i < data.drinks.length; i++) {
                allIngredients.push(data.drinks[i].strIngredient1);
            };

        })
        .catch(err => alert(err));

});



// add restrictions
function addRestriction() {

    let original = restriction.val().trim().toLowerCase();
    let singular = restriction.val().trim().toLowerCase().slice(0,-1);
    let plural = restriction.val().trim().toLowerCase() + 's';

    if (restriction.val().trim() === "") {
        return;
    } else {

        for (let i = 0; i < allIngredients.length; i++) {

            if (allIngredients[i].toLowerCase() === original ||
                allIngredients[i].toLowerCase() === singular ||
                allIngredients[i].toLowerCase() === plural) {

                    if (!allRestrictions.includes(allIngredients[i])) {
                        $('#chosen-restrictions').append(`<p>${allIngredients[i]}</p>`);
                        allRestrictions.push(allIngredients[i]);
                    };
                };
            
        };

        restriction.val('');
        restriction.addClass('placeholder-hidden');
    };
};

// autocomplete ingredients
restriction.autocomplete({
    source: allIngredients,
    position: {
        my: "center top", at: "center bottom+10px"
    },
    select: function (event, ui) {
        event.preventDefault();

        if ($('#chosen-restrictions').is(':empty')) {
            $('#no-restrictions').attr('class', 'fade-out');
        };

        restriction.val(ui.item.value);
        addRestriction();
    }
});

// listen for enter key press during ingredient search
$('#ingredient-search').on("keyup", function (event) {

    if (event.keyCode === 13) {

        event.preventDefault();
        restriction.autocomplete('close');
        addRestriction();

    }

});

// remove restriction after adding
$('#chosen-restrictions').click(function (event) {

    event.preventDefault();

    allRestrictions = $.grep(allRestrictions, function (value) {
        return value != event.target.innerText;
    });

    event.target.remove();

});

// hide vacant recipe sections
function isEmpty() {

    for (let i = 0; i < $('.recipe-content').length; i++) {

        if ($($('.recipe-content')[i]).is(":empty")) {
            $($('.recipe-content')[i]).parent().attr("class", "hidden")
        };

    };

};

// get recipes
function recipeGrabber() {

    for (let n = 1; n < 2; n++) {

        function appetizer() {

            fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=starter`)
                .then(function (response) {
                    return response.json()
                })
                .then(function (data) {
                    var i = Math.floor(Math.random() * data.meals.length)
                    var id = data.meals[i].idMeal

                    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
                        .then(function (response) {
                            return response.json()
                        })
                        .then(function (data) {

                            var meal = data.meals[0].strMeal;
                            var thumbnail = data.meals[0].strMealThumb;
                            var instructions = data.meals[0].strInstructions;

                            var apiListLimit = 20;
                            // ingredients, consolidated ingredientsList
                            var ingredientsList = [];
                            for (var i = 1; i <= apiListLimit; i++) {
                                ingredientsList.push(data.meals[0][`strIngredient${i}`]);
                            };

                            // measurements, consolidated measureList
                            var measureList = [];
                            for (var i = 1; i <= apiListLimit; i++) {
                                measureList.push(data.meals[0][`strMeasure${i}`]);
                            };

                            // restricted ingredients check
                            for (let i = 0; i < allRestrictions.length; i++) {
                                if (ingredientsList.includes(allRestrictions[i])) {
                                    appetizer();
                                    return;
                                };

                            };

                            // put results on the page
                            $(`#app-container`).css({
                                'background': `url('${thumbnail}')`,
                                'background-repeat': 'no-repeat',
                                'background-position': 'top',
                                'background-size': 'cover'
                            });
                            $(`#day${n}-appetizer`).append(`<img src="${thumbnail}"></img>`);
                            $(`#day${n}-app-content`).append(`<h3>Appetizer</h3>`);
                            $(`#day${n}-app-content`).append(`<h1>${meal}</h1>`);

                            for (let i = 0; i < ingredientsList.length; i++) {
                                if (ingredientsList[i] && measureList[i]) {
                                    $(`#day${n}-app-content`).append(`
                                    <div class="ingredient-line">
                                    <img class="ingredient-image" src="https://www.themealdb.com/images/ingredients/${ingredientsList[i]}.png" alt="${ingredientsList[i]} Thumbnail">
                                    <p class="ingredient">${measureList[i]} ${ingredientsList[i]}</p>
                                    </div>
                                    `);
                                };
                            };

                            $(`#day${n}-app-content`).append(`<p class="instructions">${instructions}</p>`);
                            $(`#day${n}-app-content`).parent().attr('class', 'card block')

                        })
                        .catch(err => console.error(err));
                })
        }

        if ($("#appetizer").is(":checked")) {
            appetizer()
        };

        function entrees() {

            fetch('https://www.themealdb.com/api/json/v1/1/random.php')
                .then(function (response) {
                    return response.json()
                })
                .then(function (data) {

                    var category = data.meals[0].strCategory
                    if (category === "Dessert" || category === "Starter") {
                        entrees()
                    } else {

                        var meal = data.meals[0].strMeal;
                        var thumbnail = data.meals[0].strMealThumb;
                        var instructions = data.meals[0].strInstructions;

                        var apiListLimit = 20;
                        // ingredients, consolidated ingredientsList
                        var ingredientsList = []
                        for (var i = 1; i <= apiListLimit; i++) {
                            ingredientsList.push(data.meals[0][`strIngredient${i}`]);
                        };

                        // measurements, consolidated measureList
                        var measureList = []
                        for (var i = 1; i <= apiListLimit; i++) {
                            measureList.push(data.meals[0][`strMeasure${i}`]);
                        };

                        // restricted ingredients check
                        for (let i = 0; i < allRestrictions.length; i++) {
                            if (ingredientsList.includes(allRestrictions[i])) {
                                entrees();
                                return;
                            };
                        };

                        // put results on the page
                        $(`#ent-container`).css({
                            'background': `url('${thumbnail}')`,
                            'background-repeat': 'no-repeat',
                            'background-position': 'top',
                            'background-size': 'cover'
                        });
                        $(`#day${n}-entree`).append(`<img src="${thumbnail}"></img>`);
                        $(`#day${n}-entree-content`).append(`<h3>Entrée</h3>`);
                        $(`#day${n}-entree-content`).append(`<h1>${meal}</h1>`);

                        for (let i = 0; i < ingredientsList.length; i++) {
                            if (ingredientsList[i] && measureList[i]) {
                                $(`#day${n}-entree-content`).append(`
                                <div class="ingredient-line">
                                    <img class="ingredient-image" src="https://www.themealdb.com/images/ingredients/${ingredientsList[i]}.png" alt="${ingredientsList[i]} Thumbnail">
                                    <p class="ingredient">${measureList[i]} ${ingredientsList[i]}</p>
                                    </div>
                                    `);
                            };
                        };

                        $(`#day${n}-entree-content`).append(`<p class="instructions">${instructions}</p>`);
                        $(`#day${n}-entree-content`).parent().attr('class', 'card block')

                    }

                })

        };

        if ($("#entree").is(":checked")) {
            entrees()
        };

        function dessert() {

            fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=dessert`)
                .then(function (response) {
                    return response.json()
                })
                .then(function (data) {

                    var i = Math.floor(Math.random() * data.meals.length)
                    var id = data.meals[i].idMeal

                    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
                        .then(function (response) {
                            return response.json()
                        })
                        .then(function (data) {

                            var meal = data.meals[0].strMeal;
                            var thumbnail = data.meals[0].strMealThumb;
                            var instructions = data.meals[0].strInstructions;

                            var apiListLimit = 20;
                            // ingredients, consolidated ingredientsList
                            var ingredientsList = [];
                            for (var i = 1; i <= apiListLimit; i++) {
                                ingredientsList.push(data.meals[0][`strIngredient${i}`]);
                            };

                            // measurements, consolidated measureList
                            var measureList = [];
                            for (var i = 1; i <= apiListLimit; i++) {
                                measureList.push(data.meals[0][`strMeasure${i}`]);
                            };

                            // restricted ingredients check
                            for (let i = 0; i < allRestrictions.length; i++) {
                                if (ingredientsList.includes(allRestrictions[i])) {
                                    dessert();
                                    return;
                                };
                            };

                            // put results on the page
                            $(`#des-container`).css({
                                'background': `url('${thumbnail}')`,
                                'background-repeat': 'no-repeat',
                                'background-position': 'top',
                                'background-size': 'cover'
                            });
                            $(`#day${n}-dessert`).append(`<img src="${thumbnail}"></img>`);
                            $(`#day${n}-dessert-content`).append(`<h3>Dessert</h3>`);
                            $(`#day${n}-dessert-content`).append(`<h1>${meal}</h1>`);

                            for (let i = 0; i < ingredientsList.length; i++) {
                                if (ingredientsList[i] && measureList[i]) {
                                    $(`#day${n}-dessert-content`).append(`
                                    <div class="ingredient-line">
                                    <img class="ingredient-image" src="https://www.themealdb.com/images/ingredients/${ingredientsList[i]}.png" alt="${ingredientsList[i]} Thumbnail">
                                    <p class="ingredient">${measureList[i]} ${ingredientsList[i]}</p>
                                    </div>
                                    `);
                                };
                            };

                            $(`#day${n}-dessert-content`).append(`<p class="instructions">${instructions}</p>`);
                            $(`#day${n}-dessert-content`).parent().attr('class', 'card block')

                        })
                        .catch(err => console.error(err));
                });

        };

        if ($("#dessert").is(":checked")) {
            dessert()
        };

        function cocktails() {

            fetch(`https://www.thecocktaildb.com/api/json/v1/1/random.php`)
                .then(function (response) {
                    return response.json()
                })
                .then(function (data) {

                    var drink = data.drinks[0].strDrink;
                    var thumbnail = data.drinks[0].strDrinkThumb;
                    var instructions = data.drinks[0].strInstructions;

                    var apiListLimit = 20
                    // ingredients
                    var ingredientsList = []
                    for (var i = 1; i <= apiListLimit; i++) {
                        ingredientsList.push(data.drinks[0][`strIngredient${i}`])
                    }

                    // measurements
                    var measureList = []
                    for (var i = 1; i <= apiListLimit; i++) {
                        measureList.push(data.drinks[0][`strMeasure${i}`])
                    }

                    // restricted ingredients check
                    for (let i = 0; i < allRestrictions.length; i++) {
                        if (ingredientsList.includes(allRestrictions[i])) {
                            cocktails();
                            return;
                        }
                    }

                    // put results on the page
                    $(`#dri-container`).css({
                        'background': `url('${thumbnail}')`,
                        'background-repeat': 'no-repeat',
                        'background-position': 'top',
                        'background-size': 'cover'
                    });
                    $(`#day${n}-cocktails`).append(`<img src="${thumbnail}"></img>`);
                    $(`#day${n}-cocktails-content`).append(`<h3>Drink</h3>`);
                    $(`#day${n}-cocktails-content`).append(`<h1>${drink}</h1>`);

                    for (let i = 0; i < ingredientsList.length; i++) {
                        if (ingredientsList[i] && measureList[i]) {
                            $(`#day${n}-cocktails-content`).append(`
                            <div class="ingredient-line">
                                    <img class="ingredient-image" src="https://www.thecocktaildb.com/images/ingredients/${ingredientsList[i]}.png" alt="${ingredientsList[i]} Thumbnail">
                                    <p class="ingredient">${measureList[i]} ${ingredientsList[i]}</p>
                                    </div>
                                    `);
                        };
                    };

                    $(`#day${n}-cocktails-content`).append(`<p class="instructions">${instructions}</p>`);
                    $(`#day${n}-cocktails-content`).parent().attr('class', 'card block');
                })
                .catch(err => console.error(err));
        };

        if ($("#cocktails").is(":checked")) {
            cocktails()
        };

        // if no courses are selected, select all courses
        if (!($("#appetizer").is(":checked")) && !($("#entree").is(":checked")) && !($("#dessert").is(":checked")) && !($("#cocktails").is(":checked"))) {
            appetizer();
            entrees();
            dessert();
            cocktails();
        };

        // hide empty courses
        isEmpty();

    };

};

// listen for continue button clicks
$('#continue-button').click(function (event) {

    event.preventDefault();

    if (next.attr("class") === "section-one") {

        // button
        next.attr("class", "section-two");

        // caption
        $('#caption-one').attr('class', 'fade-out-up');
        $('#caption-two').attr('class', 'fade-in-up');
        $('#start-over').attr('class', 'fade-in-up-85');

        // page
        $('#restrictions-page').addClass('scroll-up');
        setTimeout(() => restriction.focus(), 1500);
        setTimeout(() => {

            if ($('#chosen-restrictions').is(':empty')) {
                $('#no-restrictions').attr('class', 'fade-in');
            };

        }, 7000);

    } else if (next.attr("class") === "section-two") {

        // button
        next.attr("class", "section-three");

        // caption
        $('#caption-two').attr('class', 'fade-out-up');
        $('#caption-three').attr('class', 'fade-in-up');

        // page
        $('#restrictions-page').children().addClass('fade-out');
        setTimeout(() => $('#results-page').addClass('scroll-up'), 1000);
        recipeGrabber();

    } else if (next.attr("class") === "section-three") {

        // button
        next.attr("class", "section-one");
        $('#continue-button').text('Continue');

        // caption
        $('#caption-three').attr('class', 'fade-out-down');
        $('#caption-one').attr('class', 'fade-in-down');
        $('#start-over').attr('class', 'fade-out-down-85');

        // page
        $('#results-page').addClass('scroll-down');
        $('#restrictions-page').addClass('scroll-down');

        // reset content
        setTimeout(function () {
            $('#results-page').attr('class', '');
            $('#restrictions-page').attr('class', '');
            $('.card').children('img').remove();
            $('.recipe-content').text("");
            $('#start-over').attr('class', 'hidden');
        }, 1000);

    };

});

// listen for start over button clicks
$('#start-over').click(function (event) {

    event.preventDefault();

    if (next.attr("class") === "section-two") {

        // button
        next.attr("class", "section-one");

        // caption
        $('#caption-two').attr('class', 'fade-out-down');
        $('#caption-one').attr('class', 'fade-in-down');
        $('#start-over').attr('class', 'fade-out-down-85');

        // page
        $('#restrictions-page').addClass('scroll-down');

        // reset content
        setTimeout(function () {
            $('#restrictions-page').attr('class', '');
            $('#start-over').attr('class', 'hidden');
            $('#no-restrictions').attr('class', 'hidden');
        }, 1000);

    } else if (next.attr("class") === "section-three") {

        // button
        next.attr("class", "section-one");

        // caption
        $('#caption-three').attr('class', 'fade-out-down');
        $('#caption-one').attr('class', 'fade-in-down');
        $('#start-over').attr('class', 'fade-out-down-85');

        // page
        $('#results-page').addClass('scroll-down');
        $('#restrictions-page').addClass('scroll-down');
        $('#restrictions-page').children().attr('class', 'fade-in');

        // reset content
        setTimeout(function () {
            $('#results-page').attr('class', '');
            $('#restrictions-page').attr('class', '');
            $('.card').children('img').remove();
            $('.recipe-content').text("");
            $('#start-over').attr('class', 'hidden');
        }, 1000);

    };

});

// daily planner tabs
$('#day-tabs').click(function () {

    for (let i = 1; i < 8; i++) {

        if ($(`#day${i}-radio`).is(':checked')) {
            $(`#day${i}`).removeClass('hidden')
        };

        if (!($(`#day${i}-radio`).is(':checked'))) {
            $(`#day${i}`).addClass('hidden')
        };

    };

});

// add days of the week to planner tabs
$('#day3-tab').append(moment().add(2, 'days').format('dddd'));
$('#day4-tab').append(moment().add(3, 'days').format('dddd'));
$('#day5-tab').append(moment().add(4, 'days').format('dddd'));
$('#day6-tab').append(moment().add(5, 'days').format('dddd'));
$('#day7-tab').append(moment().add(6, 'days').format('dddd'));

// scroll to top on page reload
history.scrollRestoration = 'manual';