$(document).ready(function() {
    //colocando a nave na tela
    $('#nave').append($('<img/>').attr({
        src: 'images/nave.png',
        style: 'width:50px;height:50px',
        class: 'naoSelecionavel'
    }));

    //colocando 3 asteróides de tamanhos e lugares aleatórios
    for (i = 0; i < 7; i++) {
        var size = Math.floor(Math.random() * 100) + 10;
        var marginl = Math.floor(Math.random() * $(window).width()) + 80;
        var margint = Math.floor(Math.random() * $(window).height()) + 1;

        $('body').append($('<img/>').attr({
            src: 'images/asteroide.png',
            style: 'width: ' + size + 'px; height: ' + size + 'px; left: ' + marginl + 'px; top: ' + margint + 'px; position: absolute',
            class: 'naoSelecionavel'
        }));
    }
});

//fazendo a nave acompanhar o mouse
$(document).on("mousemove", function(evt) {
    $('#nave').css({ left: evt.pageX - 25, top: evt.pageY - 30 });
});

//fazendo a nave atirar quando o mouse clicar
$(document).bind('click', atira);

//a função atira faz nascer uma bala na ponta da nave
function atira(e) {
    var el = this;
    var coordenadas = el.getBoundingClientRect();

    console.log('posição x', coordenadas.left, 'posição y', coordenadas.top)
        //var x = $('#nave').getBoundingClientRect().left;
        //var y = $('#nave').getBoundingClientRect().right;

    //alert('posição x', coordenadas.left, 'posição y', coordenadas.top)

    //alert('x da nave em : ' + x + ' y da nave em: ' + y)
    /*
    $('body').append($('<img/>').attr({
        src: 'images/bala.png',
        style: 'position: absolute; width:20px; height:20px; margin-left: ' + x + ' margin-top: ' + y + '; ',
        class: 'naoSelecionavel movimenta' //classe movimenta usada para identificar as balas e aplicar o plugin que fará com que andem
    }));

    $('.movimenta').movimentaBala();*/
}

//de acordo com a tecla pressionada(A ou D) eu chamo o plugin que movimenta a nave
//passando os graus que ela deve rodar para a direita ou esquerda
var graus = 0;
window.onkeydown = function(e) {
    var key = e.keyCode ? e.keyCode : e.which;
    if (key == 65) {
        graus -= 20;
        $('#nave').movimentaElemento(graus);
    } else if (key == 68) {
        graus += 20;
        $('#nave').movimentaElemento(graus);
    }
}