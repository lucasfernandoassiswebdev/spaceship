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
function atira(e) {
    var coordenadas = [];

    var styleProps = $('#nave').css(["top", "left"]);
    $.each(styleProps, function(prop, value) {
        coordenadas.push(value);
    });

    var x = coordenadas[1].replace('px', '');
    var y = coordenadas[0].replace('px', '');

    $('body').append($('<img/>').attr({
        src: 'images/bala.png',
        //esses valores adicionados(+15 e -25) funcionam apenas para a nave virada para cima
        style: 'left: ' + (parseFloat(x) + 15) + 'px; top: ' + (parseFloat(y) - 25) + 'px; transform: rotate(' + (parseFloat(graus) + 270) + 'deg)',
        class: 'naoSelecionavel bala'
    }));

    function movimentaBala(height) {
        $('.bala').css('position: absolute; top : ' + height);
    }

    var height2 = coordenadas[1].replace("px", "");
    var height = parseFloat(height2);
    var intervalBala = setInterval(function() {
        height -= 20;
        movimentaBala(height);
        if (height < 20) {
            clearInterval(intervalBala)
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
    var coordenadasNave = [];
    var coordenadasAsteroide = [];

    var stylePropsA = $('#nave').css(["top", "left", "height", "width"]);
    $.each(stylePropsA, function(prop, value) {
        coordenadasNave.push(value);
        alert(prop + ' ' + value);
    });

    var stylePropsB = $('.estrela').css(["top", "left", "height", "width"]);
    $.each(stylePropsB, function(prop, value) {
        coordenadasAsteroide.push(value);
    });

    if ((coordenadasNave[0] + coordenadasNave[2]) < coordenadasAsteroide[0] ||
        coordenadasNave[0] > (coordenadasAsteroide[0] + coordenadasAsteroide[[2]]) ||
        (coordenadasNave[1] + coordenadasNave[3]) < coordenadasAsteroide[1] ||
        coordenadasNave[1] > (coordenadasNave[1] + coordenadasAsteroide[3])) {
        $('#pontos').html('bateu marreco');
    }
}

intervalColisao = setInterval(function() {
    verificaBatida();
}, 200);


function isCollide(a, b) {
    return !(
        ((a.y + a.height) < (b.y)) ||
        (a.y > (b.y + b.height)) ||
        ((a.x + a.width) < b.x) ||
        (a.x > (b.x + b.width))
    );
}