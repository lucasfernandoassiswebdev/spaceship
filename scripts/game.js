var vida = 100;
var y2;
$(document).ready(function() {
    //colocando a nave na tela
    $('#nave').append($('<img/>').attr({
        src: 'images/nave.png',
        style: 'width:50px;height:50px',
        class: 'naoSelecionavel'
    }));

    //colocando 6 asteróides de tamanhos e lugares aleatórios
    var pedras = 0;
    var interval = setInterval(function() {
        var size = Math.floor(Math.random() * 100) + 10;
        var marginl = Math.floor(Math.random() * $(window).width()) + 80;
        var margint = Math.floor(Math.random() * $(window).height()) + 1;

        $('body').append($('<img/>').attr({
            src: 'images/asteroide.png',
            style: 'width: ' + size + 'px; height: ' + size + 'px; left: ' + marginl + 'px; top: ' + margint + 'px; position: absolute',
            class: 'naoSelecionavel estrela'
        }));
        pedras++;
        if (pedras == 6) {
            clearInterval(interval);
        }
    }, 1500)
});

//fazendo a nave acompanhar o mouse
$(document).on("mousemove", function(evt) {
    $('#nave').css({ left: evt.pageX - 25, top: evt.pageY - 30 });
});

//fazendo a nave atirar quando o mouse clicar
$(document).bind('click', atira);

//a função atira faz nascer uma bala na ponta da nave
function atira() {
    var x = $('#nave')[0].getBoundingClientRect().left;
    var y = $('#nave')[0].getBoundingClientRect().top;

    $('body').append($('<img/>').attr({
        src: 'images/bala.png',
        //esses valores adicionados(+15 e -25) funcionam apenas para a nave virada para cima
        style: 'left: ' + (parseFloat(x) + 15) + 'px; top: ' + (parseFloat(y) - 25) + 'px; transform: rotate(' + parseFloat(graus) + 'deg)',
        class: 'naoSelecionavel bala'
    }));

    function movimentaBala(height) {
        $('.bala:eq(0)').attr('style', 'margin-top: ' + height + 'px; margin-left: ' + x + 'px)');
    }

    var intervalBala = setInterval(function() {
        y2 -= 20;
        movimentaBala(y2);
        if (y2 < 20) {
            clearInterval(intervalBala)
            $('.bala:eq(0)').remove();
        }
    }, 600);
}

//pegando a tecla pressionada e rodando a nave
var graus = 0,
    right, left, speed = 3;
window.onkeydown = function(e) {
    var key = e.keyCode ? e.keyCode : e.which;
    if (key == 68) //se a tecla d é pressionada a variável right vira true
        right = true;
    if (key == 65) //o mesmo vale para a tecla a e a variável left
        left = true;
}
window.onkeyup = function(e) {
    var key = e.keyCode ? e.keyCode : e.which;
    if (key == 68) //quando essas teclas são soltas elas voltam a ser undefined
        right = undefined;
    if (key == 65)
        left = undefined;
}

//interval que rotaciona a nave
setInterval(function() {
    if (!left && !right) //se as teclas a ou d não estão sendo pressionadas, o interpretador sai da funçã setInterval
        return;

    if (left) //se as teclas esquerda ou direita estão sendo pressionadas, mudamos a curvatura da nave
        graus -= speed;
    if (right)
        graus += speed;

    $('#nave').css('transform', 'rotate(' + graus + 'deg)'); //depois de mudar a curvatura mandamos escrever ela
}, 10);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function verificaBatida() {
    var nave = $("#nave");
    var asteroides = $(".estrela");

    var rangeIntersect = function(min0, max0, min1, max1) {
            return Math.max(min0, max0) >= Math.min(min1, max1) && Math.min(min0, max0) <= Math.max(min1, max1)
        }
        //Função para detectar se 2 BoundingClientRect's estão colidindo
    var rectIntersect = function(r0, r1) {
        return rangeIntersect(r0.left, r0.right, r1.left, r1.right) && rangeIntersect(r0.top, r0.bottom, r1.top, r1.bottom)
    }

    var BBoxA = nave[0].getBoundingClientRect();
    asteroides.each(function() {
        var BBoxB = this.getBoundingClientRect();
        if (rectIntersect(BBoxA, BBoxB)) {
            $('img:eq(0)').attr('src', 'images/explosao.gif-c200');
            var acm = 0;
            var intervalMorte = setInterval(function() {
                acm++;
                if (acm >= 40) {
                    $('img:eq(0)').remove();
                    clearInterval(intervalMorte);
                    window.location.href = "derrota.html";
                }
            }, 20);
            $('#pontos').html('Destruído');
        }
    });
}

intervalColisao = setInterval(verificaBatida, 200);