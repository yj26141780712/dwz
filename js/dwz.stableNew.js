/**
 * @author Roger Wu v1.0
 * @author ZhangHuihua@msn.com 2011-4-1
 */
(function ($) {
    $.fn.fixedTable = function (options) {
        return this.each(function () {
            var $table = $(this), nowrapTD = $table.attr("nowrapTD");
            var $parent = $table.parent();
            var aStyles = [];

            var _widthTable = $table.width(); //表格自適應實際长度
            var _widthpageContent = $parent.width(); //表格容器长度

            var layoutH = $(this).attr("layoutH");
            var layoutStr = layoutH ? " layoutH='" + layoutH + "' fixedTable ='true' " : "";

            var layoutStrLeftNext = layoutH ? " layoutH='" + (parseInt(layoutH) + 22) + "' fixedTable ='true' " : "";
            var layoutStrRightNext = layoutH ? " layoutH='" + (parseInt(layoutH) + 22) + "' fixedTable ='false' " : "";

            var $divFixed = $("<div " + layoutStr + "></div>");

            var oldThs = $table.find("thead>tr:last-child").find("th");
            var oldThsFixed = $table.find("thead>tr:last-child").find("th[data-frozen='true']"); //固定列属性
            var oldThsNoFixed = $table.find("thead>tr:last-child").find("th[data-frozen!='true']"); //非固定列属性
            var oldTrs = $table.find("tbody>tr"); //非固定列属性

            var $tc = $table.parent().parent().addClass("j-resizeGrid"); // table parent container

            for (var i = 0, l = oldThs.size(); i < l; i++) {
                var $th = $(oldThs[i]);
                var style = [], width = $th.innerWidth() - (100 * $th.innerWidth() / _widthTable) - 2;
                style[0] = parseInt(width);
                style[1] = $th.attr("align");
                aStyles[aStyles.length] = style;
            }

            var theadLeft = $("<thead></thead>");
            var tbodyLeft = $("<tbody></tbody>");

            var theadRight = $("<thead></thead>");
            var tbodyRight = $("<tbody></tbody>");

            var trleft = $("<tr></tr>");
            var trRight = $("<tr></tr>");

            var leftWidth = 0;  //左表格容器宽度
            var rightWidth = 0; //右表格容器宽度

            //左表格
            $(oldThsFixed).each(function (index) {
                var $th = $(this);
                $th.html("<div class='gridCol' title='" + $th.text() + "'>" + $th.html() + "</div>");
                trleft.append($th);
            })
            $(">th", trleft).each(function (i) { //計算寬度并設置樣式
                var $th = $(this), style = aStyles[i];
                leftWidth += style[0];
                $th.addClass(style[1]).hoverClass("hover").removeAttr("align").removeAttr("width").width(style[0]);
            }).filter("[orderField]").orderBy({
                targetType: $table.attr("targetType"),
                rel: $table.attr("rel"),
                asc: $table.attr("asc") || "asc",
                desc: $table.attr("desc") || "desc"
            });
            //右表格
            $(oldThsNoFixed).each(function (index) {
                var $th = $(this);
                $th.html("<div class='gridCol' title='" + $th.text() + "'>" + $th.html() + "</div>");
                trRight.append($th);
            })
            $(">th", trRight).each(function (i) {
                var $th = $(this), style = aStyles[i + oldThsFixed.length];
                $th.addClass(style[1]).hoverClass("hover").removeAttr("align").removeAttr("width").width(style[0]);
            }).filter("[orderField]").orderBy({
                targetType: $table.attr("targetType"),
                rel: $table.attr("rel"),
                asc: $table.attr("asc") || "asc",
                desc: $table.attr("desc") || "desc"
            });
            rightWidth = _widthTable - leftWidth - 20;
            theadLeft.append(trleft);
            theadRight.append(trRight);

            //加載左右表格數據
            $(oldTrs).each(function () {
                var attrs = $(this)[0].attributes;
                var trleft = $("<tr></tr>");
                var trRight = $("<tr></tr>");
                for (var i =0;i<attrs.length;i++){
                    trleft.attr(attrs[i].name,attrs[i].value);
                    trRight.attr(attrs[i].name,attrs[i].value);
                }
                $("td", this).each(function (index) {
                    var $td = $(this);
                    $td.html("<div>" + $td.html() + "</div>");
                    if (index < oldThsFixed.length) {
                        trleft.append($td);
                    } else {
                        trRight.append($td);
                    }
                });
                tbodyLeft.append(trleft);
                tbodyRight.append(trRight);
            })

            //設置左右表格td寬度與th一致
            var ftrLeft = $(">tr:first-child", tbodyLeft);
            var ftrRight = $(">tr:first-child", tbodyRight);

            $(">td", ftrLeft).each(function (i) {  //设定左表格表身宽段
                if (i < oldThsFixed.length) $(this).width(aStyles[i][0]);
            });
            $(">td", ftrRight).each(function (i) {  //设定右表格表身宽度
                if (i < oldThsNoFixed.length) $(this).width(aStyles[i + oldThsFixed.length][0]);
            });

            //設置左右表格選中事件
            var $trsLeft = tbodyLeft.find('>tr');
            var $trsRight = tbodyRight.find('>tr');

            $trsLeft.hoverClass().each(function () {
                var $tr = $(this);
                var $ftds = $(">td", this);

                for (var i = 0; i < $ftds.size(); i++) {
                    var $ftd = $($ftds[i]);
                    if (nowrapTD != "false") $ftd.html("<div>" + $ftd.html() + "</div>");
                    if (i < aStyles.length) $ftd.addClass(aStyles[i][1]);
                }
                $tr.click(function () {
                    $trsLeft.filter(".selected").removeClass("selected");
                    $trsRight.filter(".selected").removeClass("selected");
                    $tr.addClass("selected");
                    //設置右邊選中
                    var rel = $tr.attr("rel");
                    var $trR=tbodyRight.find("tr[rel='" + rel + "']");
                    $trR.addClass("selected");
                    var sTarget = $tr.attr("target");
                    if (sTarget) {
                        if ($("#" + sTarget, $girdLeft).size() == 0) {
                            $girdLeft.prepend('<input id="' + sTarget + '" type="hidden" />');
                        }
                        $("#" + sTarget, $girdLeft).val($tr.attr("rel"));
                    }
                });
            });

            $trsRight.hoverClass().each(function () {
                var $tr = $(this);
                var $ftds = $(">td", this);

                for (var i = 0; i < $ftds.size(); i++) {
                    var $ftd = $($ftds[i]);
                    if (nowrapTD != "false") $ftd.html("<div>" + $ftd.html() + "</div>");
                    if (i < aStyles.length) $ftd.addClass(aStyles[i][1]);
                }
                $tr.click(function () {
                    $trsLeft.filter(".selected").removeClass("selected");
                    $trsRight.filter(".selected").removeClass("selected");
                    $tr.addClass("selected");
                    //設置右邊選中
                    var rel = $tr.attr("rel");
                    var $trL=tbodyLeft.find("tr[rel='" + rel + "']");
                    $trL.addClass("selected");
                    var sTarget = $tr.attr("target");
                    if (sTarget) {
                        if ($("#" + sTarget, $girdRight).size() == 0) {
                            $girdRight.prepend('<input id="' + sTarget + '" type="hidden" />');
                        }
                        $("#" + sTarget, $girdRight).val($tr.attr("rel"));
                    }
                });
            });

            //將新表格綁定并清除舊表格
            var $girdLeft = $("<div class='gridLeft'  style='width:" + leftWidth + "px'><div class='gridHeader'><div class='gridThead'><table style='width:" + leftWidth + "px'></table></div></div>" +
                "<div class='gridScroller' " + layoutStrLeftNext + "><div class='gridTbody'><table style='width:" + leftWidth + "px'></table></div></div></div>");
            var $girdRight = $("<div class='gridRight' style='left:" + leftWidth + "px;width:" + (_widthpageContent - leftWidth) + "px'><div class='gridHeader'><div class='gridThead'><table style='width:" + rightWidth + "px'></table></div></div>" +
                "<div class='gridScroller' " + layoutStrLeftNext + "><div class='gridTbody'><table style='width:" + rightWidth + "px'></table></div></div></div>");

            var tableheadleft = $girdLeft.find(".gridThead>table").append(theadLeft);
            var tablebodyleft = $girdLeft.find(".gridTbody>table").append(tbodyLeft);
            var tableheadRight = $girdRight.find(".gridThead>table").append(theadRight);
            var tablebodyRight = $girdRight.find(".gridTbody>table").append(tbodyRight);

            $divFixed.append($girdLeft);
            $divFixed.append($girdRight);

            $table.after($divFixed);// 添加新组件
            $table.remove();  //去除table

            //设置水平滚动条
            var scrollerLeft = $(".gridScroller", $girdLeft);
            var scrollerRight = $(".gridScroller", $girdRight);

            //设置垂直滚动条
            scrollerRight.scroll(function (event) {
                //水平滚动事件
                var headerRight = $(".gridThead", $girdRight);
                if (scrollerRight.scrollLeft() > 0) {
                    headerRight.css("position", "relative");
                    var scroll = scrollerRight.scrollLeft();
                    headerRight.css("left", scrollerRight.cssv("left") - scroll);
                }
                if (scrollerRight.scrollLeft() == 0) {
                    headerRight.css("position", "relative");
                    headerRight.css("left", "0px");
                }
                //垂直滚动时间
                if (scrollerRight.scrollTop() > 0) {
                    var scroll = scrollerRight.scrollTop();
                    scrollerLeft.scrollTop(scroll);
                }
                if (scrollerRight.scrollTop() <= 0) {
                    var scroll = scrollerRight.scrollTop();
                    scrollerLeft.scrollTop(0);
                }
                return false;
            });

            //設置標題拖動功能計算變量
            $girdRight.append("<div class='resizeMarker' style='height:300px; left:57px;display:none;'></div><div class='resizeProxy' style='height:300px; left:377px;display:none;'></div>");
            //設置標題拖動功能事件
            $(">tr", theadRight).each(function () {
                $(">th", this).each(function (i) {
                    var th = this, $th = $(this);
                    $th.mouseover(function (event) {
                        var offset = $.jTableTool.getOffset(th, event).offsetX;
                        //console.log(offset);
                        if ($th.outerWidth() - offset < 5) {
                            $th.css("cursor", "col-resize").mousedown(function (event) {
                                $(".resizeProxy", $girdRight).show().css({
                                    left: $.jTableTool.getRight(th) - $(".gridScroller", $girdRight).scrollLeft(),
                                    top: $.jTableTool.getTop(th),
                                    height: $.jTableTool.getHeight(th, $girdRight),
                                    cursor: "col-resize"
                                });
                                $(".resizeMarker", $girdRight).show().css({
                                    left: $.jTableTool.getLeft(th) + 1 - $(".gridScroller", $girdRight).scrollLeft(),
                                    top: $.jTableTool.getTop(th),
                                    height: $.jTableTool.getHeight(th, $girdRight)
                                });
                                $(".resizeProxy", $girdRight).jDrag($.extend(options, {
                                        scop: true, cellMinW: 20, relObj: $(".resizeMarker", $girdRight)[0],
                                        move: "horizontal",
                                        event: event,
                                        stop: function () {
                                            var pleft = $(".resizeProxy", $girdRight).position().left;
                                            var mleft = $(".resizeMarker", $girdRight).position().left;
                                            var move = pleft - mleft - $th.outerWidth() - 9;
                                            console.log(move);
                                            var cols = $.jTableTool.getColspan($th);
                                            var cellNum = $.jTableTool.getCellNum($th);
                                            var oldW = $th.width(), newW = $th.width() + move;
                                            var $dcell = $(">td", ftrRight).eq(cellNum - 1);

                                            $th.width(newW + "px");
                                            $dcell.width(newW + "px");

                                            var $table1 = $(theadRight).parent();
                                            $table1.width(($table1.width() - oldW + newW) + "px");
                                            var $table2 = $(tbodyRight).parent();
                                            $table2.width(($table2.width() - oldW + newW) + "px");

                                            $(".resizeMarker,.resizeProxy", $girdRight).hide();
                                        }
                                    })
                                );
                            });
                        } else {
                            $th.css("cursor", $th.attr("orderField") ? "pointer" : "default");
                            $th.unbind("mousedown");
                        }
                        return false;
                    });
                });
            });
        });
    };


    $.jTableTool = {
        getLeft: function (obj) {
            var width = 0;
            $(obj).prevAll().each(function () {
                width += $(this).outerWidth();
            });
            return width - 1;
        },
        getRight: function (obj) {
            var width = 0;
            $(obj).prevAll().andSelf().each(function () {
                width += $(this).outerWidth();
            });
            return width - 1;
        },
        getTop: function (obj) {
            var height = 0;
            $(obj).parent().prevAll().each(function () {
                height += $(this).outerHeight();
            });
            return height;
        },
        getHeight: function (obj, parent) {
            var height = 0;
            var head = $(obj).parent();
            head.nextAll().andSelf().each(function () {
                height += $(this).outerHeight();
            });
            $(".gridTbody", parent).children().each(function () {
                height += $(this).outerHeight();
            });
            return height;
        },
        getCellNum: function (obj) {
            return $(obj).prevAll().andSelf().size();
        },
        getColspan: function (obj) {
            return $(obj).attr("colspan") || 1;
        },
        getStart: function (obj) {
            var start = 1;
            $(obj).prevAll().each(function () {
                start += parseInt($(this).attr("colspan") || 1);
            });
            return start;
        },
        getPageCoord: function (element) {
            var coord = {x: 0, y: 0};
            while (element) {
                coord.x += element.offsetLeft;
                coord.y += element.offsetTop;
                element = element.offsetParent;
            }
            return coord;
        },
        getOffset: function (obj, evt) {
            if (/msie/.test(navigator.userAgent.toLowerCase())) {
                var objset = $(obj).offset();
                var evtset = {
                    offsetX: evt.pageX || evt.screenX,
                    offsetY: evt.pageY || evt.screenY
                };
                var offset = {
                    offsetX: evtset.offsetX - objset.left,
                    offsetY: evtset.offsetY - objset.top
                };
                return offset;
            }
            var target = evt.target;
            if (target.offsetLeft == undefined) {
                target = target.parentNode;
            }
            var pageCoord = $.jTableTool.getPageCoord(target);
            var eventCoord = {
                x: window.pageXOffset + evt.clientX,
                y: window.pageYOffset + evt.clientY
            };
            var offset = {
                offsetX: eventCoord.x - pageCoord.x,
                offsetY: eventCoord.y - pageCoord.y
            };
            return offset;
        }
    };
})(jQuery);

