$(document).ready(function () { //외부시트 적용시에는 무조건 적용

    // 초기값 선언
    var current = 0;
    var i = 0;
    var setIntervalid;

    $('.btns > li').click(function () {
        var i = $(this).index();

    $('.btns > li').removeClass('on');
    $('.btns > li').eq(i).addClass('on');

        move(i);
    });

    $('#main_img').hover(
        function () {
            clearInterval(setIntervalid);
        },
        function () {
            timer();
        }
    )
    
    timer();
    $('.btns > li').eq(i).addClass('on');

    function timer() {
        setIntervalid = setInterval(function () {
            i = i + 1;
            if (i == 3) { //최대값이 되었을때 최소값으로 이동을 제어
                i = 0
            }
            $('.btns > li').removeClass('on');
            $('.btns > li').eq(i).addClass('on');
            move(i);
        }, 3000);
        
    }
    function move(i) {
        if(current == i) return; 
        // 현재 보이는 슬라이드와 클릭한 버튼의 인덱스값이 같다면
        // 이 다음 코딩은 수행하지 않고 나감
        
        var currentEl = $('#imgs > ul > li').eq(current); 
        var nextEl = $('#imgs > ul > li').eq(i);

        currentEl.stop().css({ left: '0%' }).animate({ left: '-100%' });
        nextEl.stop().css({ left: '100%' }).animate({ left: '0%' });

        current = i;

    }

    function move2(i) {
        if(current == i) return; 
        // 현재 보이는 슬라이드와 클릭한 버튼의 인덱스값이 같다면
        // 이 다음 코딩은 수행하지 않고 나감
        
        var currentEl = $('#imgs > ul > li').eq(current); 
        var nextEl = $('#imgs > ul > li').eq(i);

        currentEl.stop().css({ left: '0%' }).animate({ left: '100%' });
        nextEl.stop().css({ left: '-100%' }).animate({ left: '0%' });

        current = i;

    }

    $('.next').click(function () {
        i = i + 1;
        if (i == 3) { //최대값이 되었을때 최소값으로 이동을 제어
            i = 0
        }
        move(i);
        $('.btns > li').removeClass('on');
        $('.btns > li').eq(i).addClass('on');
    })

    $('.prev').click(function () {
        i = i + 1;
        if (i == 3) { //최소값이 되었을때 최소값으로 이동을 제어 
            i = 0;
        }
        move2(i);
        $('.btns > li').removeClass('on');
        $('.btns > li').eq(i).addClass('on');
    })

    
}); 
