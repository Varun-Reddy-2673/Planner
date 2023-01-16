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

function sign_in () {
    var username = document.getElementById ('input_sign_in_username').value;
    var password = document.getElementById ('input_sign_in_password').value;
    fetch ('sign-in/' + username + '/' + password, {method: 'GET'}).then (res => res.json ()).then (output => {
        if (output.success) {
            cookie_post ('account', output.account);
            cookie_post ('code', output.code);
            window.location = 'dashboard.html';
        } else {
            alert (output.message);
        }
    })
}

function sign_up () {
    var username = document.getElementById ('input_sign_up_username').value;
    var password = document.getElementById ('input_sign_up_password').value;
    var password_re = document.getElementById ('input_sign_up_password_re').value;
    var input = {username: username, password: password, password_re: password_re};
    fetch ('sign-up', {method: 'POST', headers: {'Content-Type': 'application/json;charset=utf-8'}, body: JSON.stringify (input)}).then (res => res.json ()).then (output => {
        if (output.success) {
            fetch ('sign-in/' + username + '/' + password, {method: 'GET'}).then (res => res.json ()).then (output => {
                cookie_post ('account', output.account);
                cookie_post ('code', output.code);
                window.location = 'dashboard.html';
            })
        } else {
            alert (output.message);
        }
    })
}