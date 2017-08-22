(function($) {
    $.fn.movimentaBala = function(graus) {
        $(this).attr({
            style: 'animation-name: movimentaBala; animation-duration: 5s; @keyframes movimentaBala { 0%{margin-left: 10px;} 50%{margin-left:500px;} 100%{margin-left:1000px}}'
        });
    };
})(jQuery);