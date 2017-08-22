(function($) {
    $.fn.movimentaElemento = function(graus) {
        $(this).attr({
            style: 'transform: rotate(' + graus + 'deg)'
        });
    };
})(jQuery);