var GoogleAuth;
var SCOPE = 'https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/youtube.force-ssl https://www.googleapis.com/auth/youtubepartner https://www.googleapis.com/auth/youtube.upload';

var volunteerInfo = {};

function handleClientLoad() {
    // Loads the client library and the auth2 library together for efficiency.
    // Loading the auth2 library is optional here since `gapi.client.init` function will load
    // it if not already loaded. Loading it upfront can save one network request.
    gapi.load('client:auth2', initClient);

}

function initClient() {
    // Initialize the client with API key and People API, and initialize OAuth with an
    // OAuth 2.0 client ID and scopes (space delimited string) to request access.
    gapi.client.init({
        apiKey: 'AIzaSyC4rvGZ1Fe_JwHyG9Zw0SJGfs7inuSCXFE',
        clientId: '663550799555-8pqudt3hl0qu6666ge4tp08u4ql37r0s.apps.googleusercontent.com',
        client_secret: 'fDPXTMKIo6D5qckhNfCkjde7',
        scope: SCOPE,
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest']
    }).then(function () {
        console.log("signed in: " + gapi.auth2.getAuthInstance().isSignedIn.get());

        GoogleAuth = gapi.auth2.getAuthInstance();

        // Listen for sign-in state changes.
        // GoogleAuth.isSignedIn.listen(updateSigninStatus);

        setSigninStatus();

        // Handle initial sign-in state. (Determine if user is already signed in.)
        
        // $('#signin').click(function() {
        //     handleSignInClick();
        //     console.log('c in');
        // }); 

        // $('#signout').click(function() {
        //     handleSignOutClick();
        //     console.log('c out');
        // }); 

    });
}

function setSigninStatus(isSignedIn) {
    // When signin status changes, this function is called.
    // If the signin status is changed to signedIn, we make an API call.
    var user = GoogleAuth.currentUser.get();
    var isAuthorized = user.hasGrantedScopes(SCOPE);

    localStorage.setItem('token', user.getAuthResponse().id_token);
    
    if (isAuthorized) {

        $('#menu').load('menu.html', function() {
            name = localStorage.getItem('name');
            if(name != 'null' && name != '') {
                console.log('name ' + name);
                setLoginNavbar(); 
            } else {
                makeApiCall(); 
            }
            setMenuEffect();
        });

    } else {
        $('#menu').load('menu.html', function() {
            setDefaultNavbar();
            setMenuEffect();
        });

    }

}

function setMenuEffect() {
    $(window).scroll(function() {
        var offset = $(window).scrollTop();
        $('.navbar').toggleClass('trans', offset > 50);
    });
}

function setLoginNavbar() {
    $('#authenDropdown').addClass('nav-item dropdown').html(`
        <a class="nav-link dropdown-toggle" data-toggle="dropdown" id="Preview" href="#" role="button" aria-haspopup="true" aria-expanded="false">
            ${localStorage.getItem('name')}
        </a>
        <div class="dropdown-menu" aria-labelledby="Preview">
            <a class="dropdown-item" href="profile.html">โปรไฟล์</a>
            <a class="dropdown-item signout" href="#">ออกจากระบบ</a>         
        </div>
    `);

    $('#authenHam').addClass('nav-item').html(`
        <a class="nav-link signout" href="#">ออกจากระบบ</a>
    `);

    $('.signout').click(function() {
        handleSignOutClick();
    });
    $('.user-detail ').show();
    volunteer_id = localStorage.getItem('volunteer_id');
    volunteerID = JSON.stringify({
        volunteer_id : volunteer_id
    });
    $.ajax({
        url : 'php/functions.php?function=getReadtime&param='+volunteerID,
        success : function(user) {
            user = JSON.parse(user);
            var url = user.avatar;

            if(!url){
                url = "img/user.png";
            }
            if(user == "0"){
                $('#user').html(`
                    <img src="${url}" class="img-top">
                    <p> 0 นาที</p>
                `);
                        
            }else{
                
                
                $('#user').html(`
                    <img src="${url}" class="img-top">
                    <p> ${user.video_time} นาที</p>
                `);
            }

            contentNotice();
            contentResponse();
        }
    });
    $('.topBeforeLogin').removeClass('col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12').addClass('col-9 col-sm-9 col-md-10 col-lg-10 col-xl-11');


}

function setDefaultNavbar() {
    $('#authenDropdown').addClass('nav-item').html(`
        <a class="nav-link signin" href="#">เข้าสู่ระบบ</a>
    `);

    $('#authenHam').addClass('nav-item').html(`
        <a class="nav-link signin" href="#">เข้าสู่ระบบ</a>
    `);

    $('.signin').click(function() {
        handleSignInClick();
    }); 
}

