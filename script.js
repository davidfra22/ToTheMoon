let money = 0;
let gmeStonk = 0;
let bitcoins = 0;
let btcPrice;
let gmePrice;
let gmeAdded = 0;
let btcAdded = 0;
let jokeTold = 0;
let tweeted = 0;

async function getGmePrice() {
    let cur = await axios({
        method: 'get',
        url: 'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=GME&apikey=33V4KUE0UUJCZXZ3',
    });
    let curPrice = cur.data["Global Quote"]["05. price"];
    return curPrice
}

async function getBtcPrice() {
    let cur = await axios({
        method: 'get',
        url: 'https://api.coindesk.com/v1/bpi/currentprice.json',
    });
    let curPrice = cur.data.bpi.USD.rate;
    return curPrice
}

async function getJoke() {
    let cur = await axios({
        method: 'get',
        url: 'https://official-joke-api.appspot.com/jokes/programming/random',
    });
    let curJoke = cur.data[0].setup + " " + cur.data[0].punchline;
    return curJoke
}

async function getTweet() {
    let cur = await axios({
        method: 'get',
        url: 'https://musk-tweet.netlify.app/.netlify/functions/api',
    });
    let curTweet = cur.data.tweet;
    return curTweet
}

async function getSpace() {
    let cur = await axios({
        method: 'get',
        url: 'https://api.nasa.gov/planetary/apod?api_key=HVpQF2B3F4q8lkBN9jqF2wRhaLRMWS6pnk9hrrbo',
    });
    return cur.data;
}

const updateGame = function() {
    $("#money").replaceWith("<div id=\"money\"><h3>Money: $"+ money.toFixed(2) +"</h3></div>");
    $("#owned").replaceWith("<h3 id=\"owned\">Owned: "+gmeStonk+"</h3>");
}

const updateGameBtc = function() {
    $("#money").replaceWith("<div id=\"money\"><h3>Money: $"+ money.toFixed(2) +"</h3></div>");
    $("#btcOwned").replaceWith("<h3 id=\"btcOwned\">Owned: "+bitcoins+"</h3>");
    $("#btcPrice").replaceWith("<h3 id=\"btcPrice\">Price: $"+btcPrice.toFixed(2)+"</h3>");
}

const handleEatButtonPress = function(event) {
    event.preventDefault(); 
    money += 1;
    $("#money").replaceWith("<div id=\"money\"><h3>Money: $"+ money.toFixed(2) +"</h3></div>");
    if (money > gmePrice && !gmeAdded) {
        gmeAdded += 1;
        addGmeOption();
    }
    if (money > btcPrice && !btcAdded){
        btcAdded += 1;
        addBtcOption();
    }
};

const handleBuyButtonPress = function(event) {
    event.preventDefault(); 
    if (money >= gmePrice) {
        gmeStonk += 1;
        money -= gmePrice;
        updateGame();
    }
};

const handleBuyBtcButtonPress = function(event) {
    event.preventDefault(); 
    if (money >= btcPrice) {
        bitcoins += 1;
        money -= btcPrice;
        updateGameBtc();
    }
};

const handleSellButtonPress = function(event) {
    event.preventDefault(); 
    if (gmeStonk > 0) {
        gmeStonk -= 1;
        money += gmePrice;
        updateGame();
    }
    if (money > btcPrice && !btcAdded){
        btcAdded += 1;
        addBtcOption();
    }
};

const handleSellAllButtonPress = function(event) {
    money += gmePrice * gmeStonk;
    gmeStonk = 0;
    updateGame();
    if (money > btcPrice && !btcAdded){
        btcAdded += 1;
        addBtcOption();
    }
}

const handleSellBtcButtonPress = function(event) {
    event.preventDefault(); 
    if (bitcoins > 0) {
        bitcoins -= 1;
        money += btcPrice;
        updateGameBtc();
    }
};

async function handleJokeButtonPress(event) {
    event.preventDefault(); 
    if (money >= 100 && !jokeTold) {
        jokeTold += 1;
        money -= 100;
        $("#money").replaceWith("<div id=\"money\"><h3>Money: $"+ money.toFixed(2) +"</h3></div>")
        $('#joke').after("<div id=\"theJoke\"><p>" +await getJoke() + "</p></div>");
        gmeStonk *= 2;
        $("#owned").replaceWith("<h3 id=\"owned\">Owned: "+gmeStonk+"</h3>");
    } else if (money >= 100 && jokeTold) {
        money -= 100;
        $("#money").replaceWith("<div id=\"money\"><h3>Money: $"+ money.toFixed(2) +"</h3></div>")
        $('#theJoke').replaceWith("<div id=\"theJoke\"><p>" +await getJoke() + "</p></div>");
        gmeStonk *= 2;
        $("#owned").replaceWith("<h3 id=\"owned\">Owned: "+gmeStonk+"</h3>");
    }
};

