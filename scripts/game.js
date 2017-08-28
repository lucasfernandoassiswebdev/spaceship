var vida = 1000,
    x2 = 0,
    y2 = 0,
    pontos = 0,
    tempo = 2000,
    pedras = 0,
    graus = 0,
    right,
    left,
    speed = 3,
    xBoss,
    yBoss,
    tempoTiroBoss = 1000,
    lado = 'D',
    valor = 14;

$(document).ready(function() {
    geraNave();

    $('#looseLabelA, #looseButton, .vida').hide();

    $('#looseButton').on('click', function() {
        vida = 1000;
        tempo = 2000;
        pontos = 0;

        $('.vida, #looseButton, #looseLabelA').hide();
        $('.estrela').remove();
        $('#pontos').html('Pontuação: 0');

        intervalColisao = setInterval(verificaBatida, 200);
        intervalColisaoTiros = setInterval(verificaBatidaTiro, 200);
        intervalAsteroides = setInterval(geraAsteroide, tempo);
        intervalTiros = setInterval(movimentaTiro, 15);

        geraNave();
    });

});

function geraNave() {
    $('#nave').append($('<img/>').attr({
        src: 'images/nave2.png',
        style: 'width:50px;height:50px;'
    }));
}

var intervalAsteroides = setInterval(geraAsteroide, tempo);
var intervalTiros = setInterval(movimentaTiro, 25);

function geraAsteroide() {
    var tNave = $('#nave').position().top;
    var lNave = $('#nave').position().left;
    var size = Math.floor(Math.random() * 100) + 50;
    var marginl = Math.floor(Math.random() * ($(window).width() - 200)) + 80;
    var margint = Math.floor(Math.random() * ($(window).height() - 200)) + 80;

    while (marginl >= (lNave - 200) && marginl <= (lNave + 100) && margint >= (tNave - 200) && margint <= (tNave + 200)) {
        var marginl = Math.floor(Math.random() * ($(window).width() - 200)) + 80;
        var margint = Math.floor(Math.random() * ($(window).height() - 200)) + 80;
    }

    $('body').append($('<img/>').attr({
        src: 'images/asteroide.png',
        style: 'width: ' + size + 'px; height: ' + size + 'px; left: ' + marginl + 'px; top: ' + margint + 'px;',
        class: 'estrela'
    }));
    pedras = $('.estrela').length;

    if (pedras == 10) {
        clearInterval(intervalAsteroides);
        setTimeout(function() {
            intervalAsteroides = setInterval(geraAsteroide, tempo);
        }, 4000);
    }
}

$(document).on("mousemove", function(evt) {
    $('#nave').css({ left: evt.pageX - 25, top: evt.pageY - 30 });
});

$(document).bind('click', function() {
    if (lado == 'E') {
        valor = -0;
        lado = 'D';
    } else {
        valor = 20;
        lado = 'E';
    };
    atira();
});

function atira() {
    x = $('#nave')[0].getBoundingClientRect().left;
    y = $('#nave')[0].getBoundingClientRect().top;
    $('body').append($('<img/>').attr({
        src: 'images/bala.png',
        style: 'left: ' + (x + valor) + 'px; top: ' + y + 'px; transform: rotate(' + graus + 'deg);',
        class: 'bala'
    }).attr("data-grau", graus));
}

/* 
function movimentaTiro() {
    esse trecho vai ser o míssil teleguiado
    $('.bala').each(function() {
        eixoy -= 20;
        if (eixoy < -800) {
            $(this).remove();
            eixoy = 0;
        } else {
            $(this).css({
                transform: 'rotate(' + graus + 'deg) translate(' + 0 + 'px, ' + eixoy + 'px)'
            });
        }
    });
}
*/

function movimentaTiro() {
    $('.bala').each(function() {
        var eixoy = (+$(this).attr("data-eixo") || 0) - 20;

        if (eixoy < -2000) {
            $(this).remove();
        } else {
            $(this)
                .css('transform', 'rotate(' + $(this).attr("data-grau") + 'deg) translate(' + valor + 'px, ' + eixoy + 'px)')
                .attr("data-eixo", eixoy);
        }
    });
}

window.onkeydown = function(e) {
    var key = e.keyCode ? e.keyCode : e.which;
    if (key == 68)
        right = true;
    if (key == 65)
        left = true;
}

window.onkeyup = function(e) {
    var key = e.keyCode ? e.keyCode : e.which;
    if (key == 68)
        right = undefined;
    if (key == 65)
        left = undefined;
}

