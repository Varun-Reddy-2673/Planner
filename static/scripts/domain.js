var account = cookie_get ('account');
var code = cookie_get ('code');

function cookie_get (cname) {
    let name = cname + '=';
    let decoded_cookie = decodeURIComponent (document.cookie);
    let ca = decoded_cookie.split (';');
    for (let i = 0; i < ca.length; i ++) {
        let c = ca [i];
        while (c.charAt (0) == ' ') {
            c = c.substring (1);
        }
        if (c.indexOf (name) == 0) {
            return c.substring (name.length, c.length);
        }
    }
    return '';
}

function cookie_post (cname, cvalue) {
    const date = new Date ();
    date.setTime (date.getTime () + 24 * 60 * 60 * 1000);
    let expires = 'expires=' + date.toUTCString ();
    document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
}

function fetch_domain_list () {
    fetch ('fetch-domain-list/' + account, {method: 'GET', headers: {'Authorisation': code}}).then (res => res.json ()).then (output => {
        if (output.success) {
            var table = document.getElementById ('table');
            table.innerHTML = '<th class = \'sl-no\'>SL NO</th><th class = \'title\'>TITLE</th><th class = \'options\'>OPTIONS</th>';
            for (index in output.domain_list) {
                var tr = document.createElement ('tr');
                var style_string = 'style = \'background-color: ' + output.domain_list [index] [2] + ';\'';
                tr.innerHTML = '<td ' + style_string + '>' + (parseInt (index) + 1) + '</td><td ' + style_string + '>' + output.domain_list [index] [1] + '</td><td class = \'options\' ' + style_string + ' onclick = \'remove_domain (' + output.domain_list [index] [0] + ')\'>Delete</td>';
                table.appendChild (tr);
                index ++;
            }
            var tr = document.createElement ('tr');
            var style_string = 'style = \'background-color: #ffffff;\'';
            tr.innerHTML = '<td ' + style_string + '>' + (parseInt (output.domain_list.length) + 1) + '</td><td ' + style_string + '><input id = \'input_title\' class = \'textbox-long\' type = \'text\'></td><td class = \'options\' ' + style_string + ' onclick = \'add_domain ()\'>Add</td>';
            table.appendChild (tr);
        } else {
            window.location = 'home.html';
        }
    })
}

function remove_domain (domain) {
    var input = {account: account, domain: domain};
    fetch ('remove-domain', {method: 'POST', headers: {'Authorisation': code, 'Content-Type': 'application/json;charset=utf-8'}, body: JSON.stringify (input)}).then (res => res.json ()).then (output => {
        if (output.success) {
            fetch_domain_list ();
        } else {
            window.location = 'home.html';
        }
    })
}

function add_domain () {
    var title = document.getElementById ('input_title').value;
    var input = {account: account, title: title};
    fetch ('add-domain', {method: 'POST', headers: {'Authorisation': code, 'Content-Type': 'application/json;charset=utf-8'}, body: JSON.stringify (input)}).then (res => res.json ()).then (output => {
        if (output.success) {
            fetch_domain_list ();
        } else {
            window.location = 'home.html';
        }
    })
}

function main () {
    fetch_domain_list ();
}

main ();