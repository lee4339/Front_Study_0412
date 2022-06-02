$(document).ready(function () { //외부시트 적용시에는 무조건 적용

    // 초기값 선언
    var current = 0;

    $('.btns > li').click(function () {
        var i = $(this).index();

    $('.btns > li').removeClass('on');
    $('.btns > li').eq(i).addClass('on');

        move(i);
    });

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
}); 
