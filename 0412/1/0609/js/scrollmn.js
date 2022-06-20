// $(document).ready(function () {
//     $('#header ul li').click(function () {
//         var i = $(this).index();
//         var t = $('#contents > div').eq(i).offset().top;

//         $('html, body').stop().animate({
//             scrollTop: t
//         });
//     })

// });
$(document).ready(function () {
    var menu = $('ul.menu > li');
    
    menu.click(function (e) {
        e.preventDefault();
        var i = $(this).index();

        // //스타일적용을 초기화(삭제)
        // menu.removeClass('on');
        // //해당되는 버튼 스타일 적용
        // $(this).addClass('on');

        var section = $('#contents > div').eq(i);
        var target = section.offset().top;

        $('html, body').animate({
            scrollTop: target
        });
    });


    //스크롤이벤트가 적용될때 버튼에 색상을 조절
    $(window).scroll(function () {
        var sct = $(window).scrollTop();
        var wintop = $(window).scrollTop() + 200;

        //$('#contents > div') 순서대로 하나씩 처리하는 문장,,,, 순환처리문
        $('#contents > div').each(function () { //con1(i = 0)
            var i = $(this).index();

            if($(this).offset().top <= sct) {               
                menu.removeClass('on');
                menu.eq(i).addClass('on');  
            }
        })
        $("#q_mn").stop().animate({ top: wintop + "px"}, 500);
    })
});