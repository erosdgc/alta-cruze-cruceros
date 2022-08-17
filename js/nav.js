$(document).ready(function(){
    $(window).bind('scroll', function(){
        var gap = 50;
        if($(window).scrollTop() > gap){
            $('header').addClass('active-navbar');
        } else{
            $('header').removeClass('active-navbar');
        }
    });
});

$(document).ready(function(){
    $(window).scroll(function(){
        if($(this).scrollTop() > 40) {
            $("#bottombtn").fadeOut();
        } else{
            $("#bottombtn").fadeIn();
        }
    });
    $("#bottombtn").click(function(){
        $("html, body").animate({scrollDown : 0}, 800);
    });
});

$(document).ready(function(){
    $(window).scroll(function(){
        if($(this).scrollTop() > 40) {
            $("#topbtn").fadeIn();
        } else{
            $("#topbtn").fadeOut();
        }
    });
    $("#topbtn").click(function(){
        $("html, body").animate({scrollTop : 0}, 800);
    });
});