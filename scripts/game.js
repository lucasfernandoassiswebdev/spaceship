//variáveis de controle de jogo
var pontos = 0,
    tempo = 2000,
    nasceAsteroide = true,
    animacoes = ['desceEsquerda', 'desceDireita'],
    imgAsteroide = ['meteoro1.gif', 'meteoro2.gif'];
//variáveis de controle da nave
var naveObj = {
    graus: 0,
    lado: 'D',
    velocidade: 3,
    valor: 14
};
//variáveis de controle de rotação da nave
var direita,
    esquerda;
//variáveis de controle do boss
var bossObj = {
    vida: 1000,
    y: 0,
    tempoTiroBoss: 1000
}

$(document).ready(function() {
    geraNave();

    $('#looseLabelA, #looseButton, .vida').hide();

    $('#looseButton').on('click', function() {
        bossObj.vida = 1000;
        bossObj.tempoTiroBoss = 1000;
        tempo = 2000;
        pontos = 0;

        $('#looseLabelA, #looseButton, .vida').hide();
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
    $('#nave').append($('<img/>').attr("src", 'images/naves/nave2.png'));
}

function geraAsteroide() {
    var tamanho = Math.floor(Math.random() * 91) + 20;
    var marginl = Math.floor(Math.random() * $(window).width()) + 0;

    //sorteando a animação
    var animacao = Math.floor(Math.random() * 2) + 0;

    //sorteando o asteróide
    var sorteado = Math.floor(Math.random() * imgAsteroide.length) + 0;

    //sorteando o angulo do asteróide
    var anguloSorteado = Math.floor(Math.random() * 361) + 0;

    //mudando efeito estrelas de acordo com a direção em que o asteróide vem
    if (animacao == 0) {
        snowStorm.randomizeWind(-10, 10);
    } else {
        snowStorm.randomizeWind(10, 10);
    }

    $('body').append($('<img/>').attr({
        src: 'images/meteoros/' + imgAsteroide[sorteado],
        style: 'width: ' + tamanho + 'px; height: ' + tamanho + 'px; left: ' + marginl + 'px; top: -10px; transform: rotate(' + anguloSorteado + 'deg)',
        class: 'estrela ' + animacoes[animacao]
    }));

    setTimeout(function() {
        $('.estrela:not(.explodiu):eq(0)').remove();
    }, 1500);
}

$(document).on("mousemove", function(evt) {
    //fazendo a nave acompanhar o mouse
    $('#nave').css({ left: evt.pageX - 25, top: evt.pageY - 30 });
});

$(document).bind('click', function() {
    //código que faz os tiros sairem alternadamente da nave
    if (naveObj.lado == 'E') {
        naveObj.valor = 1;
        naveObj.lado = 'D';
    } else {
        naveObj.valor = 8;
        naveObj.lado = 'E';
    };
    atira();
});

function atira() {
    naveObj.x = $('#nave')[0].getBoundingClientRect().left;
    naveObj.y = $('#nave')[0].getBoundingClientRect().top;
    $('body').append(
        $('<img/>').attr('src', 'images/balas/bala.png').addClass('bala').css({
            position: 'absolute',
            left: (naveObj.x + naveObj.valor + 7.8) + 'px',
            top: naveObj.y + 'px',
            transform: 'rotate(' + naveObj.graus + 'deg) translate(' + naveObj.valor + 'px, ' + naveObj.y + 'px)'
        }).attr("data-grau", naveObj.graus).attr("data-eixo-x", naveObj.valor)
    );
}

function movimentaTiro() {
    $('.bala').each(function() {
        var eixoYBala = (+$(this).attr("data-eixo-y") || 0) - 30;

        if (eixoYBala < -2000) {
            $(this).remove();
        } else {
            $(this)
                .css('transform', 'rotate(' + $(this).attr("data-grau") + 'deg) translate(' + $(this).attr('data-eixo-x') + 'px, ' + eixoYBala + 'px)')
                .attr('data-eixo-y', eixoYBala);
        }
    });
}

/* 
function movimentaTiroTeleguiado() {
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

window.onkeydown = function(e) {
    var key = e.keyCode ? e.keyCode : e.which;
    if (key == 68)
        direita = true;
    if (key == 65)
        esquerda = true;
}

window.onkeyup = function(e) {
    var key = e.keyCode ? e.keyCode : e.which;
    if (key == 68)
        direita = undefined;
    if (key == 65)
        esquerda = undefined;
}

setInterval(function() {
    if (!esquerda && !direita)
        return;
    if (esquerda)
        naveObj.graus -= naveObj.velocidade;
    if (direita)
        naveObj.graus += naveObj.velocidade;

    $('#nave').css('transform', 'rotate(' + naveObj.graus + 'deg)');
}, 10);

function verificaBatida() {
    //colisão entre nave e meteoros
    var nave = $("#nave");
    var asteroides = $(".estrela:not(.explodiu)");

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
            $('#nave img').attr('src', 'images/explosao.gif-c200');

            setTimeout(function() {
                naveObj.graus = 0;

                $('#nave img, .estrela, .bala').remove();
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
    //colisão entre os tiros da nave e os meteoros
    var rangeIntersect = function(min0, max0, min1, max1) {
        return Math.max(min0, max0) >= Math.min(min1, max1) && Math.min(min0, max0) <= Math.max(min1, max1)
    }

    var rectIntersect = function(r0, r1) {
        return rangeIntersect(r0.left, r0.right, r1.left, r1.right) && rangeIntersect(r0.top, r0.bottom, r1.top, r1.bottom)
    }

    var excluir = false;

    $(".bala").each(function() {
        var BBoxA = this.getBoundingClientRect();
        $(".estrela:not(.explodiu)").each(function() {
            var BBoxB = this.getBoundingClientRect();
            if (rectIntersect(BBoxA, BBoxB)) {
                excluir = true;
                tempo -= 20;

                //verificando o tamanho do asteróide para dar os pontos
                if ($(this).attr('width') >= 20 && $(this).attr('width') <= 30) {
                    pontos += 10;
                } else if ($(this).attr('width') > 30 && $(this).attr('width') <= 50) {
                    pontos += 5;
                } else {
                    pontos++;
                }

                if (pontos <= 120) {
                    clearInterval(intervalAsteroides);
                    intervalAsteroides = setInterval(geraAsteroide, tempo);

                    $(this).attr('src', 'images/explosao.gif-c200').addClass("explodiu").css({
                        animation: "none",
                        top: BBoxB.top + "px",
                        left: BBoxB.left + "px"
                    });
                    setTimeout(function() {
                        $('.explodiu').remove();
                    }, 600);

                    $('#pontos').html('Pontuação: ' + pontos);
                } else {
                    nascerBoss();
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
intervalColisaoTiros = setInterval(verificaBatidaTiro, 5);
intervalAsteroides = nasceAsteroide ? setInterval(geraAsteroide, tempo) : undefined;
intervalTiros = setInterval(movimentaTiro, 25);

/////////////////////////////////////////////////códigos do boss/////////////////////////////////////////////////////////
function nascerBoss() {
    clearInterval(intervalAsteroides);

    $('.estrela').remove();
    $('#pontos').html('Boss');
    $('.vida').show();
    $('#boss').append($('<img/>').attr({
        src: 'images/naves/inimigo.png',
        style: 'width:150px;height:150px;transform:rotate(90deg)',
        class: 'boss'
    }));

    intervalTirosBoss = setInterval(bossShoot, bossObj.tempoTiroBoss);
    intervalBalasBoss = setInterval(movimentaTiroBoss, 20);
    intervalBatida = setInterval(batidaBoss, 20);
    intervalNaveBoss = setInterval(verificaTiroNaveBoss, 20)
    intervalBossNave = setInterval(verificaTiroBossNave, 20);

    //aumenta a velocidade dos tiros do boss
    intervalAumentaDificuldade = setInterval(function() {
        if (bossObj.tempoTiroBoss >= 101) {
            clearInterval(intervalTirosBoss);
            bossObj.tempoTiroBoss -= 40;
            intervalTirosBoss = setInterval(bossShoot, bossObj.tempoTiroBoss);
        }
    }, 4000);

    //regenera a vida do boss 
    intervalRegen = setInterval(function() {
        if (bossObj.vida <= 950) {
            bossObj.vida += 50;

            $('#pontos').html('Boss vida: ' + bossObj.vida);
            $('.vida').addClass('efeitoGanho');

            setTimeout(function() {
                $('.vida').removeClass('efeitoGanhoVida');
            }, 400);
        }
    }, 4500);
}

function bossShoot() {
    bossObj.y = $('.boss').position().top;

    $('body').append($('<img/>').attr({
        src: 'images/balas/balaBoss.png',
        style: 'position:absolute; left: 160px; top: ' + (bossObj.y + 62.5) + 'px; width: 20px; height: 20px',
        class: 'bossShoot',
    }).attr("data-esquerda", 160));
}

function movimentaTiroBoss() {
    $('.bossShoot').each(function() {
        var pixels = (+$(this).attr("data-esquerda")) + 20;
        if (pixels > $(window).width()) {
            $(this).remove();
        } else {
            $(this).css('left', pixels).attr('data-esquerda', pixels);
        }
    });
}

function batidaBoss() {
    //colisão entre a nave e o boss
    var nave = $("#nave");
    var boss = $(".boss");

    var rangeIntersect = function(min0, max0, min1, max1) {
        return Math.max(min0, max0) >= Math.min(min1, max1) && Math.min(min0, max0) <= Math.max(min1, max1)
    }

    var rectIntersect = function(r0, r1) {
        return rangeIntersect(r0.left, r0.right, r1.left, r1.right) && rangeIntersect(r0.top, r0.bottom, r1.top, r1.bottom)
    }

    var BBoxA = nave[0].getBoundingClientRect();
    var BBoxB = boss[0].getBoundingClientRect();

    if (rectIntersect(BBoxA, BBoxB)) {
        $('#nave img, .boss').attr('src', 'images/explosao.gif-c200');

        setTimeout(function() {
            naveObj.graus = 0;

            $('#nave img, .bala, .bossShoot, .boss').remove();
            $('#looseLabelA, #looseButton').show();
            $("*").css("cursor", "default");

            limpaIntervals();
        }, 500);

        $('#pontos').html('Destruído');
    }
}

function verificaTiroNaveBoss() {
    //colisão entre os tiros da nave e o boss
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
                bossObj.vida -= 7;
                var porcentagem = (bossObj.vida * 100) / 1000;

                $('.vida').addClass('efeitoPerca').css('width', porcentagem + '%');
                $('#pontos').html('Boss vida: ' + bossObj.vida);

                setTimeout(function() {
                    $('.vida').removeClass('efeitoPerca');
                }, 300);

                if (bossObj.vida <= 0) {
                    limpaIntervals();

                    $('#pontos').html('Você destruiu o boss <br/> Você venceu');
                    $('.boss').attr('src', 'images/explosao.gif-c200');

                    setTimeout(function() {
                        $('.boss, .bossShoot, #nave img').remove();
                        $('#looseButton').show();
                        $('*').css('cursor', 'default');
                    }, 500);
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
    //verificando se algum tiro do boss atingiu a nave
    var rangeIntersect = function(min0, max0, min1, max1) {
        return Math.max(min0, max0) >= Math.min(min1, max1) && Math.min(min0, max0) <= Math.max(min1, max1)
    }

    var rectIntersect = function(r0, r1) {
        return rangeIntersect(r0.left, r0.right, r1.left, r1.right) && rangeIntersect(r0.top, r0.bottom, r1.top, r1.bottom)
    }

    $(".bossShoot").each(function() {
        var BBoxA = this.getBoundingClientRect();
        var BBoxB = $('#nave img')[0].getBoundingClientRect();

        if (rectIntersect(BBoxA, BBoxB)) {
            $('#pontos').html('Você foi destruído');
            $('#nave img').attr('src', 'images/explosao.gif-c200');

            setTimeout(function() {
                limpaIntervals();

                naveObj.graus = 0;

                $('img').remove();
                $('#looseButton').show();
                $('*').css('cursor', 'default');
            }, 500);
        }

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