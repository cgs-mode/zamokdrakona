/**
 * Created by CGS-HOME on 24.04.14.
 */

var countUser = 1; // кол-во человек
var halls = 3; // кол-во залов

var menuItemName = "";
var glWidth = 0;
var glFlagItemsLoad = false;
var objZakaz = {
    items:[],
    summa:0
};

$(function(){

    initCalc();

    $("#btCalcShow").click(function(){
        showPanel();
    });

});

function initCalc(){

    glWidth = parseInt( $(".grid_13").css('width') );

    $(".menudetskoe").parent().after('<div class="calcpanel"></div>');
    $('.calcpanel').css('height',$(".primary_content_wrap").height()-40);
    $(".hystory").after('<input id="btCalcShow" type="reset" value="Расчитать онлайн"/><span style="clear:both"></span>');
    menuItemName = $(".hystory").text();
}

function showPanel(){

    if( $('.calcpanel').css('display') == 'none' ){
        $(".grid_13").animate({
            width: glWidth - 60 +"px"
        },function(){
            if (!glFlagItemsLoad) {
                $('.calcpanel').html( itemsMenu() );
                glFlagItemsLoad = true;

                $('.countPrice').bind('keypress', function(e){
                    if (e.keyCode == 0){
                        if (e.charCode < 48 || e.charCode > 57) return false;
                    };
                    setTimeout(function() { changePrice() }, 100)
                });

                $(".checkItem").change(function(){
                    if($(this).attr("checked")){
                        $(this).next().addClass('show');
                    }else{
                        $(this).next().removeClass('show');
                    }
                    changePrice();
                });

                $('.tips').poshytip({
                    className: 'tip-skyblue',
                    bgImageFrameSize: 9,
                    offsetX: 0,
                    offsetY: 20,
                    showTimeout: 100
                });

                $("#btPrint").click(function(){
                    printZakaz();
                });

                $("#btToMail").click(function(){
                    tomailZakaz();
                });

            }
            $(".calcpanel").fadeIn();
        });
    }else{
        $(".calcpanel").fadeOut(function(){
            $(".grid_13").animate({
                width: glWidth + "px"
            });
        });
    }
}

function itemsMenu(){

    var out = '';
    var delta = 0;
    var firstTr = false;

    $(".menudetskoe tr").each(function(){
        var img_tipsText = '';
        var objTD = $(this).find("td:eq(3)");
        var tipsText = $(objTD).attr('descritpion');
        var numberPrice = $(objTD).attr('numberPrice');
        var nameItems = $(this).find("td:eq(1)").text();
        var weightItems = $(this).find("td:eq(2)").text();
        if (!tipsText) tipsText = "";
        var price = parseInt($(objTD).text());
        if (!price) price = '';
        delta = $(this).height() - 2;

        if (!firstTr){
            out = out + '<div class="itemsMenu first" style="height:'+delta+'px"><div class="child">' +
                '<span class="txtCalc">Количество человек </span>' +
                '<input class="countUser" type="text" value="'+countUser+'" maxlength="3">' +
                '</div><div class="helper"></div></div>';
            firstTr = true;
        }else{

            if (price){
                var priceItemsCount = price * countUser;

                if (tipsText != '') {
                    img_tipsText = '<img class="tips" title="'+tipsText+'" src="css/2.gif" >';
                }else{
                    img_tipsText = '';
                }

                if (numberPrice != undefined)
                {
                    numberPrice = numberPrice*1;
                }else{
                    numberPrice = countUser;
                }

                var checked = '<input type="checkbox" class="checkItem" value="1">';
                var hideAdd = '<span class="hideAdd">' +
                    '<span><input class="countPrice" type="text" value="'+numberPrice+'" maxlength="3">' +
                    '<input type="hidden" hidden="hidden" value="'+priceItemsCount+'" >' +
                    '<input type="hidden" hidden="hidden" value="'+nameItems+'" >' +
                    '<input type="hidden" hidden="hidden" value="'+weightItems+'" >' +
                    '</span>' +
                    '<span>' + img_tipsText + '</span>' +
                    '<span>'+priceItemsCount+'</span>' +
                    '</span>';
            }else{
                var checked = '';
                var hideAdd = ''
            }

            out = out + '<div class="itemsMenu" style="height:'+delta+'px"><div class="child">' +
                checked +
                hideAdd +
                '</div><div class="helper"></div></div>';
        }
    });

    out = out + '<div class="itemsMenu summa"><div class="child">' +
        '<span>Итого: </span>' +
        '<span id="summa"></span>' +
        '</div><div class="helper"></div>' +
        '<div class="bottomButtons">' +
        '<input id="btToMail" type="reset" value="Отправить на email"/>' +
        '<input id="btPrint" type="reset" value="Распечатать"/>' +
        '</div>' +
        '</div>';

    return out;
}

