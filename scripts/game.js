//variáveis de controle do jogo
var vida = 100,
    x2 = 0,
    y2 = 0,
    pontos = 0,
    tempo = 3000,
    pedras = 0;

//variáveis para lidar com a rotação da nave
var graus = 0,
    right, left, speed = 3;


$(document).ready(function() {
    //colocando a nave na tela
    $('#nave').append($('<img/>').attr({
        src: 'images/nave.png',
        style: 'width:50px;height:50px',
        class: 'naoSelecionavel'
    }));
});

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
        style: 'width: ' + size + 'px; height: ' + size + 'px; left: ' + marginl + 'px; top: ' + margint + 'px; position: absolute',
        class: 'naoSelecionavel estrela'
    }));
    pedras++;
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
    //encontrando as coordenadas da nave
    x = $('#nave')[0].getBoundingClientRect().left;
    y = $('#nave')[0].getBoundingClientRect().top;

    $('body').append($('<img/>').attr({
        src: 'images/bala.png',
        style: 'left: ' + (parseFloat(x) + 15) + 'px; top: ' + (parseFloat(y) - 30) + 'px; transform: rotate(' + parseFloat(graus) + 'deg ); margin-bottom: 500px',
        class: 'naoSelecionavel bala'
    }));

    //logo após adicionar as balas, as balas são movimentadas
    function movimentaBala(width, height, i) {
        $('.bala:eq(' + i + ')').attr('style', 'top: ' + parseFloat(height) + 'px; left: ' + (parseFloat(width) + 8) + 'px;');
    }

    var ctrl = y;
    var width = x;
    var intervalBala = setInterval(function() {
        if (ctrl > -80) {
            ctrl--;
            for (var i = 0; i < $('.bala').length; i++) {
                movimentaBala(width, ctrl, i);
            }
        } else {
            $('.bala:eq(0)').remove();
            clearInterval(intervalBala);
        }
    }, 1);
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
            $('img:eq(0)').attr('src', 'images/explosao.gif-c200');
            $('.estrela').attr('src', 'images/explosao.gif-c200');
            var acm = 0;
            var intervalMorte = setInterval(function() {
                acm++;
                if (acm >= 40) {
                    //removemos a nave quando o gif termina de executar e redirecionamos para a tela de derrota
                    $('img:eq(0)').remove();
                    $('.estrela').remove();
                    clearInterval(intervalMorte);
                    window.location.href = "derrota.html";
                }
            }, 20);
            $('#pontos').html('Destruído');
        }
    });
}

function verificaBatidaTiro() {

    var bala = $(".bala");
    var asteroides = $(".estrela");

    var rangeIntersect = function(min0, max0, min1, max1) {
        return Math.max(min0, max0) >= Math.min(min1, max1) && Math.min(min0, max0) <= Math.max(min1, max1)
    }

    var rectIntersect = function(r0, r1) {
        return rangeIntersect(r0.left, r0.right, r1.left, r1.right) && rangeIntersect(r0.top, r0.bottom, r1.top, r1.bottom)
    }

    for (i = 0; i <= bala.length; i++) {
        var BBoxA = bala[i].getBoundingClientRect();
        for (i = 0; i <= asteroides.length; i++) {
            var BBoxB = asteroides[i].getBoundingClientRect();
            asteroides.each(function() {
                if (rectIntersect(BBoxA, BBoxB)) {
                    pontos++;
                    $('.estrela:eq(' + i + ')').attr('src', 'images/explosao.gif-c200');
                    var acm = 0;
                    var intervalMorteAsteroide = setInterval(function() {
                        acm++;
                        if (acm >= 40) {
                            $('estrela:eq(' + i + ')').remove();
                            clearInterval(intervalMorteAsteroide);
                        }
                    }, 10);
                    $('#pontos').html('Pontuação: ' + pontos);
                }
            });
        }
    }
}

intervalColisao = setInterval(verificaBatida, 200);
intervalColisaoTiros = setInterval(verificaBatidaTiro, 200);