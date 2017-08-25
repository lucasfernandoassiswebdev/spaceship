//variáveis de controle do jogo
var vida = 100,
    x2 = 0,
    y2 = 0,
    pontos = 0,
    tempo = 1500,
    pedras = 0;

//variáveis para lidar com a rotação da nave
var graus = 0,
    right, left, speed = 3,
    xBoss, yBoss, tempoTiroBoss = 500;

$(document).ready(function() {
    //colocando a nave na tela
    geraNave();

    $('#looseLabelA, #looseButton, .vida').hide();

    $('#looseButton').on('click', function() {
        //é inicio novamente os intervals que haviam sido finalizados
        intervalColisao = setInterval(verificaBatida, 200);
        intervalColisaoTiros = setInterval(verificaBatidaTiro, 200);
        intervalAsteroides = setInterval(geraAsteroide, tempo);
        intervalTiros = setInterval(movimentaTiro, 15);
        //tela de derrota é escondida novamente
        $('#looseButton, #looseLabelA').hide();
        //concertando o gameboard
        $('#pontos').html('Pontuação: 0');
        //é recolocada a nave na tela
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

function geraAsteroide() {
    //esses números serão sorteados para fazer com que os asteróides nasçam em lugares aleatórios e dentro da tela
    //t = top / l == left
    var size = Math.floor(Math.random() * 100) + 10;
    var marginl = Math.floor(Math.random() * ($(window).width() - 200)) + 80;
    var margint = Math.floor(Math.random() * ($(window).height() - 200)) + 80;

    //é adicionado o asteróide na tela na posição sorteada
    $('body').append($('<img/>').attr({
        src: 'images/asteroide.png',
        style: 'width: ' + size + 'px; height: ' + size + 'px; left: ' + marginl + 'px; top: ' + margint + 'px;',
        class: 'estrela'
    }));
    pedras = $('.estrela').length;
    //definindo um número máximo de asteróides
    if (pedras == 10) {
        clearInterval(intervalAsteroides);
    }
}

$(document).on("mousemove", function(evt) {
    //fazendo a nave acompanhar o mouse
    $('#nave').css({ left: evt.pageX - 25, top: evt.pageY - 30 });
});

$(document).bind('click', atira);

function atira() {
    //encontrando as coordenadas da nave e fazendo a bala aparecer na frente
    x = $('#nave')[0].getBoundingClientRect().left;
    y = $('#nave')[0].getBoundingClientRect().top;
    $('body').append($('<img/>').attr({
        src: 'images/bala.png',
        style: 'left: ' + (x + 15) + 'px; top: ' + (y - 30) + 'px; transform: rotate(' + graus + 'deg);',
        class: 'bala'
    }).attr("data-grau", graus));
}

intervalTiros = setInterval(movimentaTiro, 20);

/* esse trecho vai ser o míssil teleguiado
function movimentaTiro() {
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
        if (eixoy < -800) {
            $(this).remove();
        } else {
            $(this).css({
                transform: 'rotate(' + $(this).attr("data-grau") + 'deg) translate(' + 0 + 'px, ' + eixoy + 'px)'
            }).attr("data-eixo", eixoy);
        }
    });
}

window.onkeydown = function(e) {
    //pegando a tecla pressionada e rodando a nave
    var key = e.keyCode ? e.keyCode : e.which;
    //se a tecla "D" é pressionada a variável right vira true
    if (key == 68)
        right = true;
    //o mesmo vale para a tecla a e a variável left
    if (key == 65)
        left = true;
}

window.onkeyup = function(e) {
    var key = e.keyCode ? e.keyCode : e.which;
    //quando essas teclas são soltas, as variáveis left e right elas voltam a ser undefined
    if (key == 68)
        right = undefined;
    if (key == 65)
        left = undefined;
}

setInterval(function() {
    //interval que rotaciona a nave
    //se as teclas "A" ou "D" não estão sendo pressionadas, o interpretador não executa a função até o finel
    if (!left && !right)
        return;
    //se as teclas esquerda ou direita estão sendo pressionadas, mudamos a curvatura da nave
    if (left)
        graus -= speed;
    if (right)
        graus += speed;
    //depois de mudar os graus de  curvatura, rotacionamos a nave
    $('#nave').css('transform', 'rotate(' + graus + 'deg)');
}, 10);

function verificaBatida() {
    //verifica se a nave colidou com algum asteróide
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
            //a primeira imagem sempre será a nave
            $('img:eq(0), .estrela').attr('src', 'images/explosao.gif-c200');
            var acm = 0;
            var intervalMorte = setInterval(function() {
                acm++;
                if (acm >= 40) {
                    graus = 0;
                    //movimentando as estrelas para fingir um abalo
                    snowStorm.randomizeWind;
                    //esse código apaga a nave, balas e asteróides que estão na tela
                    $('img:eq(0), .estrela, .bala').remove();
                    //limpando os intervals
                    clearInterval(intervalAsteroides);
                    clearInterval(intervalColisaoTiros);
                    clearInterval(intervalMorte);
                    clearInterval(intervalTiros);
                    //exibindo as labels
                    $('#looseLabelA, #looseButton').show();
                    //voltando o cursor a tela
                    $("*").css("cursor", "default");
                }
            }, 20);
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

    $(".bala").each(function() {
        var BBoxA = this.getBoundingClientRect();
        $(".estrela").each(function() {
            var BBoxB = this.getBoundingClientRect();
            if (rectIntersect(BBoxA, BBoxB)) {
                pontos++;
                if (pontos < 0) {
                    $(this).attr('src', 'images/explosao.gif-c200').addClass("explodiu");
                    setTimeout(function() {
                        $('.explodiu').remove();
                    }, 400);
                    $('#pontos').html('Pontuação: ' + pontos);
                } else {
                    //aqui vai surgir o boss 
                    //limpando asteróides e balas da tela
                    $('.estrela, .bala').remove();
                    $('.vida').show();
                    //limpando intervals necessários
                    clearInterval(intervalAsteroides);
                    //avisando que o boss surgiu
                    $('#pontos').html('Boss');
                    nascerBoss();
                }
            }
        });
    });
}

intervalColisao = setInterval(verificaBatida, 20);
intervalColisaoTiros = setInterval(verificaBatidaTiro, 10);

/////////////////////////////////////////////////códigos do boss/////////////////////////////////////////////////////////
//fazendo as balas nascerem e andarem
function nascerBoss() {
    $('#boss').append($('<img/>').attr({
        src: 'images/inimigo.png',
        style: 'width:150px;height:150px;transform:rotate(90deg)',
        class: 'boss'
    }));
    //fazendo as balas surgirem e movimentando elas logo após
    intervalTirosBoss = setInterval(bossShoot, tempoTiroBoss);
    intervalBalasBoss = setInterval(movimentaTiroBoss, 20);
    //verificando se a nave bateu com o Boss
    intervalBatida = setInterval(batidaBoss, 20);
    //verificando se algum tiro acertou
    intervalNaveBoss = setInterval(verificaTiroNaveBoss,20)
    intervalBossNave = setInterval(verificaTiroBossNave,20);
}

function bossShoot() {
    //pegando a posição atual do boss
    yBoss = $('.boss').position().top;
    //colocando a bala na frente dele
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

//verificando as colisões entre os tiros 
function batidaBoss() {
    //verifica se a nave colidou com algum asteróide
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
            $('img:eq(0), .estrela').attr('src', 'images/explosao.gif-c200');
            $('.boss').attr('src', 'images/explosao.gif-c200');
            var acm = 0;
            var intervalMorte = setInterval(function() {
                acm++;
                if (acm >= 10) {
                    graus = 0;
                    snowStorm.randomizeWind;
                    $('img:eq(0), .estrela, .bala').remove();
                    clearInterval(intervalAsteroides);
                    clearInterval(intervalColisaoTiros);
                    clearInterval(intervalMorte);
                    clearInterval(intervalTiros);
                    $('#looseLabelA, #looseButton').show();
                    $("*").css("cursor", "default");
                }
            }, 40);
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

    $(".bala").each(function() {
        var BBoxA = this.getBoundingClientRect();
        $(".boss").each(function() {
            var BBoxB = this.getBoundingClientRect();
            if (rectIntersect(BBoxA, BBoxB)) {
                $('#pontos').html('You win');
                $('.boss').attr('src', 'images/explosao.gif-c200').addClass("explodiu");
                setTimeout(function() {
                    $('.explodiu, .bala, .bossShoot, #nave').remove();
                }, 400);
            }
        });
    });
}