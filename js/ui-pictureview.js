(function (root, factory, plug) {
    factory(root.jQuery, plug)
})(this, function ($, plug) {
    var _button = "<div class=\"ui-pictureview-button\"> " +
		"<button class=\"button\" data-pv-btype=\"prve\"><span>上一張</span></button>" +
		"<button class=\"button\" data-pv-btype=\"next\"><span>下一張</span></button>" +
        "<button class=\"button\" data-pv-btype=\"rotate\"><span>旋轉</span></button>" +
		"</div>"
    var _config = {
        _index: 0,
        _rotate: 0,
        _init: function () {
            var _that = this;
            var _$ul = this.find("ul");
            _$ul.removeClass().addClass("ui-pictureview-ul");
            var _$li = _$ul.find("li");
            _$li.each(function (i, o) {
                var _$this = $(o);
                if (_$this.attr("data-active") && _$this.attr("data-active") === "true") {
                    _that._index = i;
                }
            });
            _$li.removeAttr("data-active").eq(this._index).attr("data-active", "true");
            this.append(_button);
            var _$prve = this.find(".ui-pictureview-button button[data-pv-btype=\"prve\"]");
            var _$next = this.find(".ui-pictureview-button button[data-pv-btype=\"next\"]");
            if (this._index === 0) {
                _$prve.removeClass("button").addClass("buttonDisabled");
            }
            if (this._index === _$li.length - 1) {
                _$next.removeClass("button").addClass("buttonDisabled");
            }
        },
        _bindEvent: function () {
            var _that = this;
            var _$ul = this.find("ul");
            var _$li = _$ul.find("li");
            var _$prve = this.find(".ui-pictureview-button button[data-pv-btype=\"prve\"]");
            var _$next = this.find(".ui-pictureview-button button[data-pv-btype=\"next\"]");
            var _$rotate = this.find(".ui-pictureview-button button[data-pv-btype=\"rotate\"]");
            _$prve.on("click", function (e) {
                if (_that._index > 0) {
                    _that._index--;
                    _$li.removeAttr("data-active").eq(_that._index + 1)
                    _$li.eq(_that._index).attr("data-active", "true");
                    if (_that._index === 0) {
                        _$prve.removeClass("button").addClass("buttonDisabled");
                        _$next.removeClass("buttonDisabled").addClass("button");
                    } else {
                        _$prve.removeClass("buttonDisabled").addClass("button");
                    }
                }
                return false;
            });
            _$next.on("click", function (e) {
                if (_that._index < _$li.length - 1) {
                    _that._index++;
                    _$li.removeAttr("data-active").eq(_that._index - 1)
                    _$li.eq(_that._index).attr("data-active", "true");
                    if (_that._index === _$li.length - 1) {
                        _$next.removeClass("button").addClass("buttonDisabled");
                        _$prve.removeClass("buttonDisabled").addClass("button");
                    } else {
                        _$next.removeClass("buttonDisabled").addClass("button");
                    }
                }
                return false;
            });
            _$rotate.on("click", function () {
                _that._rotate += 90
                var _$li_show = _$ul.find("li").eq(_that._index).find("img");
                _$li_show.css("transform", "rotate(" + _that._rotate + "deg)");
                _$li_show.css("-ms-transform", "rotate(" + _that._rotate + "deg)");
                _$li_show.css("-webkit-transform:", "rotate(" + _that._rotate + "deg)");
                return false;
            });
        }
    }
    $.fn[plug] = function () {
        var _$this = $(this);
        _$this.each(function (i, o) {
            var _$o = $(o);
            $.extend(_$o, _config);
            _$o._init();
            _$o._bindEvent();
        });
    }
}, "pictureview");