setInterval(function() {
    if (!left && !right)
        return;
    if (left)
        graus -= speed;
    if (right)
        graus += speed;

    $('#nave').css('transform', 'rotate(' + graus + 'deg)');
}, 10);

function verificaBatida() {
    var nave = $("#nave");
    var asteroides = $(".estrela");

    var rangeIntersect = function(min0, max0, min1, max1) {
        return Math.max(min0, max0) >= Math.min(min1, max1) && Math.min(min0, max0) <= Math.max(min1, max1)
    }

    var rectIntersect = function(r0, r1) {
        return rangeIntersect(r0.left, r0.right, r1.left, r1.right) && rangeIntersect(r0.top, r0.bottom, r1.top, r1.bottom)
    }

    var BBoxA = nave[0].getBoundingClientRect();
    asteroides.each(function() {
        var BBoxB = this.getBoundingClientRect();
        if (rectIntersect(BBoxA, BBoxB)) {
            $('img:eq(0), .estrela').attr('src', 'images/explosao.gif-c200');

            setTimeout(function() {
                graus = 0;

                $('img:eq(0), .estrela, .bala').remove();
                $('#looseLabelA, #looseButton').show();
                $("*").css("cursor", "default");

                clearInterval(intervalAsteroides);
                clearInterval(intervalColisaoTiros);
                clearInterval(intervalTiros);
            }, 400);

            $('#pontos').html('Destruído');
        }
    });
}

function verificaBatidaTiro() {
    var rangeIntersect = function(min0, max0, min1, max1) {
        return Math.max(min0, max0) >= Math.min(min1, max1) && Math.min(min0, max0) <= Math.max(min1, max1)
    }

    var rectIntersect = function(r0, r1) {
        return rangeIntersect(r0.left, r0.right, r1.left, r1.right) && rangeIntersect(r0.top, r0.bottom, r1.top, r1.bottom)
    }
    var excluir = false;

    $(".bala").each(function() {
        var BBoxA = this.getBoundingClientRect();
        $(".estrela").each(function() {
            var BBoxB = this.getBoundingClientRect();
            if (rectIntersect(BBoxA, BBoxB)) {
                excluir = true;
                pontos++;
                tempo--;

                if (pontos < 25) {
                    clearInterval(intervalAsteroides);
                    intervalAsteroides = setInterval(geraAsteroide, tempo);

                    $(this).attr('src', 'images/explosao.gif-c200').addClass("explodiu");
                    setTimeout(function() {
                        $('.explodiu').remove();
                    }, 600);

                    $('#pontos').html('Pontuação: ' + pontos);
                } else {
                    nascerBoss();
                    clearInterval(intervalColisaoTiros);
                }
            }
        });
        if (excluir == true) {
            $(this).remove();
            excluir = false;
        }
    });
}

intervalColisao = setInterval(verificaBatida, 10);
intervalColisaoTiros = setInterval(verificaBatidaTiro, 10);

/////////////////////////////////////////////////códigos do boss/////////////////////////////////////////////////////////
function nascerBoss() {
    clearInterval(intervalAsteroides);

    $('.estrela').remove();
    $('#pontos').html('Boss');
    $('.vida').show();
    $('#boss').append($('<img/>').attr({
        src: 'images/inimigo.png',
        style: 'width:150px;height:150px;transform:rotate(90deg)',
        class: 'boss'
    }));

    intervalTirosBoss = setInterval(bossShoot, tempoTiroBoss);
    intervalBalasBoss = setInterval(movimentaTiroBoss, 20);
    intervalBatida = setInterval(batidaBoss, 20);
    intervalNaveBoss = setInterval(verificaTiroNaveBoss, 20)
    intervalBossNave = setInterval(verificaTiroBossNave, 20);

    intervalAumentaDificuldade = setInterval(function() {
        if (tempoTiroBoss >= 101) {
            clearInterval(intervalTirosBoss);
            tempoTiroBoss -= 75;
            intervalTirosBoss = setInterval(bossShoot, tempoTiroBoss);
        }
    }, 4000);

    intervalRegen = setInterval(function() {
        if (vida <= 950) {
            vida += 50;
        }
    }, 4500);
}

function bossShoot() {
    yBoss = $('.boss').position().top;

    $('body').append($('<img/>').attr({
        src: 'images/balaBoss.png',
        style: 'position:absolute; left: 160px; top: ' + (yBoss + 62.5) + 'px; width: 20px; height: 20px',
        class: 'bossShoot',
    }).attr("data-left", 160));
}