function contentNotice() {
    volunteer_id = localStorage.getItem('volunteer_id');
    if(!volunteer_id) {
        $(".countNotice").hide();
        $(".countNotify").hide();
    }else{
        $(".countNotice").show();
        $(".countNotify").show();
        $.ajax({
            url : "php/functions.php?function=getAllRequest&param="+localStorage.getItem('volunteer_id'),
            success : function(counts){
                counts = JSON.parse(counts);

                allCount = 0;

                $.each(counts, function(index, count) {

                    if(count.is_read == 0) {
                        allCount += parseInt(count.count);
                    }

                });

                if(allCount == 0){
                    $('.countNotice').hide();
                    $(".countNotify").hide();

                }else{
                    $('.countNotice')
                            .css({ opacity: 0 })
                            .text(''+allCount)              // ADD DYNAMIC VALUE (YOU CAN EXTRACT DATA FROM DATABASE OR XML).
                            .css({ top: '20px' ,left:'6px'})
                            .animate({ top: '20px', opacity: 1 }, 200);
                    $('.countNotify')
                            .css({ opacity: 0 })
                            .text(''+allCount)              // ADD DYNAMIC VALUE (YOU CAN EXTRACT DATA FROM DATABASE OR XML).
                            .css({ top: '22px' ,right:'92px'})
                            .animate({ top: '22px', opacity: 1 }, 200);

                }

            }
        });
    }
}

function contentResponse() {
    volunteer_id = localStorage.getItem('volunteer_id');
    if(!volunteer_id) {
        $(".countRes").hide();
        $(".countResponse").hide();
    }else{
        $(".countRes").show();
        $(".countResponse").show();
        $.ajax({
            url : "php/functions.php?function=queryNoti&param="+volunteer_id,
            success : function(counts){
                counts = JSON.parse(counts);

                console.log(counts);

                allCount = 0;

                $.each(counts, function(index, count) {

                    if(count.is_read == 1) {
                        allCount += 1;
                    }

                });

                if(allCount==0){
                    $('.countRes').hide();
                    $(".countResponse").hide();
                }else{
                    $('.countRes')
                            .css({ opacity: 0 })
                            .text(''+allCount)              // ADD DYNAMIC VALUE (YOU CAN EXTRACT DATA FROM DATABASE OR XML).
                            .css({ top: '20px' })
                            .animate({ top: '20px', opacity: 1 }, 200);
                    $('.countResponse')
                            .css({ opacity: 0 })
                            .text(''+allCount)              // ADD DYNAMIC VALUE (YOU CAN EXTRACT DATA FROM DATABASE OR XML).
                            .css({ top: '22px',right: '54px' })
                            .animate({ top: '22px', opacity: 1 }, 200);

                }

            }
        });
    }
}

function handleSignInClick(event) {
    // Ideally the button should only show up after gapi.client.init finishes, so that this
    // handler won't be called before OAuth is initialized.
    GoogleAuth.signIn().then(function() {
        // location.reload();
        makeApiCall();
    });
}

function handleSignOutClick(event) {
    GoogleAuth.signOut().then(function() {
        LogOut();
    });
}

function LogOut() {
    localStorage.setItem('name', '');
    localStorage.setItem('volunteer_id', '')
    localStorage.setItem('token', '');
    location.reload();
}

function makeApiCall() {  

    callGooglePlusApi(function() {
        callYoutubeApi(function() {
            setLoginNavbar();

            volunteerInfo = JSON.stringify(volunteerInfo);
            console.log(volunteerInfo);
            $.ajax({
                url : 'php/functions.php?function=insertVolunteer&param=' + volunteerInfo,
                success : function(data) {
                    console.log(data);
                }
            });
        })
    });

}

function callGooglePlusApi(callback) {
    gapi.client.load('plus','v1', function(){
        var request = gapi.client.plus.people.get({
            'userId': 'me'
        });
        request.execute(function(response) {
            volunteerInfo['volunteer_id'] = response.id;
            volunteerInfo['name'] = response.displayName;
            volunteerInfo['email'] = response.emails[0].value;
            volunteerInfo['address'] = '';
            volunteerInfo['birthday'] = '' /*response.birthday*/;
            volunteerInfo['sex'] = response.gender;
            if(!response.image.isDefault) volunteerInfo['avatar'] = response.image.url;
            // console.log(response);
            // console.log(resp.displayName);
            // console.log(resp.emails[0].value);
            // console.log(response.image); // image.url, image.isDefault
            // console.log(response.gender);
            // console.log(response.birthday);
            // console.log(JSON.stringify(response, null, 4));
            // console.log('Retrieved profile for:' + response.id + response.displayName);

            localStorage.setItem('name', volunteerInfo['name']);
            localStorage.setItem('volunteer_id', volunteerInfo['volunteer_id']);

            callback.apply(this, []);
        });
    });
}

function callYoutubeApi(callback) {
    var request = gapi.client.request({
          'method': 'GET',
          'path': '/youtube/v3/channels',
          'params': {'part': 'snippet, status, contentDetails, brandingSettings', 'mine': 'true'}
    });
    // Execute the API request.
    request.execute(function(response) {

        console.log(response);
        volunteerInfo['channel_link'] = response.items[0].id;

        if(!response.items[0].status.isLinked) {
            console.log('dont have channel');
            popupWindow("https://youtube.com/create_channel?chromeless=1&next=/channel_creation_done", "", 560, 420);
        }

        // console.log(response);
        
        // console.log('isLinked ' + response.items[0].status.isLinked);
        // console.log("channel " + response.items[0].id);

        callback.apply(this, []);
    });
}

function popupWindow(url, title, w, h) {
    var left = (screen.width/2)-(w/2);
    var top = (screen.height/2)-(h/2);
    var popup = window.open(url, title, 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);

    if(popup == null) {
        alert('กรุณาอนุญาตให้หน้าเว็บของคุณสามารถเข้าถึงป็อปอัพได้');
    } else {
        // Puts focus on the newWindow
        if (window.focus) {
            popup.focus();
        }
    }

}