async function handleTweetButtonPress(event) {
    event.preventDefault(); 
    if (money >= 500000 && !tweeted) {
        tweeted += 1;
        money -= 500000;
        $("#money").replaceWith("<div id=\"money\"><h3>Money: $"+ money.toFixed(2) +"</h3></div>")
        $('#tweet').after("<div id=\"theTweet\"><h4>Elon Musk: </h4><p>" +await getTweet() + "</p></div>");
        btcPrice *= 3;
        $("#btcPrice").replaceWith("<h3 id=\"btcPrice\">Price: $"+btcPrice.toFixed(2)+"</h3>");
    } else if (money >= 500000 && tweeted) {
        money -= 500000;
        $("#money").replaceWith("<div id=\"money\"><h3>Money: $"+ money.toFixed(2) +"</h3></div>")
        $('#theTweet').replaceWith("<div id=\"theTweet\"><h4>Elon Musk: </h4><p>" +await getTweet() + "</p></div>");
        btcPrice *= 3;
        $("#btcPrice").replaceWith("<h3 id=\"btcPrice\">Price: $"+btcPrice.toFixed(2)+"</h3>");
    }
};

async function handleMoonButtonPress() {
    if(money > 1000000000000){
        let space = await getSpace();
        let pic = space.url;
        let title = space.title;
        let timer = 60;
        $('#root').empty();
        $('#root').append("<div><img src=\""+pic+"\"></div><div><h1>"+title+"</h1></div><div><p>I think you overshot the moon there! I guess you make a good investor, but a terrible pilot. That's some huge money, but it doesn't mean much up here. Enjoy the view I guess. Thanks for playing, and I hope you enjoyed your journey.</p></div>");
    }
}

const addGmeOption = function() {
    $('#root').append("<div id=\"gmeSect\"><button type=\"button\" id=\"joke\">$100 for a joke</button></div><div><div><h1>Buy Some GameStonks</h1></div><div><img src=\"https://jobapplications.net/wp-content/uploads/gamestop-logo-icon.png\"></div><div><h3>Price: $"+gmePrice.toFixed(2)+"</h3><h3 id=\"owned\">Owned: "+gmeStonk+"</h3></div><div><button type=\"button\" id=\"buy\">Buy</button><button type=\"button\" id=\"sell\">Sell</button><button type=\"button\" id=\"sellall\">Sell All</button></div></div>");
}

async function addBtcOption() {
    $('#theJoke').after("<div><button type=\"button\" id=\"tweet\">Pay Daddy Elon $500,000 to Tweet</button></div>");
    $('#root').append("<div><div><h1>Ride the Bitcoin Wave</h1></div><div><img src=\"https://localbitcoinnow.com/wp-content/uploads/2019/12/The-bit-logo-e1575819611411.png\" height=\"200\" width=\"200\" ></div><div><h3 id=\"btcPrice\">Price: $"+btcPrice.toFixed(2)+"</h3><h3 id=\"btcOwned\">Owned: "+bitcoins+"</h3></div><div><button type=\"button\" id=\"buyBtc\">Buy</button><button type=\"button\" id=\"sellBtc\">Sell</button></div></div>");
}

async function loadDOM() {
    // Grab a jQuery reference to the root HTML element
    const $root = $('#root');
    $root.append("<div><button type=\"button\" id=\"moon\">Go to the Moon: $1,000,000,000,000</button></div>");
    $root.append("<div><button type=\"button\" id=\"eat\">Eat Crayon</button></div>");
    $root.append("<div id=\"money\"><h3>Money: $"+ money.toFixed(2) +"</h3></div>");

    gmePrice = await getGmePrice();
    gmePrice = parseFloat(gmePrice);
    
    btcPrice = await getBtcPrice();
    btcPrice = btcPrice.replace(',', '');
    btcPrice = parseFloat(btcPrice);

    $("#root").on("click", "#eat", function(event){
        handleEatButtonPress(event);
    })
   
    $("#root").on("click", "#joke", function(event){
        handleJokeButtonPress(event);
    })

    $("#root").on("click", "#buy", function(event){
        handleBuyButtonPress(event);
    })

    $("#root").on("click", "#sell", function(event){
        handleSellButtonPress(event);
    })

    $("#root").on("click", "#sellall", function(event){
        handleSellAllButtonPress(event);
    })

    $("#root").on("click", "#buyBtc", function(event){
        handleBuyBtcButtonPress(event);
    })

    $("#root").on("click", "#sellBtc", function(event){
        handleSellBtcButtonPress(event);
    })

    $("#root").on("click", "#tweet", function(event){
        handleTweetButtonPress(event);
    })
    
    $("#root").on("click", "#moon", function(event){
        handleMoonButtonPress(event);
    })
};

$(function() {
    loadDOM();
});