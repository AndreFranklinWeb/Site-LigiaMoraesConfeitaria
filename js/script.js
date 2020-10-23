$(document).ready(function() {
    $('.col-sm-4').magnificPopup({
        delegate: 'a', // seletor de itens filho, clicando nele, o pop-up será aberto
        type: 'image',
        gallery:{enabled:true}
        // outras opções
      });
  });