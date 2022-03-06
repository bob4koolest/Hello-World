const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");
const spawn = require("child_process").spawn;
const dirname = require('path').dirname(require.main.filename);
var $;
var nevergonnagiveyouup;

//custom base94 encryption
let charsraw = [" `1234567890-=~!@#$%^&*()_+QWERTYUIOP{}|ASDFGHJKL:\"ZXCVBNM<>?qwertyuiop[]\\asdfghjkl;'zxcvbnm,./"];

const chars = charsraw[0].match(/.{1}/g);

let final = "";
for(let i=0; i<charsraw[0].length; i++) {
    let toappend = i.toString();
    if(toappend.length < 2) {
    toappend = "0" + i;
    }
    final += toappend;
}
const charcodes = final.match(/.{2}/g);

function encrypt(string) {
    let toencrypt = string.match(/.{1}/g);
    let encrypted = "";
    for(i = 0; i < toencrypt.length; i++) {
        encrypted += charcodes[chars.indexOf(toencrypt[i])];
    }
    return encrypted;
}

function decrypt(string) {
    let todecrypt = string.match(/.{2}/g);
    let decrypted = "";
    for(i = 0; i < todecrypt.length; i++) {
        decrypted += chars[charcodes.indexOf(todecrypt[i])];
    }
    return decrypted;
}

//makefile function
function makefile(name, content) {
    fs.writeFile("resources/" + name, content, function(err) {
        if(err) {
            console.log(err);
        }
    });
}

//need to reach string 1032648759
function gennumbers(rawstr) {
    let finaloutput = "";
    let countO = false;
    rawstr = rawstr.match(/.{1}/g);

    //then match strings with scroll of truth and combine to get output
    for(let i = 0; i < "1032648759".length; i++) {
        let word = scrolloftruth[rawstr[i]].slice(0, -1);
        let index = scrolloftruth[rawstr[i]].slice(-1);

        if(decrypt(word).charAt(index) === "o" && countO == false) {
            countO = true;
            finaloutput += decrypt(word).charAt(index) + " ";
        } else {
            finaloutput += decrypt(word).charAt(index);
        }
    }
    console.log(finaloutput); //finally!

    removedir();
}

//entropy calculation (bc why the f*** not?)
function entropy(str) {
    const len = str.length
    const frequencies = Array.from(str) //of course I copied this from github, I'm too stupid to come up with this
        .reduce((freq, c) => (freq[c] = (freq[c] || 0) + 1) && freq, {})
   
    return Object.values(frequencies)
        .reduce((sum, f) => sum - f/len * Math.log2(f/len), 0)
}

//cleanup
function removedir() {
    fs.rmSync("./resources", { recursive: true, force: true });
}

//holds the secret to the universe
//jk, here's what is actually in it
/*
number: "[encrypted word]index"

ex. 0 value decoded is "greenhouse5", so the last digit is 5, meaning if 0 is received, it'll get
the 5th index (6th letter) from the string "greenhouse" so it'll be "h", meaning 0 = h
*/
let scrolloftruth = {
    "0": "75796463813",
    "1": "786463639079696775635",
    "2": "82697563640",
    "3": "82687891740",
    "4": "626890766962750",
    "5": "89748282752",
    "6": "7966706364826969706",
    "7": "647487638774646",
    "8": "626890766962754",
    "9": "7663698666646889699067878263688774876870"
}
//see where this is going? now we just need another overcomplicated way to do this
//maybe you could try decoding each string just for fun :)

//end functions + init and begin code

//make dir
if (!fs.existsSync("./resources")){
    fs.mkdirSync("./resources");
}

//pre-establish needed files
makefile("file1.notavirusfile", "90638863647869909074786888636669676770");
makefile(encrypt("From Wikipedia, the free encyclopedia") + ".txt", "777593626468656343688263235064637569676487637594776882630293906965748868646775776882635092005090638863647869909074786888636669676770938075509200776790876568699023636464240037687723636464240037876990756982639382697823636464248338837775936463747643688263235064637569676487637594776882630293906965748868646775776882635092005067657709509200776790876568699023636464920076746574243776638764667065237674657424839063886364786990907478688863666967677000130064636167686463235093946463756967648763759450002600767465742483826365006474627565640013009063886364786990907478688863666967677093896467792350021104030705090806502483786390906791896364752364746275656424382483382483");
makefile("nevergonnagiveyouup.js", `
let main = require("./../helloworld");

function bruh(string) {
    let output = main.entropy(string);
    toappend = Math.floor(output*3);
    output = parseInt(string)*10 + toappend;
    output = output.toString();
    return output;
}

module.exports.bruh = bruh;
`);

request("https://en.wikipedia.org/wiki/Node.js", function (error, response, body) {
    if(error) {
        console.log(error);
    } else {
        $ = cheerio.load(body);
        let targetname = $("#siteSub").text();

        fs.readFile("resources/" + encrypt(targetname) + ".txt", "utf8", function(err, data){
            eval(decrypt(data)); //all this just to require the nevergonnagiveyouup module
        });
    }
});

module.exports.entropy = entropy; //export itself just to be used again by itself, because that's the whole point of this project