function movimentaTiroBoss() {
    $('.bossShoot').each(function() {
        var pixels = (+$(this).attr("data-left")) + 20;
        if (pixels > $(window).width()) {
            $(this).remove();
        } else {
            $(this).css('left', pixels).attr('data-left', pixels);
        }
    });
}

function batidaBoss() {
    var nave = $("#nave");
    var asteroides = $(".boss");

    var rangeIntersect = function(min0, max0, min1, max1) {
        return Math.max(min0, max0) >= Math.min(min1, max1) && Math.min(min0, max0) <= Math.max(min1, max1)
    }

    var rectIntersect = function(r0, r1) {
        return rangeIntersect(r0.left, r0.right, r1.left, r1.right) && rangeIntersect(r0.top, r0.bottom, r1.top, r1.bottom)
    }

    var BBoxA = nave[0].getBoundingClientRect();
    asteroides.each(function() {
        var BBoxB = this.getBoundingClientRect();
        if (rectIntersect(BBoxA, BBoxB)) {
            $('img:eq(0), .estrela, .boss').attr('src', 'images/explosao.gif-c200');
            setTimeout(function() {
                graus = 0;
                $('img:eq(0), .estrela, .bala, .bossShoot').remove();
                limpaIntervals();
                $('#looseLabelA, #looseButton').show();
                $("*").css("cursor", "default");

            }, 400);
            $('#pontos').html('Destruído');
        }
    });
}

function verificaTiroNaveBoss() {
    var rangeIntersect = function(min0, max0, min1, max1) {
        return Math.max(min0, max0) >= Math.min(min1, max1) && Math.min(min0, max0) <= Math.max(min1, max1)
    }

    var rectIntersect = function(r0, r1) {
        return rangeIntersect(r0.left, r0.right, r1.left, r1.right) && rangeIntersect(r0.top, r0.bottom, r1.top, r1.bottom)
    }

    var excluir = false;
    $(".bala").each(function() {
        var BBoxA = this.getBoundingClientRect();
        $(".boss").each(function() {
            var BBoxB = this.getBoundingClientRect();

            if (rectIntersect(BBoxA, BBoxB)) {
                excluir = true;
                vida -= 7;
                var porcentagem = (vida * 100) / 1000;

                $('.vida').addClass('efeitoPerca').css('width', porcentagem + '%');
                $('#pontos').html('Boss vida: ' + vida);

                setTimeout(function() {
                    $('.vida').removeClass('efeitoPerca');
                }, 300);

                if (vida <= 0) {
                    limpaIntervals();

                    $('#pontos').html('You win');
                    $('.boss').attr('src', 'images/explosao.gif-c200');

                    setTimeout(function() {
                        $('img').remove();
                        $('#looseButton').show();
                        $('*').css('cursor', 'default');
                    }, 400);
                }
            }
        });
        if (excluir == true) {
            $(this).remove();
            excluir = false;
        }
    });
}

function verificaTiroBossNave() {
    var rangeIntersect = function(min0, max0, min1, max1) {
        return Math.max(min0, max0) >= Math.min(min1, max1) && Math.min(min0, max0) <= Math.max(min1, max1)
    }

    var rectIntersect = function(r0, r1) {
        return rangeIntersect(r0.left, r0.right, r1.left, r1.right) && rangeIntersect(r0.top, r0.bottom, r1.top, r1.bottom)
    }

    $(".bossShoot").each(function() {
        var BBoxA = this.getBoundingClientRect();
        $("#nave").each(function() {
            var BBoxB = this.getBoundingClientRect();

            if (rectIntersect(BBoxA, BBoxB)) {
                $('#pontos').html('Você foi destruído');
                $(this).attr('src', 'images/explosao.gif-c200');

                setTimeout(function() {
                    limpaIntervals();

                    graus = 0;

                    $('img').remove();
                    $('#looseButton').show();
                    $('*').css('cursor', 'default');
                }, 500);
            }
        });
    });
}

function limpaIntervals() {
    clearInterval(intervalColisao);
    clearInterval(intervalBatida);
    clearInterval(intervalBalasBoss);
    clearInterval(intervalNaveBoss);
    clearInterval(intervalBossNave);
    clearInterval(intervalTirosBoss);
    clearInterval(intervalAsteroides);
    clearInterval(intervalAumentaDificuldade);
    clearInterval(intervalTiros);
    clearInterval(intervalRegen);
}