function changePrice(){
    var price = 0;
    var name = '';
    var summa = 0;
    var weight = 0;

    objZakaz = {
        items:[],
        summa:0
    };

    $(".countPrice").each(function(){

        if ( $(this).parent().parent().prev().attr("checked") ){
            price = $(this).next().val();
            name = $(this).next().next().val();
            weight = $(this).next().next().next().val();
            $(this).parent().next().next().text( $(this).val() * price );
            summa = summa + $(this).val() * price;

            var objZakazItem = {
                name:'',
                weight:0,
                price:0,
                count:0
            };
            objZakazItem.name = name;
            objZakazItem.weight = weight;
            objZakazItem.price = price;
            objZakazItem.count = $(this).val();

            objZakaz.items.push(objZakazItem);

        }
    });
    $("#summa").text(summa);
    objZakaz.summa = summa;
}

function printZakaz(){
    $('#printDiv').remove();
    $('body').prepend('<div id="printDiv"></div>');
    $('#printDiv').append('<div class="titlePrint">Заказ (' + menuItemName + ')</div>');
    $('#printDiv').append('<div>Количество человек: ' + $('.countUser').val() + '</div>');
    $('#printDiv').append('<div>' +
        '<span>№</span>' +
        '<span>Название</span>' +
        '<span>Выход,гр</span>' +
        '<span>Цена за шт.</span>' +
        '<span>Кол-во,шт</span>' +
        '<span>Цена,руб</span>' +
        '</div>');

    for( var i in objZakaz.items ){
        var item = objZakaz.items[i];
        i++;
        $('#printDiv').append('<div>' +
            '<span>' + i + '</span>' +
            '<span>' + item.name + '</span>' +
            '<span>' + item.weight + '</span>' +
            '<span>' + item.price + '</span>' +
            '<span>' + item.count + '</span>' +
            '<span>' + (item.count*item.price) + '</span>' +
            '</div>');
    }

    $('#printDiv').append('<div class="summaPrint">Итого: '+ objZakaz.summa +' руб.</div>');

    $('#printDiv').printElement({pageTitle:'zakaz.html'});
    $('#printDiv').remove();

}

function tomailZakaz(){

    var htmlHall = '<select id="hall">';
    for(var i=1; i<=halls; i++){
        htmlHall += '<option value="'+i+'">'+i+'</option>';
    }
    htmlHall += '</select>';

    $('body').prepend('<div id="tomailForm"></div>');
    $('#tomailForm').append('<div>' +
        '<div>Дата и время проведения мероприятия:</div>' +
        '<div><input id="datatime" type="text" max="150" value=""></div>' +
        '</div>' +
        '<div>' +
        '<div>Зал:</div>' +
        '<div>' + htmlHall + '</div>' +
        '</div>' +
        '<div>' +
        '<div>ФИО:</div>' +
        '<div><input id="fio" type="text" max="150" value=""></div>' +
        '</div>' +
        '<div>' +
        '<div>Укажите свой email:</div>' +
        '<div><input id="email" type="email" max="150" value=""></div>' +
        '</div>' +
        '<div>' +
        '<div>Телефон:</div>' +
        '<div><input id="phone" type="text" max="150" value=""></div>' +
        '</div>' +
        '<div>' +
        '<div>Комментарий:</div>' +
        '<div><textarea id="comment" cols="3" maxlength="1000"></textarea></div>' +
        '</div>' +
        '<div class="bottom">' +
        '<span><input type="reset" id="tomailCancel" value="Отмена"></span>' +
        '<span><input type="reset" id="tomailSubmit" value="Отправить"></span>' +
        '</div>');

    $('#datatime').datetimepicker({
        mask:true, format:'d-m-Y H:i'
    });

    $('#tomailCancel').click(function(){
        $('#tomailForm').remove();
    });

    $('#tomailSubmit').click(function(){

        if ( $('#fio').val() == '' ){ $('#fio').addClass('error'); return false; }else{ $('#fio').removeClass('error'); }
        if ( $('#email').val() == '' ){ $('#email').addClass('error'); return false; }else{ $('#email').removeClass('error'); }

        $.ajax({
            type: "POST",
            url: "tomail.php",
            data: {
                menuItemName: menuItemName,
                countUser: $('.countUser').val(),
                datatime: $('#datatime').val(),
                hall: $('#hall').val(),
                phone: $('#phone').val(),
                fio: $('#fio').val(),
                email: $('#email').val(),
                comment: $('#comment').val(),
                objZakaz: JSON.stringify(objZakaz)
            },
            success: function(msg){
                $('#tomailForm').remove();
            },
            error: function(){
                $('#tomailForm').append('<div class="tomailError">Ошибка отправки.</div>');
            }
        });
    });

}