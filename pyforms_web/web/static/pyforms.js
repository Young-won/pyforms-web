var $jscomp = $jscomp || {};
$jscomp.scope = {};
$jscomp.ASSUME_ES5 = !1;
$jscomp.ASSUME_NO_NATIVE_MAP = !1;
$jscomp.ASSUME_NO_NATIVE_SET = !1;
$jscomp.SIMPLE_FROUND_POLYFILL = !1;
$jscomp.objectCreate = $jscomp.ASSUME_ES5 || "function" == typeof Object.create ? Object.create : function (a) {
    var b = function () {};
    b.prototype = a;
    return new b
};
$jscomp.underscoreProtoCanBeSet = function () {
    var a = {
            a: !0
        },
        b = {};
    try {
        return b.__proto__ = a, b.a
    } catch (c) {}
    return !1
};
$jscomp.setPrototypeOf = "function" == typeof Object.setPrototypeOf ? Object.setPrototypeOf : $jscomp.underscoreProtoCanBeSet() ? function (a, b) {
    a.__proto__ = b;
    if (a.__proto__ !== b) throw new TypeError(a + " is not extensible");
    return a
} : null;
$jscomp.inherits = function (a, b) {
    a.prototype = $jscomp.objectCreate(b.prototype);
    a.prototype.constructor = a;
    if ($jscomp.setPrototypeOf) {
        var c = $jscomp.setPrototypeOf;
        c(a, b)
    } else
        for (c in b)
            if ("prototype" != c)
                if (Object.defineProperties) {
                    var d = Object.getOwnPropertyDescriptor(b, c);
                    d && Object.defineProperty(a, c, d)
                } else a[c] = b[c];
    a.superClass_ = b.prototype
};
var COLUMNS_CSS_CLASSES = " one two three four five six seven eight nine ten eleven twelve thirteen fourteen fiveteen sixteen seventeen eighteen nineteen twenty twentyone twentytwo".split(" "),
    ControlBase = function (a, b) {
        this.name = a;
        this.properties = b;
        this.basewidget = void 0;
        this.added_classes = [];
        this.added_fieldclasses = []
    };
ControlBase.prototype.app_id = function () {
    return this.basewidget.widget_id
};
ControlBase.prototype.control_id = function () {
    return this.basewidget.control_id(this.name)
};
ControlBase.prototype.jquery = function () {
    return $("#" + this.control_id())
};
ControlBase.prototype.place_id = function () {
    return "place-" + this.control_id()
};
ControlBase.prototype.jquery_place = function () {
    return $("#" + this.place_id())
};
ControlBase.prototype.set_css = function (a) {
    for (var b = 0; b < this.added_classes.length; b++) this.jquery().removeClass(this.added_classes[b]);
    a = a.split(" ");
    for (b = 0; b < a.length; b++) this.jquery().addClass(a[b]);
    this.added_classes = a
};
ControlBase.prototype.set_field_css = function (a) {
    for (var b = 0; b < this.added_fieldclasses.length; b++) this.jquery_place().removeClass(this.added_fieldclasses[b]);
    a = a.split(" ");
    for (b = 0; b < a.length; b++) this.jquery_place().addClass(a[b]);
    this.added_fieldclasses = a
};
ControlBase.prototype.get_value = function () {
    if (0 == this.jquery().length) return this.properties.value;
    var a = this.jquery().val();
    return "null" == a ? null : a
};
ControlBase.prototype.set_value = function (a) {
    0 < this.jquery().length && (null != this.properties.value ? this.jquery().val(this.properties.value) : this.jquery().val(""))
};
ControlBase.prototype.set_label = function (a) {
    $("#" + this.place_id() + " label").first().html(a)
};
ControlBase.prototype.enable = function () {
    this.jquery().removeAttr("disabled");
    this.jquery().removeClass("disabled")
};
ControlBase.prototype.disable = function () {
    this.jquery().attr("disabled", "true");
    this.jquery().addClass("disabled")
};
ControlBase.prototype.hide = function () {
    function a(a) {
        var b = 0;
        a.each(function (a, c) {
            "none" != $(c).css("display") && (b += 1)
        });
        return b
    }
    if (0 != a(this.jquery_place())) {
        this.jquery_place().hide();
        this.properties.visible = !1;
        var b = this.jquery_place().parent();
        if (b.hasClass("row") && b.hasClass("fields")) {
            if (!b.hasClass("no-alignment"))
                for (var c = COLUMNS_CSS_CLASSES.length; 1 < c; c--)
                    if (b.hasClass(COLUMNS_CSS_CLASSES[c])) {
                        b.removeClass(COLUMNS_CSS_CLASSES[c]);
                        b.addClass(COLUMNS_CSS_CLASSES[c - 1]);
                        break
                    } if (0 == a(b.find(".control")))
                for (b.hide(),
                    c = 0; c < COLUMNS_CSS_CLASSES.length - 1; c++) b.removeClass(COLUMNS_CSS_CLASSES[c])
        }
        b = this.jquery_place().parents(".pyforms-segment");
        0 == a(b.find(".control")) && b.hide()
    }
};
ControlBase.prototype.show = function () {
    if (!this.jquery_place().is(":visible")) {
        this.jquery_place().show();
        this.properties.visible = !0;
        var a = this.jquery_place().parent();
        if (a.hasClass("row"))
            if (a.hasClass("no-alignment")) a.show();
            else {
                a.hasClass("fields") && a.show();
                for (var b = !1, c = 1; c < COLUMNS_CSS_CLASSES.length - 1; c++)
                    if (a.hasClass(COLUMNS_CSS_CLASSES[c])) {
                        a.removeClass(COLUMNS_CSS_CLASSES[c]);
                        a.addClass(COLUMNS_CSS_CLASSES[c + 1]);
                        b = !0;
                        break
                    } b || (a.addClass("fields"), a.addClass("one"))
            }(a = this.jquery_place().parents(".pyforms-segment")) && a.show()
    }
};
ControlBase.prototype.deserialize = function (a) {
    var b = a.value != this.properties.value;
    $.extend(this.properties, a);
    b && this.set_value(this.properties.value);
    this.set_label(this.properties.label);
    this.properties.error ? this.jquery_place().addClass("error") : this.jquery_place().removeClass("error")
};
ControlBase.prototype.apply_deserialization = function (a) {
    this.properties.visible ? this.show() : this.hide();
    this.properties.enabled ? this.enable() : this.disable();
    this.properties.style && this.jquery().attr("style", this.properties.style);
    this.properties.field_style && this.jquery_place().attr("style", this.properties.field_style);
    this.properties.css && this.set_css(this.properties.css);
    this.properties.field_css && this.set_field_css(this.properties.field_css)
};
ControlBase.prototype.serialize = function () {
    this.properties.value = this.get_value();
    return this.properties
};
ControlBase.prototype.init_control = function () {
    this.properties.error ? this.jquery_place().addClass("error") : this.jquery_place().removeClass("error")
};
ControlBase.prototype.after_init_control = function () {
    this.properties.visible || this.hide();
    this.properties.enabled || this.disable();
    this.properties.style && this.jquery().attr("style", this.properties.style);
    this.properties.field_style && this.jquery_place().attr("style", this.properties.field_style);
    this.properties.css && this.set_css(this.properties.css);
    this.properties.field_css && this.set_field_css(this.properties.field_css)
};
ControlBase.prototype.update_server = function () {
    return this.get_value() != this.properties.value
};
var ControlAutoComplete = function (a) {
    ControlBase.apply(this, arguments)
};
$jscomp.inherits(ControlAutoComplete, ControlBase);
ControlAutoComplete.prototype.init_control = function () {
    var a = "<div id='" + this.place_id() + "' class='field control ControlAutoComplete' ><label>" + this.properties.label + "</label>";
    a += "<div class='ui search dropdown " + (this.properties.multiple ? "multiple" : "") + " selection' id='" + this.control_id() + "' >";
    a = a + '<i class="ui search small icon"></i>' + ('<div class="default text">' + this.properties.label + "</div>");
    a += "</div>";
    this.jquery_place().replaceWith(a);
    this.jquery().dropdown({
        apiSettings: {
            url: this.properties.items_url
        },
        saveRemoteData: !1,
        placeholder: !1,
        forceSelection: !1
    });
    this.jquery().dropdown("setup menu", {
        values: this.properties.items
    });
    this.set_value(this.properties.value);
    var b = this;
    this.jquery().dropdown("setting", "onChange", function () {
        b.flag_exec_on_change_event && b.basewidget.fire_event(b.name, "update_control_event")
    });
    this.properties.error ? this.jquery_place().addClass("error") : this.jquery_place().removeClass("error")
};
ControlAutoComplete.prototype.set_value = function (a) {
    this.flag_exec_on_change_event = !1;
    this.properties.multiple || (a = [a]);
    this.jquery().dropdown("set exactly", a);
    this.flag_exec_on_change_event = !0
};
ControlAutoComplete.prototype.get_value = function () {
    var a = this.jquery().dropdown("get value");
    return this.properties.multiple ? 0 == a.length ? [] : "" == a ? [] : a.split(",") : 0 == a.length ? null : "" == a ? null : a
};
ControlAutoComplete.prototype.deserialize = function (a) {
    this.properties = $.extend(this.properties, a);
    this.jquery().dropdown("setup menu", {
        values: this.properties.items
    });
    this.set_value(this.properties.value);
    this.properties.error ? this.jquery_place().addClass("error") : this.jquery_place().removeClass("error")
};
ControlAutoComplete.prototype.update_server = function () {
    var a = this.properties.value,
        b = this.get_value();
    if (this.properties.multiple) {
        a.sort();
        b.sort();
        if (b.length != a.length) return !0;
        for (var c = 0; c < b.length; c++)
            if (b[c] != a[c] + "") return !0;
        return !1
    }
    return b != a
};
var ControlText = function (a) {
    ControlBase.apply(this, arguments)
};
$jscomp.inherits(ControlText, ControlBase);
ControlText.prototype.init_control = function () {
    var a = "<div id='" + this.place_id() + "' class='field control ControlText' >";
    this.properties.label_visible && (a += "<label>" + this.properties.label + "</label>");
    a += "<input placeholder='" + this.properties.label + "' type='text' name='" + this.name + "' id='" + this.control_id() + "' value='' />";
    a += "</div>";
    this.jquery_place().replaceWith(a);
    this.set_value(this.properties.value);
    var b = this;
    this.jquery().change(function () {
        b.basewidget.fire_event(this.name, "update_control_event")
    });
    this.jquery().keypress(function (a) {
        13 == a.which && b.basewidget.fire_event(this.name, "on_enter_event")
    });
    this.properties.error ? this.jquery_place().addClass("error") : this.jquery_place().removeClass("error")
};
var ControlTextArea = function (a) {
    ControlBase.apply(this, arguments)
};
$jscomp.inherits(ControlTextArea, ControlBase);
ControlTextArea.prototype.init_control = function () {
    var a = "<div id='" + this.place_id() + "' class='field control ControlTextArea' ><label>" + this.properties.label + "</label><textarea placeholder='" + this.properties.label + "' type='text' name='" + this.name + "' id='" + this.control_id() + "' ></textarea></div>";
    this.jquery_place().replaceWith(a);
    this.set_value(this.properties.value);
    var b = this;
    this.jquery().change(function () {
        b.basewidget.fire_event(this.name, "update_control_event")
    });
    this.properties.error ? this.jquery_place().addClass("error") :
        this.jquery_place().removeClass("error")
};
var ControlBreadcrumb = function (a) {
    ControlBase.apply(this, arguments)
};
$jscomp.inherits(ControlBreadcrumb, ControlBase);
ControlBreadcrumb.prototype.init_control = function () {
    var a = "<div class='field control ControlBreadcrumb' id='" + this.place_id() + "' >";
    a += '<div class="ui breadcrumb">';
    if (this.properties.value)
        for (var b = 0; b < this.properties.value.length; b++) {
            var c = this.properties.value[b],
                d = c.label,
                e = c.action_param,
                f = c.link;
            c = c.active ? 'class="active section"' : 'class="section"';
            f || e ? (c += f ? "href='" + f + "'" : "action-param='" + e + "'", a += '<a class="section" ' + c + " >" + d + "</a>", a += '<i class="right angle icon divider"></i>') : a += "<div " +
                c + " >" + d + "</div>"
        }
    a += "</div></div>";
    this.jquery_place().replaceWith(a);
    var g = this;
    this.jquery().find("[action-param]").click(function () {
        var a = $(this).attr("action-param");
        g.properties.action_param = a;
        g.basewidget.fire_event(g.name, "pressed")
    })
};
ControlBreadcrumb.prototype.get_value = function () {
    return this.properties.value
};
ControlBreadcrumb.prototype.update_server = function () {
    return !1
};
var ControlButton = function (a) {
    ControlBase.apply(this, arguments)
};
$jscomp.inherits(ControlButton, ControlBase);
ControlButton.prototype.init_control = function () {
    var a = "<div class='field control ControlButton' id='" + this.place_id() + "'>";
    this.properties.label_visible && (a += "<label>&nbsp;</label>");
    a += this.properties.labeled ? "<div " : "<button type='button'";
    a += " title='" + this.properties.help + "' id='" + this.control_id() + "' class='ui button' >";
    a += this.properties.label;
    a += this.properties.labeled ? "</div>" : "</button>";
    a += "</div>";
    this.jquery_place().replaceWith(a);
    var b = this;
    this.jquery().click(function () {
        b.properties.value ?
            eval(b.properties.value) : b.basewidget.fire_event(b.name, "pressed")
    })
};
ControlButton.prototype.get_value = function () {
    return this.properties.value
};
ControlButton.prototype.update_server = function () {
    return !1
};
ControlButton.prototype.deserialize = function (a) {
    $.extend(this.properties, a);
    this.set_value(this.properties.value);
    this.jquery().html(this.properties.label);
    this.properties.error ? this.jquery_place().addClass("error") : this.jquery_place().removeClass("error")
};
var ControlBarsChart = function (a) {
    ControlBase.apply(this, arguments)
};
$jscomp.inherits(ControlBarsChart, ControlBase);
ControlBarsChart.prototype.init_control = function () {
    this.update_it = !1;
    var a = "<div id='" + this.place_id() + "' class='field control ControlBarsChart' >";
    a += "<div id='chart-container-" + this.control_id() + "' title='" + this.properties.help + "'   >";
    a += "<div id='" + this.control_id() + "' ></div>";
    a += "</div></div>";
    this.jquery_place().replaceWith(a);
    var b = this;
    a = b.properties.legend;
    var c = b.properties.value;
    if (0 == c.length || 0 == c[0].length) c = [
        [
            [0, 0]
        ]
    ];
    this.chart = $.jqplot(this.control_id(), c, {
        grid: {
            borderColor: "transparent",
            shadow: !1,
            drawBorder: !1,
            shadowColor: "transparent",
            background: "transparent"
        },
        title: b.label,
        seriesDefaults: {
            renderer: $.jqplot.BarRenderer,
            pointLabels: {
                show: !0
            }
        },
        legend: {
            show: 0 < a.length,
            labels: a,
            placement: "inside",
            location: "e"
        },
        axes: {
            xaxis: {
                renderer: $.jqplot.CategoryAxisRenderer,
                ticks: a
            }
        },
        cursor: {
            style: "pointer",
            show: !0,
            zoom: !0,
            tooltipOffset: 10,
            showTooltip: !0,
            followMouse: !0,
            showTooltipDataPosition: !0,
            showVerticalLine: !0
        }
    });
    b = this;
    this.jquery().bind("jqplotDataClick", function (a, c, f, g) {
        b.properties.selected_series =
            c;
        b.properties.selected_data = g;
        b.update_it = !0;
        b.basewidget.fire_event(b.name, "remote_data_selected_event")
    })
};
ControlBarsChart.prototype.set_value = function (a) {
    this.chart.replot({
        data: a,
        legend: {
            show: 0 < this.properties.legend.length,
            labels: this.properties.legend,
            showLabels: !0,
            showSwatch: !0
        }
    })
};
ControlBarsChart.prototype.get_value = function () {
    return this.properties.value
};
ControlBarsChart.prototype.update_server = function () {
    return this.get_value() != this.properties.value || this.update_it
};
ControlBarsChart.prototype.deserialize = function (a) {
    this.properties = $.extend(this.properties, a);
    this.set_value(this.properties.value)
};
ControlBarsChart.prototype.serialize = function () {
    this.properties.value = this.get_value();
    return this.properties
};

function add_file2control(a, b) {
    $("#dialog" + a).modal("hide");
    $("#" + a).val(b);
    var c = pyforms.split_id(a),
        d = c[1];
    pyforms.find_app(c[0]).fire_event(d, "update_control_event")
}
var ControlFile = function (a) {
    ControlBase.apply(this, arguments)
};
$jscomp.inherits(ControlFile, ControlBase);
ControlFile.prototype.init_control = function () {
    var a = this.properties.value ? this.properties.value : "",
        b = "<div class='field control ControlFile' id='" + this.place_id() + "' >";
    b += "<label>" + this.properties.label + "</label>";
    b += "<input type='text' class='filename' name='" + this.name + "' id='" + this.control_id() + "' value='" + a + "'  placeholder='" + this.properties.label + "' />";
    b += "</div>";
    this.jquery_place().replaceWith(b);
    var c = this;
    this.jquery().click(function () {
        c.basewidget.fire_event(c.name, "open_file_browser")
    });
    this.properties.error ? this.jquery_place().addClass("error") : this.jquery_place().removeClass("error")
};
var ControlFileUpload = function (a) {
    ControlBase.apply(this, arguments)
};
$jscomp.inherits(ControlFileUpload, ControlBase);
ControlFileUpload.prototype.init_control = function () {
    var a = "<div class='field control ControlFileUpload' id='" + this.place_id() + "' ><label>" + this.properties.label + "</label>";
    a += '<input type="file" name="' + this.name + '" id="' + this.control_id() + '" placeholder="' + this.properties.label + '" >';
    a += "</div>";
    this.jquery_place().replaceWith(a);
    var b = this;
    this.jquery().filer({
        uploadFile: {
            url: "/pyforms/upload-files/",
            data: {
                app_id: this.app_id(),
                control_id: this.name
            },
            type: "POST",
            enctype: "multipart/form-data",
            synchron: !1,
            beforeSend: function () {
                b.basewidget.loading()
            },
            success: function (a, d, e, f, g, k, h) {
                b.properties.new_value = a.metas[0].file;
                b.basewidget.fire_event(b.name, "update_control_event");
                b.basewidget.not_loading()
            },
            error: null,
            statusCode: null,
            onProgress: null,
            onComplete: null
        },
        showThumbs: !0,
        limit: 1,
        addMore: !0,
        allowDuplicates: !1,
        onRemove: function (a, d, e, f, g, k, h) {
            b.properties.new_value = "";
            b.basewidget.fire_event(b.name, "update_control_event")
        }
    });
    this.properties.file_data && this.jquery().prop("jFiler").append(this.properties.file_data);
    this.properties.error ? this.jquery_place().addClass("error") : this.jquery_place().removeClass("error")
};
ControlFileUpload.prototype.get_value = function () {
    return void 0 === this.properties.new_value ? this.properties.value : this.properties.new_value
};
ControlFileUpload.prototype.set_value = function (a) {
    a = this.jquery().prop("jFiler");
    a.reset();
    this.properties.file_data && a.append(this.properties.file_data)
};
ControlFileUpload.prototype.deserialize = function (a) {
    this.properties.file_data = void 0;
    this.properties.new_value = void 0;
    this.properties = $.extend(this.properties, a);
    this.set_value(this.properties.value);
    this.properties.error ? this.jquery_place().addClass("error") : this.jquery_place().removeClass("error")
};
var ControlDir = function (a) {
    ControlBase.apply(this, arguments)
};
$jscomp.inherits(ControlDir, ControlBase);
ControlDir.prototype.init_control = function () {
    var a = "<div class='field control ControlDir' id='" + this.place_id() + "' ><label>" + this.properties.label + "</label>";
    a += "<input type='text' class='filename' basewidget='" + this.basewidget.widget_id + "' name='" + this.name + "' id='" + this.control_id() + "' value='" + this.properties.value + "'  placeholder='" + this.properties.label + "' />";
    a += "<div class='ui modal' id='dialog" + this.control_id() + "' ><i class='close icon'></i><div class='header'>" + this.properties.label + "</div><div class='content' id='dialog-content-" +
        this.control_id() + "'  dom-id='" + this.control_id() + "' ></div></div>";
    this.jquery_place().replaceWith(a);
    var b = this;
    this.jquery().unbind("click");
    this.jquery().click(function () {
        var a = get_current_folder();
        $("#dialog-content-" + b.control_id()).load("/pyforms/filesbrowser/?filter-folders=true&p=" + a + "&control-id=" + b.control_id(), function () {
            $("#dialog" + b.control_id()).modal("show")
        })
    });
    this.properties.error ? this.jquery_place().addClass("error") : this.jquery_place().removeClass("error")
};
var ControlMultipleChecks = function (a) {
    ControlBase.apply(this, arguments)
};
$jscomp.inherits(ControlMultipleChecks, ControlBase);
ControlMultipleChecks.prototype.set_value = function (a) {
    this.flag_exec_on_change_event = !1;
    if (null == a || void 0 == a || 0 == a.length) $("#" + this.place_id() + " .ui.checkbox").checkbox("uncheck");
    else {
        for (var b = 0; b < this.properties.items.length; b++) {
            var c = this.properties.items[b],
                d = $("#" + this.place_id() + ' .ui.checkbox[value="' + c.value + '"]'); - 1 < a.indexOf(c.value) ? d.checkbox("set checked") : d.checkbox("set unchecked")
        }
        this.flag_exec_on_change_event = !0
    }
};
ControlMultipleChecks.prototype.get_value = function () {
    for (var a = [], b = 0; b < this.properties.items.length; b++) {
        var c = this.properties.items[b];
        $("#" + this.place_id() + ' .ui.checkbox[value="' + c.value + '"]').checkbox("is checked") && a.push(c.value)
    }
    return a
};
ControlMultipleChecks.prototype.init_control = function () {
    var a = "<div class='field control ControlMultipleChecks' id='" + this.place_id() + "' >";
    this.properties.label_visible && (a += "<label for='" + this.control_id() + "'>" + this.properties.label + "</label>");
    a += '<div class="ui grid">';
    for (var b = 0; b < this.properties.items.length; b++) {
        var c = this.properties.items[b];
        a += '<div class="five wide column">';
        a += '<div class="ui checkbox" value="' + c.value + '" >';
        a += '<input type="checkbox" value="' + c.value + '" name="' + this.properties.name +
            '">';
        a += "<label>" + c.text + "</label>";
        a += "</div>";
        a += "</div>"
    }
    a += "</div></div>";
    this.jquery_place().replaceWith(a);
    this.set_value(this.properties.value);
    this.flag_exec_on_change_event = !0;
    $("#" + this.place_id() + " .ui.checkbox").checkbox({
        onChange: function () {
            self.flag_exec_on_change_event && self.basewidget.fire_event(this.name, "update_control_event")
        }
    });
    this.properties.error ? this.jquery_place().addClass("error") : this.jquery_place().removeClass("error")
};
var ControlMultipleSelection = function (a) {
    ControlBase.apply(this, arguments)
};
$jscomp.inherits(ControlMultipleSelection, ControlBase);
ControlMultipleSelection.prototype.set_value = function (a) {
    this.flag_exec_on_change_event = !1;
    this.jquery().dropdown("set exactly", a);
    this.flag_exec_on_change_event = !0
};
ControlMultipleSelection.prototype.get_value = function () {
    var a = this.jquery().dropdown("get value");
    return 0 == a.length ? [] : a = a.split(",").sort()
};
ControlMultipleSelection.prototype.init_control = function () {
    var a = "<div class='field control ControlMultipleSelection' id='" + this.place_id() + "' >";
    this.properties.label_visible && (a += "<label for='" + this.control_id() + "'>" + this.properties.label + "</label>");
    switch (this.properties.mode) {
        case "scrolling":
            a += "<div class='ui dropdown multiple scrolling' id='" + this.control_id() + "'>";
            a += '<div class="default text">' + this.properties.label + "</div>";
            a += '<i class="dropdown icon"></i><div class="menu"></div></div>';
            break;
        default:
            a += "<div class='ui search dropdown multiple selection' id='" + this.control_id() + "'>";
            a = a + '<i class="dropdown icon"></i>' + ('<div class="default text">' + this.properties.label + "</div>");
            a += "</div>";
    }
    this.jquery_place().replaceWith(a);
    var b = this;
    this.jquery_place().replaceWith(a);
    this.jquery().dropdown({
        forceSelection: !1,
        allowReselection: !1,
        hideAdditions: !0
    });
    this.jquery().dropdown("setup menu", {
        values: this.properties.items
    });
    this.set_value(this.properties.value);
    this.jquery().dropdown("setting",
        "onChange",
        function () {
            b.properties.server_change = !b.flag_exec_on_change_event;
            b.flag_exec_on_change_event && b.basewidget.fire_event(b.name, "update_control_event");
        });
    this.properties.error ? this.jquery_place().addClass("error") : this.jquery_place().removeClass("error")
};
ControlMultipleSelection.prototype.deserialize = function (a) {
    var b = this.properties.value;
    this.properties = $.extend(this.properties, a);
    this.properties.update_items && this.jquery().dropdown("setup menu", {
        values: this.properties.items
    });
    null == this.properties.value ? this.set_value(null) : b.toString() != this.properties.value.toString() && this.set_value(this.properties.value);
    this.properties.error ? this.jquery_place().addClass("error") : this.jquery_place().removeClass("error")
};
var ControlSlider = function (a) {
    ControlBase.apply(this, arguments)
};
$jscomp.inherits(ControlSlider, ControlBase);
ControlSlider.prototype.get_value = function () {
    return this.jquery().val()
};
ControlSlider.prototype.set_value = function (a) {
    this.jquery().val(a);
    $("#value" + this.name).html(a);
    this.jquery().attr("max", this.properties.max);
    this.jquery().attr("min", this.properties.min)
};
ControlSlider.prototype.init_control = function () {
    var a = "<div id='" + this.place_id() + "' class='field control ControlSlider' title='" + this.properties.help + "' >";
    a += "<label>" + this.properties.label;
    a += " <div id='value" + this.control_id() + "' class='ui basic label'>" + this.properties.value + "</div>";
    a = a + "</label>" + ("<input style='width:100%;' type='range' name='" + this.name + "' value='" + this.properties.value + "' id='" + this.control_id() + "' min='" + this.properties.min + "' max='" + this.properties.max + "'>");
    a += "</div>";
    this.jquery_place().replaceWith(a);
    var b = this;
    this.jquery().change(function () {
        $("#value" + b.control_id()).html($(this).val());
        b.basewidget.fire_event(b.name, "update_control_event")
    })
};
ControlSlider.prototype.deserialize = function (a) {
    this.properties = $.extend(this.properties, a);
    this.set_value(this.properties.value)
};
ControlSlider.prototype.serialize = function () {
    this.properties.value = this.get_value();
    return this.properties
};
var ControlCheckBox = function (a) {
    ControlBase.apply(this, arguments)
};
$jscomp.inherits(ControlCheckBox, ControlBase);
ControlCheckBox.prototype.set_value = function (a) {
    a ? this.jquery().prop("checked", !0) : this.jquery().prop("checked", !1)
};
ControlCheckBox.prototype.get_value = function () {
    return 0 == this.jquery().length ? this.properties.value : this.jquery().is(":checked")
};
ControlCheckBox.prototype.init_control = function () {
    var a = "<div class='field control ControlCheckBox' id='" + this.place_id() + "' >";
    a = this.properties.label_visible ? a + "<div style='height: 31px' ></div>" : a + "<div style='height: 3px' ></div>";
    a += "<div class='ui toggle checkbox' title='" + this.properties.help + "' >";
    a += "<input name='" + this.name + "' id='" + this.control_id() + "' type='checkbox' value='true' class='hidden' />";
    a += "<label for='" + this.control_id() + "'>" + this.properties.label + "</label>";
    a += "</div></div>";
    this.jquery_place().replaceWith(a);
    this.properties.value ? this.jquery().prop("checked", !0) : this.jquery().prop("checked", !1);
    var b = this;
    this.jquery().click(function () {
        b.basewidget.fire_event(b.name, "update_control_event")
    });
    this.properties.visible || this.hide(void 0, !0);
    this.properties.error ? this.jquery_place().addClass("error") : this.jquery_place().removeClass("error")
};
var ControlCheckBoxList = function (a, b) {
    ControlBase.call(this, a, b);
    this.being_edited = !1
};
$jscomp.inherits(ControlCheckBoxList, ControlBase);
ControlCheckBoxList.prototype.init_control = function () {
    this.set_value(this.properties.value)
};
ControlCheckBoxList.prototype.get_value = function () {
    if (!this.properties.value) return [];
    var a = this.properties.value.slice(0);
    $("#" + this.control_id() + " tbody tr").each(function (b, c) {
        a[b][0] = $(this).find(".checkbox").checkbox("is checked")
    });
    return a
};
ControlCheckBoxList.prototype.set_value = function (a) {
    this.load_table()
};
ControlCheckBoxList.prototype.load_table = function () {
    var a = "<div id='" + this.place_id() + "' class='field control'>";
    this.properties.label_visible && (a += "<label>" + this.properties.label + "</label>");
    a += "<table class='ui selectable celled table " + this.properties.css + " ControlCheckBoxList' id='" + this.control_id() + "' >";
    a += "<thead><tr>";
    for (var b = this.properties.headers, c = 0; c < b.length; c++) a += "<th>" + b[c] + "</th>";
    a += "</tr></thead><tbody>";
    var d = this.properties.value;
    if (void 0 != d)
        for (c = 0; c < d.length; c++) {
            a += "<tr>";
            a += "<td class='collapsing' >";
            a += "<div class='ui fitted " + (d[c][0] ? "active" : "") + " checkbox'>";
            a += "<input type='checkbox' " + (d[c][0] ? "checked=''" : "") + " />";
            a += "<label></label></div>";
            a += "</td>";
            var e = d[c] ? d[c].length : 0;
            e = e > b.length ? b.length : e;
            for (var f = 1; f < e; f++) a += "<td>" + d[c][f] + "</td>";
            if (e < b.length)
                for (f = e; f < b.length; f++) a += "<td></td>";
            a += "</tr>"
        }
    a += "</tbody></table></div>";
    this.jquery_place().replaceWith(a);
    var g = this;
    $("#" + this.control_id() + " .checkbox").checkbox({
        onChange: function () {
            g.basewidget.fire_event(g.name,
                "update_control_event")
        }
    })
};
var ControlCheckBoxListQuery = function (a, b) {
    ControlCheckBoxList.call(this, a, b);
    this.being_edited = !1
};
$jscomp.inherits(ControlCheckBoxListQuery, ControlCheckBoxList);
ControlCheckBoxListQuery.prototype.init_control = function () {
    this.set_value(this.properties.value)
};
ControlCheckBoxListQuery.prototype.get_value = function () {
    if (!this.properties.value) return [];
    var a = this.properties.value.slice(0);
    $("#" + this.control_id() + " tbody tr").each(function (b, c) {
        a[b][0] = $(this).find(".checkbox").checkbox("is checked")
    });
    return a
};
ControlCheckBoxListQuery.prototype.set_value = function (a) {
    this.load_table()
};
ControlCheckBoxListQuery.prototype.load_table = function () {
    var a = "<div id='" + this.place_id() + "' class='field control'>";
    this.properties.label_visible && (a += "<label>" + this.properties.label + "</label>");
    a += "<table class='ui selectable celled table " + this.properties.css + " ControlCheckBoxList' id='" + this.control_id() + "' >";
    a += "<thead><tr><th></th>";
    for (var b = this.properties.headers, c = 0; c < b.length; c++) a += "<th>" + b[c] + "</th>";
    a += "</tr></thead><tbody>";
    var d = this.properties.value;
    b = b.length + 1;
    if (void 0 != d)
        for (c =
            0; c < d.length; c++) {
            a += "<tr>";
            a += "<td class='collapsing' >";
            a += "<div class='ui fitted " + (d[c][0] ? "active" : "") + " checkbox'>";
            a += "<input type='checkbox' " + (d[c][0] ? "checked=''" : "") + " />";
            a += "<label></label></div>";
            a += "</td>";
            var e = d[c] ? d[c].length : 0;
            e = e > b ? b : e;
            for (var f = 1; f < e; f++) a += "<td>" + d[c][f] + "</td>";
            if (e < b)
                for (f = e; f < b; f++) a += "<td></td>";
            a += "</tr>"
        }
    if (this.properties.remove_button || this.properties.add_button) a = a + "<tfoot><tr>" + ('<th colspan="' + b + '">'), this.properties.add_button && (a += '<div class="ui small button add-btn" >Add</div>'),
        this.properties.remove_button && (a += '<div class="ui small button remove-btn" >Remove</div>'), a += "</th></tr></tfoot>";
    a += "</tbody></table></div>";
    this.jquery_place().replaceWith(a);
    var g = this;
    $("#" + this.control_id() + " .checkbox").checkbox({
        onChange: function () {
            g.basewidget.fire_event(g.name, "update_control_event")
        }
    });
    this.properties.remove_button && $("#" + this.control_id() + " .remove-btn").click(function () {
        g.basewidget.fire_event(g.name, "remove_event")
    });
    this.properties.add_button && $("#" + this.control_id() +
        " .add-btn").click(function () {
        g.basewidget.fire_event(g.name, "add_event")
    })
};
var ControlTemplate = function (a) {
    ControlBase.apply(this, arguments)
};
$jscomp.inherits(ControlTemplate, ControlBase);
ControlTemplate.prototype.init_control = function () {
    var a = "<div id='" + this.place_id() + "' class='field control ControlTemplate' ><div id='" + this.control_id() + "' ></div></div>";
    this.jquery_place().replaceWith(a);
    this.set_value(this.properties.value)
};
ControlTemplate.prototype.set_value = function (a) {
    (a = Base64.decode(a)) ? (this.jquery().html(a), this.set_actions()) : this.jquery().html("")
};
ControlTemplate.prototype.set_actions = function () {
    this.properties.action_param = void 0;
    var a = this;
    this.jquery().find("[action]").click(function () {
        var b = $(this).attr("action"),
            c = $(this).attr("action-param");
        a.properties.action_param = c;
        a.basewidget.fire_event("self", b)
    })
};
ControlTemplate.prototype.update_server = function () {
    return void 0 != this.properties.action_param
};
var ControlCombo = function (a) {
    ControlBase.apply(this, arguments)
};
$jscomp.inherits(ControlCombo, ControlBase);
ControlCombo.prototype.init_control = function () {
    var a = "<div id='" + this.place_id() + "' class='field control ControlCombo' ><label>" + this.properties.label + "</label>";
    a += "<div class='ui search dropdown selection' id='" + this.control_id() + "' >";
    a = a + '<i class="dropdown icon"></i>' + ('<div class="default text">' + this.properties.label + "</div>");
    a += "</div>";
    var b = this;
    this.jquery_place().replaceWith(a);
    this.jquery().dropdown();
    this.jquery().dropdown("setup menu", {
        values: this.properties.items
    });
    this.set_value(this.properties.value);
    this.jquery().dropdown("setting", "onChange", function () {
        b.flag_exec_on_change_event && b.basewidget.fire_event(b.name, "update_control_event")
    });
    this.properties.error ? this.jquery_place().addClass("error") : this.jquery_place().removeClass("error")
};
ControlCombo.prototype.set_value = function (a) {
    this.flag_exec_on_change_event = !1;
    this.jquery().dropdown("set exactly", [a]);
    this.flag_exec_on_change_event = !0
};
ControlCombo.prototype.get_value = function () {
    var a = this.jquery().dropdown("get value");
    return 0 == a.length ? null : "true" == a ? !0 : "false" == a ? !1 : "null" == a ? null : a
};
ControlCombo.prototype.deserialize = function (a) {
    this.properties = $.extend(this.properties, a);
    this.jquery().dropdown("setup menu", {
        values: this.properties.items
    });
    this.set_value(this.properties.value);
    this.properties.error ? this.jquery_place().addClass("error") : this.jquery_place().removeClass("error")
};
var ControlInteger = function (a) {
    ControlBase.apply(this, arguments)
};
$jscomp.inherits(ControlInteger, ControlBase);
ControlInteger.prototype.init_control = function () {
    var a = "<div id='" + this.place_id() + "' class='field control ControlInteger' ><label>" + this.properties.label + "</label><input placeholder='" + this.properties.label + "' type='text' name='" + this.name + "' id='" + this.control_id() + "' /></div>";
    this.jquery_place().replaceWith(a);
    this.set_value(this.properties.value);
    var b = this;
    this.jquery().change(function () {
        b.basewidget.fire_event(this.name, "update_control_event")
    });
    this.properties.error ? this.jquery_place().addClass("error") :
        this.jquery_place().removeClass("error")
};
ControlInteger.prototype.get_value = function () {
    if (0 == this.jquery().length) return this.properties.value;
    var a = this.jquery().val();
    return "null" == a || "" == a ? null : a
};
var ControlFloat = function (a) {
    ControlBase.apply(this, arguments)
};
$jscomp.inherits(ControlFloat, ControlBase);
ControlFloat.prototype.init_control = function () {
    var a = "<div id='" + this.place_id() + "' class='field control ControlFloat' ><label>" + this.properties.label + "</label><input placeholder='" + this.properties.label + "' type='text' name='" + this.name + "' id='" + this.control_id() + "' /></div>";
    this.jquery_place().replaceWith(a);
    this.set_value(this.properties.value);
    var b = this;
    this.jquery().change(function () {
        b.basewidget.fire_event(this.name, "update_control_event")
    });
    this.properties.error ? this.jquery_place().addClass("error") :
        this.jquery_place().removeClass("error")
};
ControlFloat.prototype.get_value = function () {
    var a = this.jquery().val();
    return void 0 == a || null == a || "null" == a || 0 == a.length ? null : a
};
ControlFloat.prototype.set_value = function (a) {
    null != a ? this.jquery().val(a) : this.jquery().val("")
};
var ControlCalendar = function (a) {
    ControlBase.apply(this, arguments)
};
$jscomp.inherits(ControlCalendar, ControlBase);
ControlCalendar.prototype.init_control = function () {
    var a = "<div id='" + this.place_id() + "' class='field control ControlCalendar' ><label>" + this.properties.label + "</label>";
    a += this.create_calendar();
    a += "</div>";
    this.jquery_place().replaceWith(a);
    this.properties.error ? this.jquery_place().addClass("error") : this.jquery_place().removeClass("error")
};
ControlCalendar.prototype.create_calendar = function () {
    for (var a = new Date(this.properties.year, this.properties.month, 0), b = new Date, c = "<div class='ui seven column grid' id='" + this.control_id() + "' >", d = 0; d < a.getDay(); d++) c += "<div class='column'></div>";
    for (d = 1; d <= a.getDate(); d++) {
        c = a.getYear() == b.getYear() && a.getMonth() == b.getMonth() && d == b.getDate() ? c + ("<div class='column green'>" + d) : c + ("<div class='column'>" + d);
        if (this.properties.value && d in this.properties.value) {
            c += "<small>";
            for (var e = 0; e < this.properties.value[d].length; e++) c +=
                "</br>" + this.properties.value[d][e];
            c += "</small>"
        }
        c += "</div>"
    }
    return c + "</div>"
};
ControlCalendar.prototype.set_value = function (a) {
    a = this.create_calendar();
    $("#" + this.control_id()).replaceWith(a)
};
ControlCalendar.prototype.get_value = function () {
    return this.properties.value
};
var ControlPieChart = function (a) {
    ControlBase.apply(this, arguments)
};
$jscomp.inherits(ControlPieChart, ControlBase);
ControlPieChart.prototype.init_control = function () {
    var a = "<div id='" + this.place_id() + "' class='field control ControlPieChart' >";
    a += "<div id='chart-container-" + this.control_id() + "' title='" + this.properties.help + "'   >";
    a += "<div id='" + this.control_id() + "' ></div>";
    a += "</div></div>";
    this.jquery_place().replaceWith(a);
    (a = this.properties.value) && 0 != a.length || (a = [
        ["Empty", 0]
    ]);
    this.chart = a = jQuery.jqplot(this.control_id(), [a], {
        seriesDefaults: {
            renderer: jQuery.jqplot.PieRenderer,
            rendererOptions: {
                showDataLabels: !0
            }
        },
        legend: {
            show: !0,
            rendererOptions: {
                numberRows: a.length / 2
            },
            placement: "outside",
            location: "s"
        }
    });
    a.themeEngine.newTheme("simple", {
        seriesStyles: {
            shadow: !1,
            gridBorderWidth: 0,
            color: "white"
        },
        grid: {
            backgroundColor: "white",
            borderWidth: 0,
            gridLineColor: "white",
            gridLineWidth: 0,
            borderColor: "white",
            shadow: !1
        },
        legend: {
            background: "white",
            textColor: "#CCC",
            border: "0px solid white"
        }
    });
    a.activateTheme("simple")
};
ControlPieChart.prototype.set_value = function (a) {
    this.chart.replot({
        data: [a],
        legend: {
            show: !0,
            rendererOptions: {
                numberRows: a.length / 2
            },
            placement: "outside",
            location: "s"
        }
    })
};
ControlPieChart.prototype.get_value = function () {
    return this.properties.value
};
var ControlDate = function (a) {
    ControlBase.apply(this, arguments)
};
$jscomp.inherits(ControlDate, ControlBase);
ControlDate.prototype.get_value = function () {
    return this.jquery().datepicker("getDate")
};
ControlDate.prototype.pad = function (a, b) {
    for (var c = String(a); c.length < (b || 2);) c = "0" + c;
    return c
};
ControlDate.prototype.formatdate = function (a) {
    return a.getFullYear() + "-" + this.pad(a.getMonth() + 1, 2) + "-" + this.pad(a.getDate(), 2)
};
ControlDate.prototype.set_value = function (a) {
    null != a ? this.jquery().val(this.formatdate(new Date(a))) : this.jquery().val("")
};
ControlDate.prototype.init_control = function () {
    var a = "<div id='" + this.place_id() + "' class='field control ControlDate' ><label>" + this.properties.label + "</label><input placeholder='" + this.properties.label + "' type='text' name='" + this.name + "' id='" + this.control_id() + "' /></div>";
    this.jquery_place().replaceWith(a);
    this.set_value(this.properties.value);
    this.jquery().datepicker({
        dateFormat: "yy-mm-dd",
        changeMonth: !0,
        changeYear: !0,
        yearRange: "1900:3000"
    });
    this.set_value(this.properties.value);
    var b = this;
    this.jquery().change(function () {
        b.basewidget.fire_event(b.name,
            "update_control_event")
    });
    this.properties.error ? this.jquery_place().addClass("error") : this.jquery_place().removeClass("error")
};
var ControlDateTime = function (a) {
    ControlBase.apply(this, arguments)
};
$jscomp.inherits(ControlDateTime, ControlBase);
ControlDateTime.prototype.get_value = function () {
    return this.jquery().datetimepicker("getValue")
};
ControlDateTime.prototype.pad = function (a, b) {
    for (var c = String(a); c.length < (b || 2);) c = "0" + c;
    return c
};
ControlDateTime.prototype.formatdate = function (a) {
    return a.getFullYear() + "-" + this.pad(a.getMonth() + 1, 2) + "-" + this.pad(a.getDate(), 2) + " " + this.pad(a.getHours(), 2) + ":" + this.pad(a.getMinutes(), 2)
};
ControlDateTime.prototype.set_value = function (a) {
    null != a ? this.jquery().val(this.formatdate(new Date(a))) : this.jquery().val("")
};
ControlDateTime.prototype.init_control = function () {
    var a = "<div id='" + this.place_id() + "' class='field control ControlDateTime' ><label>" + this.properties.label + "</label><input placeholder='" + this.properties.label + "' type='text' name='" + this.name + "' id='" + this.control_id() + "' value='' /></div>";
    this.jquery_place().replaceWith(a);
    this.set_value(this.properties.value);
    this.jquery().datetimepicker({
        format: "Y-m-d H:i",
        formatTime: "H:i",
        formatDate: "Y-m-d"
    });
    var b = this;
    this.jquery().change(function () {
        b.basewidget.fire_event(b.name,
            "update_control_event")
    });
    this.properties.error ? this.jquery_place().addClass("error") : this.jquery_place().removeClass("error")
};
var ControlImage = function (a) {
    ControlBase.apply(this, arguments)
};
$jscomp.inherits(ControlImage, ControlBase);
ControlImage.prototype.get_value = function () {
    return this.jquery().attr("src")
};
ControlImage.prototype.set_value = function (a) {
    a.image && this.jquery().attr("src", "data:image/png;base64," + a.image);
    a = this.jquery().width();
    this.jquery().css("width", a + "px")
};
ControlImage.prototype.init_control = function () {
    var a = "<div id='" + this.place_id() + "' class='field control ControlImage' >";
    a += "<div class='ui card' id='card" + this.control_id() + "' >";
    a = a + "<div class='image'>" + ("<img style='width:100%;' class='image' src='' id='" + this.control_id() + "' />");
    a += "</div></div></div>";
    this.jquery_place().replaceWith(a)
};
var ControlImg = function (a) {
    ControlBase.apply(this, arguments)
};
$jscomp.inherits(ControlImg, ControlBase);
ControlImg.prototype.init_control = function () {
    var a = "<div id='" + this.place_id() + "' class='field control ControlImg' >";
    this.properties.label_visible && (a += "<label>" + this.properties.label + "</label>");
    a += "<span id='" + this.control_id() + "' ></span></div>";
    this.jquery_place().replaceWith(a);
    this.set_value(this.properties.value)
};
ControlImg.prototype.get_value = function () {
    return this.properties.value
};
ControlImg.prototype.set_value = function (a) {
    a = a ? '<img id="' + this.control_id() + '"" class="ui image ' + this.properties.css + '" src="' + a + '">' : "<span id='" + this.control_id() + "' ></span>";
    this.jquery().replaceWith(a)
};
var ControlHtml = function (a) {
    ControlBase.apply(this, arguments)
};
$jscomp.inherits(ControlHtml, ControlBase);
ControlHtml.prototype.init_control = function () {
    var a = "<div id='" + this.place_id() + "' class='field control ControlHtml' ><label>" + this.properties.label + "</label><div class='ui segment' id='" + this.control_id() + "' ></div></div>";
    this.jquery_place().replaceWith(a);
    this.properties.value ? this.jquery().html(this.properties.value) : this.jquery().html("")
};
ControlHtml.prototype.set_value = function (a) {
    this.properties.value ? this.jquery().html(this.properties.value) : this.jquery().html("")
};
var ControlEmail = function (a) {
    ControlBase.apply(this, arguments)
};
$jscomp.inherits(ControlEmail, ControlBase);
ControlEmail.prototype.init_control = function () {
    var a = "<div id='" + this.place_id() + "' class='field control ControlEmail' ><label>" + this.properties.label + "</label><input placeholder='" + this.properties.label + "' type='text' name='" + this.name + "' id='" + this.control_id() + "' value='' /></div>";
    this.jquery_place().replaceWith(a);
    this.properties.value ? this.jquery().val(this.properties.value) : this.jquery().val("");
    var b = this;
    this.jquery().change(function () {
        b.basewidget.fire_event(this.name, "update_control_event")
    });
    this.properties.error ? this.jquery_place().addClass("error") : this.jquery_place().removeClass("error")
};
var ControlItemsList = function (a, b) {
    ControlBase.call(this, a, b);
    this.being_edited = !1
};
$jscomp.inherits(ControlItemsList, ControlBase);
ControlItemsList.prototype.init_control = function () {
    var a = "<div id='" + this.place_id() + "' class='field control'>";
    a += '<div class="ui divided items ControlItemsList"  id="' + this.control_id() + '">';
    a += "</div></div>";
    this.jquery_place().replaceWith(a);
    this.set_value(this.properties.value)
};
ControlItemsList.prototype.get_value = function () {
    return this.properties.value
};
ControlItemsList.prototype.set_value = function (a) {
    html = "";
    for (var b = 0; b < a.length; b++) {
        html += '<div class="item">';
        a[b].img && (html += '<div class="image">', html += '<img src="' + a[b].img + '">', html += "</div>");
        html += '<div class="content">';
        a[b].title && (html += '<a class="header">' + a[b].title + "</a>");
        a[b].meta && (html += '<div class="meta">', html += "<span>" + a[b].meta + "</span>", html += "</div>");
        a[b].text && (html += '<div class="description">', html += "<p>" + a[b].text + "</p>", html += "</div>");
        if (a[b].tags || this.properties.select_btn_label) {
            html +=
                '<div class="extra">';
            this.properties.select_btn_label && (html += '<div row-number="' + b + '" class="ui right floated primary mini button">', html += this.properties.select_btn_label, html += "</div>");
            if (a[b].tags)
                for (var c = 0; c < a[b].tags.length; c++) html += '<div class="ui label">' + a[b].tags[c] + "</div>";
            html += "</div>"
        }
        html += "</div>";
        html += "</div>"
    }
    this.jquery().html(html);
    var d = this;
    this.jquery().find(".extra .button").click(function () {
        d.properties.selected_index = $(this).attr("row-number");
        d.basewidget.fire_event(d.name,
            "item_selection_changed_event")
    })
};
ControlItemsList.prototype.update_server = function () {
    return !0
};
var ControlList = function (a, b) {
    ControlBase.call(this, a, b);
    this.being_edited = !1
};
$jscomp.inherits(ControlList, ControlBase);
ControlList.prototype.init_control = function () {
    this.set_value(this.properties.value)
};
ControlList.prototype.get_value = function () {
    var a = [];
    $("#" + this.control_id() + " tbody tr").each(function (b, c) {
        var d = [];
        $(this).children("td").each(function (a, b) {
            d.push($(b).html())
        });
        a.push(d)
    });
    return a
};
ControlList.prototype.set_value = function (a) {
    this.load_table()
};
ControlList.prototype.load_table = function () {
    var a = "<div id='" + this.place_id() + "' class='field control'>";
    this.properties.label_visible && (a += "<label>&nbsp;</label>");
    a += "<div style='overflow-x: auto;' ><table class='ui selectable celled table " + this.properties.css + " ControlList' id='" + this.control_id() + "' >";
    a += "<thead><tr>";
    for (var b = this.properties.columns_align, c = this.properties.columns_size, d = this.properties.horizontal_headers, e = 0; e < d.length; e++) a += "<th style='" + (c ? "width:" + c[e] : "") + "; " + (b ? "text-align:" +
        b[e] : "") + "' >" + d[e] + "</th>";
    c = this.properties.value;
    a += "</tr></thead><tbody></div>";
    if (void 0 != c)
        for (e = 0; e < c.length; e++) {
            var f = this.properties.selected_index == e;
            a += "<tr>";
            var g = 0;
            c[e] && (g = c[e].length);
            for (var k = 0; k < g; k++) a += f ? "<td style='" + (b ? "text-align:" + b[k] : "") + "' class='active' >" + c[e][k] + "</td>" : "<td style='" + (b ? "text-align:" + b[k] : "") + "' >" + c[e][k] + "</td>";
            if (g < d.length)
                for (k = g; k < d.length; k++) a += f ? "<td class='active' ></td>" : "<td></td>";
            a += "</tr>"
        }
    a += "</tbody></table></div>";
    this.jquery_place().replaceWith(a);
    var h = this;
    this.properties.read_only ? $("#" + this.control_id() + " tbody td").dblclick(function () {
        h.basewidget.fire_event(h.name, "row_double_click_event")
    }) : $("#" + this.control_id() + " tbody td").dblclick(function () {
        if (h.being_edited) return !1;
        h.being_edited = !0;
        var a = $(this),
            b = a.html();
        a.html('<div class="ui input"><input type="text" value="' + b + '" /></div>');
        a.find("input").focus();
        a.find("input").focusout(function () {
            a.html($(this).val());
            h.being_edited = !1;
            h.basewidget.fire_event(h.name, "update_control_event")
        })
    });
    $("#" + this.control_id() + " tbody td").click(function () {
        $(this).hasClass("active") || ($("#" + h.control_id() + " tbody td").removeClass("active"), $("#" + h.control_id() + " tbody tr").removeClass("active"), h.properties.select_entire_row ? $(this).parent().find("td").addClass("active") : $(this).addClass("active"), h.properties.selected_index = $("#" + h.control_id() + " tbody tr").index($(this).parent()), h.basewidget.fire_event(h.name, "item_selection_changed_event"))
    });
    $("#" + this.control_id() + " thead th").click(function () {
        $("#" +
            h.control_id() + " tbody td").removeClass("active");
        $("#" + h.control_id() + " tbody tr").removeClass("active");
        h.properties.selected_index = -1;
        h.basewidget.fire_event(h.name, "item_selection_changed_event")
    })
};
var ControlLineChart = function (a) {
    ControlBase.apply(this, arguments)
};
$jscomp.inherits(ControlLineChart, ControlBase);
ControlLineChart.prototype.init_control = function () {
    this.update_it = !1;
    var a = "<div id='" + this.place_id() + "' class='field control ControlLineChart' >";
    a += "<div id='chart-container-" + this.control_id() + "' title='" + this.properties.help + "'   >";
    a += "<div id='" + this.control_id() + "' ></div>";
    a += "</div></div>";
    this.jquery_place().replaceWith(a);
    var b = this;
    a = b.properties.legend;
    var c = b.properties.value;
    if (0 == c.length || 0 == c[0].length) c = [
        [
            [0, 0]
        ]
    ];
    this.chart = $.jqplot(this.control_id(), c, {
        grid: {
            borderColor: "transparent",
            shadow: !1,
            drawBorder: !1,
            shadowColor: "transparent",
            background: "transparent"
        },
        title: b.label,
        seriesDefaults: {
            showMarker: !1,
            showLine: !0,
            lineWidth: 1,
            markerOptions: {
                size: 6
            }
        },
        legend: {
            show: 0 < a.length,
            labels: a,
            placement: "inside",
            location: "e"
        },
        axes: {},
        cursor: {
            style: "pointer",
            show: !0,
            zoom: !0,
            tooltipOffset: 10,
            showTooltip: !0,
            followMouse: !0,
            showTooltipDataPosition: !0,
            showVerticalLine: !0
        }
    });
    b = this;
    this.jquery().bind("jqplotDataClick", function (a, c, f, g) {
        b.properties.selected_series = c;
        b.properties.selected_data = g;
        b.update_it = !0;
        b.basewidget.fire_event(b.name, "remote_data_selected_event")
    })
};
ControlLineChart.prototype.set_value = function (a) {
    this.chart.replot({
        data: a,
        legend: {
            show: 0 < this.properties.legend.length,
            labels: this.properties.legend,
            showLabels: !0,
            showSwatch: !0
        }
    })
};
ControlLineChart.prototype.get_value = function () {
    return this.properties.value
};
ControlLineChart.prototype.update_server = function () {
    return this.get_value() != this.properties.value || this.update_it
};
ControlLineChart.prototype.deserialize = function (a) {
    this.properties = $.extend(this.properties, a);
    this.set_value(this.properties.value)
};
ControlLineChart.prototype.serialize = function () {
    this.properties.value = this.get_value();
    return this.properties
};
var ControlQueryCombo = function (a) {
    ControlBase.apply(this, arguments)
};
$jscomp.inherits(ControlQueryCombo, ControlBase);
ControlQueryCombo.prototype.init_control = function () {
    var a = "<div id='" + this.place_id() + "' class='field control ControlQueryCombo' ><label>" + this.properties.label + "</label>";
    a += "<select class='ui search dropdown' id='" + this.control_id() + "' ></select></div>";
    this.jquery_place().replaceWith(a);
    a = document.getElementById(this.control_id());
    var b;
    for (b = 0; b < this.properties.items.length; ++b) {
        var c = document.createElement("option");
        c.text = this.properties.items[b].label;
        c.value = this.properties.items[b].value;
        a.add(c)
    }
    var d = this;
    this.jquery().dropdown({
        onChange: function () {
            d.basewidget.fire_event(d.name, "update_control_event")
        }
    });
    this.set_value(this.properties.value);
    this.properties.error ? this.jquery_place().addClass("error") : this.jquery_place().removeClass("error")
};
ControlQueryCombo.prototype.set_value = function (a) {
    this.jquery().dropdown("set value", a)
};
ControlQueryCombo.prototype.get_value = function () {
    var a = this.jquery().dropdown("get value");
    return void 0 == a || 0 == a.length ? null : a
};
ControlQueryCombo.prototype.deserialize = function (a) {
    this.properties = $.extend(this.properties, a);
    this.set_value(this.properties.value);
    this.properties.error ? this.jquery_place().addClass("error") : this.jquery_place().removeClass("error")
};
var ControlQueryList = function (a) {
    ControlBase.apply(this, arguments)
};
$jscomp.inherits(ControlQueryList, ControlBase);
ControlQueryList.prototype.build_filters_html = function (a) {
    for (var b = "", c = 0; c < a.length; c += 4) {
        b += "<div class='fields four'>";
        for (var d = 0; 4 > d && !(c + d >= a.length); d++) {
            var e = a[c + d];
            switch (e.field_type) {
                case "combo":
                    b += "<div class='field'>";
                    b += "<label for='" + this.control_id() + "-filter-" + e.column + "'>" + e.label + "</label>";
                    b += "<select class='ui search dropdown queryset-filter' column='" + e.column + "' id='" + this.control_id() + "-filter-" + e.column + "' >";
                    b += "<option value='000000000000'>---</label>";
                    e = e.items;
                    for (var f =
                            0; f < e.length; f++) b += "<option filter='" + e[f][0] + "' value='" + e[f][0] + "'>" + e[f][1] + "</label>";
                    b += "</select>";
                    b += "</div>";
                    break;
                case "date-range":
                    b += "<div class='field date-filter' id='" + this.control_id() + "-filter-" + e.column + "' >", b += "<label>" + e.label + "</label>", b += '\n                            <div class="ui basic button choose"><i class="icon calendar"></i>Choose range <span></span></div>\n                            <div class=\'circular ui button icon basic mini clear\' col=\'' + e.column + '\' style=\'display:none\' ><i class="remove icon"></i></div>\n                            <div class="ui flowing popup bottom left transition hidden">\n                              <div class="ui three column center aligned grid">\n                                <div class="column">\n                                    <div class="ui icon input" style=\'width:150px;\' >\n                                        <input type="text" name="begin" class="begin" placeholder="Start date">\n                                        <i class="calendar icon"></i>\n                                    </div>\n                                </div>\n                                <div class="column">\n                                    <div class="ui icon input" style=\'width:150px;\' >\n                                        <input type="text" name="end" class="end" placeholder="End date">\n                                        <i class="calendar icon"></i>\n                                    </div>\n                                </div>\n                                <div class="column" style=\'width:140px;\' >\n                                  <div class=\'ui button blue apply\' col=\'' +
                        e.column + '\' ><i class="filter icon"></i>Apply</div>\n                                </div>\n                              </div>\n                            </div>\n                        ', b += "</div>"
            }
        }
        b += "</div>"
    }
    return b
};
ControlQueryList.prototype.init_date_filters_events = function (a) {
    for (var b = this, c = 0; c < a.length; c++) {
        var d = a[c];
        "date-range" == d.field_type && ($("#" + this.control_id() + "-filter-" + d.column + " .button.choose").popup({
            on: "click",
            popup: "#" + this.control_id() + "-filter-" + d.column + " .popup"
        }), $("#" + this.control_id() + "-filter-" + d.column + " input").datepicker({
            dateFormat: "yy-mm-dd",
            changeMonth: !0,
            changeYear: !0,
            yearRange: "1900:3000"
        }), $("#" + this.control_id() + "-filter-" + d.column + " .button.apply").click(function () {
            var a =
                $(this).attr("col"),
                c = $("#" + b.control_id() + "-filter-" + a + " .button.choose");
            c.popup("hide");
            var d = $("#" + b.control_id() + "-filter-" + a + " .begin").val(),
                k = $("#" + b.control_id() + "-filter-" + a + " .end").val(),
                h = "";
            d || k ? (h = h + (d ? "[" + d + ";" : "[;") + (k ? k + "]" : "]"), $("#" + b.control_id() + "-filter-" + a + " .button.clear").show()) : $("#" + b.control_id() + "-filter-" + a + " .button.clear").hide();
            c.children("span").html(h);
            b.collect_filters_values();
            b.basewidget.fire_event(b.name, "filter_changed_event")
        }), $("#" + this.control_id() +
            "-filter-" + d.column + " .button.clear").click(function () {
            var a = $(this).attr("col");
            $("#" + b.control_id() + "-filter-" + a + " .begin").val("");
            $("#" + b.control_id() + "-filter-" + a + " .end").val("");
            $("#" + b.control_id() + "-filter-" + a + " .button.choose span").html("");
            $(this).hide();
            b.collect_filters_values();
            b.basewidget.fire_event(b.name, "filter_changed_event")
        }))
    }
};
ControlQueryList.prototype.collect_filters_values = function () {
    var a = this.properties.filters_list;
    this.properties.filter_by = [];
    for (var b = 0; b < a.length; b++) {
        var c = a[b];
        switch (c.field_type) {
            case "combo":
                var d = $("#" + this.control_id() + "-filter-" + c.column).dropdown("get value");
                break;
            case "date-range":
                var e = $("#" + this.control_id() + "-filter-" + c.column + " .begin").val(),
                    f = $("#" + this.control_id() + "-filter-" + c.column + " .end").val();
                d = e ? c.column + "__gte=" + e : "";
                d += e && f ? "&" : "";
                d += f ? c.column + "__lte=" + f : ""
        }
        if ("" != d &&
            "000000000000" != d)
            for (e = d.split("&"), f = 0; f < e.length; f++) {
                d = e[f].split("=", 2);
                c = d[0];
                d = d[1];
                "true" == d && (d = !0);
                "null" == d && (d = null);
                "false" == d && (d = !1);
                var g = {};
                c = (g[c] = d, g);
                this.properties.filter_by.push(c)
            }
    }
};
ControlQueryList.prototype.init_control = function () {
    var a = "<div id='" + this.place_id() + "' class='field control ControlQueryList'>",
        b = this.properties.filters_list;
    void 0 != this.properties.search_field_key && (a = a + "<div class='field'>" + ("<input placeholder='Search by' type='text' name='search_key' id='" + this.control_id() + "-search' />"), a += "</div>");
    b && 0 < b.length && (a += this.build_filters_html(b));
    a += "<div style='overflow-x: auto;' ><table class='ui selectable celled striped table ControlQueryList " + this.properties.css +
        " sortable' id='" + this.control_id() + "' >";
    var c = this.properties.columns_align,
        d = this.properties.columns_size,
        e = this.properties.horizontal_headers;
    if (e && 0 < e.length) {
        a += "<thead><tr>";
        for (var f = 0; f < e.length; f++) a += "<th style='" + (d ? "width:" + d[f] : "") + "; " + (c ? "text-align:" + c[f] : "") + "' column='" + e[f].column + "' >" + e[f].label + "</th>";
        a += "</tr></thead>"
    }
    a += "<tbody></tbody></table></div></div>";
    this.jquery_place().replaceWith(a);
    this.set_value(this.properties.value);
    var g = this;
    b && 0 < b.length && this.init_date_filters_events(b);
    void 0 != this.properties.search_field_key && $("#" + this.control_id() + "-search").keypress(function (a) {
        if ("13" == (a.keyCode ? a.keyCode : a.which)) return g.properties.search_field_key = $(this).val(), g.basewidget.fire_event(g.name, "filter_changed_event"), !1
    });
    $("#" + this.place_id() + " .queryset-filter").dropdown({
        onChange: function (a, b, c) {
            g.collect_filters_values();
            g.basewidget.fire_event(g.name, "filter_changed_event")
        },
        fullTextSearch: "exact",
        match: "text"
    });
    g = this;
    $("#" + this.control_id() + " thead th").click(function () {
        $("#" +
            g.control_id() + " tbody td").removeClass("active");
        $("#" + g.control_id() + " tbody tr").removeClass("active");
        g.properties.selected_index = -1;
        $(this).hasClass("ascending") ? ($(this).removeClass("ascending"), $(this).addClass("descending")) : $(this).hasClass("descending") ? ($(this).removeClass("sorted"), $(this).removeClass("descending")) : ($(this).addClass("sorted"), $(this).addClass("ascending"));
        g.properties.sort_by = [];
        $("#" + g.control_id() + " thead th").each(function (a) {
            if ($(this).hasClass("ascending") || $(this).hasClass("descending")) a = {
                column: $(this).attr("column"),
                desc: $(this).hasClass("descending")
            }, g.properties.sort_by.push(a)
        });
        g.basewidget.fire_event(g.name, "sort_changed_event")
    })
};
ControlQueryList.prototype.get_value = function () {};
ControlQueryList.prototype.set_value = function (a) {
    var b;
    null == this.properties.search_field_key ? $("#" + this.place_id() + "-search").val("") : $("#" + this.place_id() + "-search").val(this.properties.search_field_key);
    var c = "",
        d = this.properties.columns_align;
    for (b = 0; b < a.length; b++) {
        var e = this.properties.selected_row_id == a[b][0];
        c += "<tr row-id='" + a[b][0] + "' >";
        for (var f = 1; f < a[b].length; f++) c += "<td style='" + (d ? "text-align:" + d[f - 1] : "") + "' class='" + (e ? "active" : "") + "' >" + (a[b][f] ? a[b][f] : "") + "</td>";
        c += "</tr>"
    }
    $("#" +
        this.control_id() + " tbody").html(c);
    $("#" + this.control_id() + " tfoot").remove();
    b = this.properties.horizontal_headers;
    a = "";
    c = this.properties.pages.pages_list;
    if (1 < c.length) {
        a = a + "<tfoot><tr>" + ('<th colspan="' + (b ? b.length : 1) + '">');
        a += '<a class="ui pointing basic label">' + this.properties.values_total + " results</a> ";
        this.properties.export_csv && (a += '<a class="ui button mini basic export-csv-btn "> <i class="ui icon cloud download"></i> CSV</a> ');
        a += '<div class="ui right floated pagination menu tiny">';
        0 < c[0] && (a += '<a class="icon item" pageindex="' + c[0] + '" ><i class="left chevron icon"></i></a>');
        for (b = 1; b < c.length - 1; b++) a += '<a pageindex="' + c[b] + '" class="item ' + (c[b] == this.properties.pages.current_page ? "active" : "") + '">' + c[b] + "</a>";
        0 < c[c.length - 1] && (a += '<a pageindex="' + c[c.length - 1] + '" class="icon item"><i class="right chevron icon"></i></a>');
        a += "</div></th></tr></tfoot>";
        $("#" + this.control_id() + " tbody ").after(a)
    }
    this.set_click_events()
};
ControlQueryList.prototype.set_label = function (a) {};
ControlQueryList.prototype.set_click_events = function () {
    var a = this;
    $("#" + this.control_id() + " tbody td").click(function () {
        $(this).hasClass("active") || (a.properties.selected_row_id = $(this).parent().attr("row-id"), a.basewidget.fire_event(a.name, "item_selection_changed_client_event"))
    });
    $("#" + this.control_id() + " .pagination .item").click(function () {
        $(this).hasClass("active") || (a.properties.pages.current_page = $(this).attr("pageindex"), a.basewidget.fire_event(a.name, "page_changed_event"))
    });
    $("#" + this.control_id() +
        " .export-csv-btn").click(function () {
        a.basewidget.fire_event(a.name, "export_csv_event")
    })
};
var ControlFeed = function (a) {
    ControlBase.apply(this, arguments)
};
$jscomp.inherits(ControlFeed, ControlBase);
ControlFeed.prototype.init_control = function () {
    var a = "<div id='" + this.place_id() + "' class='field control'>";
    a += '<div class="ui ' + this.properties.mode + ' ControlFeed"  id="' + this.control_id() + '">';
    a += "</div></div>";
    this.jquery_place().replaceWith(a);
    this.set_value(this.properties.value);
    void 0 != this.properties.value && 0 != this.properties.value.length || this.jquery().html(this.properties.empty_message)
};
ControlFeed.prototype.get_value = function () {
    return this.properties.value
};
ControlFeed.prototype.set_value = function (a) {
    if (0 != a.length) {
        var b;
        for (b = 0; b < a.length; b++) {
            var c = this.jquery().find('[pk="' + a[b].pk + '"]'),
                d = $(a[b].html);
            d.attr("pk", a[b].pk);
            0 < c.length ? c.replaceWith(d) : this.jquery().append(d);
            this.set_actions(d)
        }
        this.jquery().find('[action="load_more"]').remove();
        this.properties.has_more && (d = $('<div class="fluid ui button" action="load_more" action-param="' + a[a.length - 1].pk + '" >More</div>'), this.jquery().append(d), this.set_actions(d))
    }
};
ControlFeed.prototype.set_actions = function (a) {
    this.properties.action_param = void 0;
    var b = this;
    a.find("[action]").click(function () {
        var a = $(this).attr("action"),
            d = $(this).attr("action-param");
        b.properties.action_param = d;
        b.basewidget.fire_event("self", a)
    });
    a.attr("action") && a.click(function () {
        var c = a.attr("action"),
            d = a.attr("action-param");
        b.properties.action_param = d;
        b.basewidget.fire_event("self", c)
    })
};
ControlFeed.prototype.deserialize = function (a) {
    $.extend(this.properties, a);
    this.properties.clear && this.jquery().empty();
    this.set_value(this.properties.value);
    this.properties.error ? this.jquery_place().addClass("error") : this.jquery_place().removeClass("error")
};
ControlFeed.prototype.update_server = function () {
    return void 0 != this.properties.action_param
};
var ControlQueryCards = function (a) {
    ControlBase.apply(this, arguments)
};
$jscomp.inherits(ControlQueryCards, ControlBase);
ControlQueryCards.prototype.init_control = function () {
    var a = "<div id='" + this.place_id() + "' class='field control'>",
        b = this.properties.filters_list;
    if (0 < b.length) {
        a += "<div class='fields'>";
        for (var c = 0; c < b.length; c++) {
            a += "<div class='field'>";
            a += "<label for='" + this.control_id() + "-filter-" + b[c].column + "'>" + b[c].label + "</label>";
            a += "<select class='ui search dropdown queryset-filter' column='" + b[c].column + "' id='" + this.control_id() + "-filter-" + b[c].column + "' >";
            a += "<option value='000000000000'>--- None ---</label>";
            for (var d = b[c].items, e = 0; e < d.length; e++) a += "<option value='" + d[e] + "'>" + d[e] + "</label>";
            a += "</select>";
            a += "</div>"
        }
        a += "</div>"
    }
    a += "<div class='ui link cards' id='" + this.control_id() + "' ></div>";
    this.jquery_place().replaceWith(a);
    this.set_value(this.properties.value);
    var f = this;
    $("#" + this.place_id() + " .queryset-filter").dropdown({
        onChange: function () {
            f.properties.filter_by = [];
            $("#" + f.place_id() + " .queryset-filter").each(function () {
                var a = $(this).dropdown("get value");
                if ("" != a && "000000000000" != a) {
                    var b =
                        $(this).find("select").attr("column"),
                        c = {};
                    a = (c[b] = a, c);
                    f.properties.filter_by.push(a)
                }
            });
            f.basewidget.fire_event(f.name, "filter_changed_event")
        }
    });
    f = this;
    $("#" + this.control_id() + " thead th").click(function () {
        $("#" + f.control_id() + " tbody td").removeClass("active");
        $("#" + f.control_id() + " tbody tr").removeClass("active");
        f.properties.selected_index = -1;
        $(this).hasClass("ascending") ? ($(this).removeClass("ascending"), $(this).addClass("descending")) : $(this).hasClass("descending") ? ($(this).removeClass("sorted"),
            $(this).removeClass("descending")) : ($(this).addClass("sorted"), $(this).addClass("ascending"));
        f.properties.sort_by = [];
        $("#" + f.control_id() + " thead th").each(function (a) {
            if ($(this).hasClass("ascending") || $(this).hasClass("descending")) a = {
                column: $(this).attr("column"),
                desc: $(this).hasClass("descending")
            }, f.properties.sort_by.push(a)
        });
        f.basewidget.fire_event(f.name, "sort_changed_event")
    })
};
ControlQueryCards.prototype.get_value = function () {};
ControlQueryCards.prototype.set_value = function (a) {
    var b = this.properties.values,
        c = "";
    for (a = 0; a < b.length; a++) {
        var d = this.properties.selected_row_id == b[a][0];
        c += "<div class='card' row-id='" + b[a][0] + "' >";
        for (var e = 1; e < b[a].length; e++) c += "<div class='content " + (d ? "active" : "") + "' >" + b[a][e] + "</div>";
        c += "</div>"
    }
    $("#" + this.control_id()).html(c);
    b = "";
    c = this.properties.pages.pages_list;
    if (1 < c.length) {
        b += '<div class="ui right floated pagination menu small">';
        0 < c[0] && (b += '<a class="icon item" pageindex="' +
            c[0] + '" ><i class="left chevron icon"></i></a>');
        for (a = 1; a < c.length - 1; a++) b += '<a pageindex="' + c[a] + '" class="item ' + (c[a] == this.properties.pages.current_page ? "active" : "") + '">' + c[a] + "</a>";
        0 < c[c.length - 1] && (b += '<a pageindex="' + c[c.length - 1] + '" class="icon item"><i class="right chevron icon"></i></a>');
        b += "</div>";
        $("#" + this.control_id()).append(b)
    }
    this.set_click_events()
};
ControlQueryCards.prototype.set_click_events = function () {
    var a = this;
    $("#" + this.control_id() + " tbody td").click(function () {
        $(this).hasClass("active") || (a.properties.selected_row_id = $(this).parent().attr("row-id"), a.basewidget.fire_event(a.name, "item_selection_changed_client_event"))
    });
    $("#" + this.control_id() + " .pagination .item").click(function () {
        $(this).hasClass("active") || (a.properties.pages.current_page = $(this).attr("pageindex"), a.basewidget.fire_event(a.name, "page_changed_event"))
    })
};
var ControlPassword = function (a) {
    ControlBase.apply(this, arguments)
};
$jscomp.inherits(ControlPassword, ControlBase);
ControlPassword.prototype.init_control = function () {
    var a = "<div id='" + this.place_id() + "' class='field control ControlPassword' ><label>" + this.properties.label + "</label><input placeholder='" + this.properties.label + "' type='password' name='" + this.name + "' id='" + this.control_id() + "' /></div>";
    this.jquery_place().replaceWith(a);
    var b = this;
    this.jquery().change(function () {
        b.basewidget.fire_event(this.name, "update_control_event")
    });
    this.properties.error ? this.jquery_place().addClass("error") : this.jquery_place().removeClass("error")
};
var ControlPlayer = function (a) {
    ControlBase.apply(this, arguments)
};
$jscomp.inherits(ControlPlayer, ControlBase);
ControlPlayer.prototype.get_value = function () {
    this.properties.video_index = $("#timeline" + this.control_id()).val();
    return this.properties.value
};
ControlPlayer.prototype.set_value = function (a) {
    this.properties.base64content && ($("#display" + this.control_id()).attr("src", "data:image/png;base64," + this.properties.base64content), $("#timeline" + this.control_id()).val(this.properties.video_index), $("#timeline" + this.control_id()).attr("min", 0), $("#timeline" + this.control_id()).attr("max", this.properties.endFrame))
};
ControlPlayer.prototype.init_control = function () {
    var a = "<div id='" + this.place_id() + "' class='field control ControlPlayer' >";
    a += "<div class='ui card " + this.properties.css + "' id='card" + this.control_id() + "' >";
    a = a + "<div class='image'>" + ("<img style='width:100%;' class='image' src='data:image/png;base64," + this.properties.base64content + "' id='display" + this.control_id() + "' />");
    a = a + "</div><div class='content'>" + ("<input style='width:100%;' type='range' name='" + this.name + "' value='" + this.properties.value +
        "' id='timeline" + this.control_id() + "' max='" + this.properties.endFrame + "'>");
    a += "</div></div></div>";
    this.jquery_place().replaceWith(a);
    var b = this;
    $("#timeline" + this.control_id()).change(function () {
        b.basewidget.fire_event(b.name, "refresh")
    })
};
ControlPlayer.prototype.update_server = function () {
    return this.properties.video_index != $("#timeline" + this.control_id()).val()
};
ControlPlayer.prototype.serialize = function () {
    ControlBase.prototype.serialize.call(this);
    this.properties.base64content = null;
    return this.properties
};
var ControlPlayerJs = function (a) {
    ControlBase.apply(this, arguments)
};
$jscomp.inherits(ControlPlayerJs, ControlBase);
ControlPlayerJs.prototype.init_control = function () {
    var a = "\n            <div id='" + this.place_id() + "' class='field control ControlPlayerJs' >\n                <video class=\"video\" id=\"" + this.control_id() + '" muted >\n                    <source src="' + this.properties.value + '">\n                    Your browser does not support HTML5 video.\n                </video>\n                <div style=\'background-color:black\' ><canvas class="canvas" id="canvas-' + this.control_id() + '" ></canvas></div>\n                <div class="video-timeline" id="timeline-' +
        this.control_id() + '" >\n                    <div class="video-timeline-passed"></div>\n                    <div class="video-timeline-loaded"></div>\n                </div>\n                <div class=\'video-graph\'></div>\n            <div>';
    this.jquery_place().replaceWith(a);
    var b = this;
    $(document).ready(function () {
        b.video = new CanvasVideoPlayer({
            playerSelector: "#" + b.place_id(),
            videoSelector: "#" + b.control_id(),
            canvasSelector: "#canvas-" + b.control_id(),
            timelineSelector: "#timeline-" + b.control_id(),
            audio: !1,
            video_width: b.properties.video_width,
            video_height: b.properties.video_height,
            draws_url: b.properties.draws_url
        })
    })
};
ControlPlayerJs.prototype.load_data = function () {
    if (this.properties.data_url) {
        var a = this;
        $.ajax({
            method: "get",
            cache: !1,
            dataType: "json",
            url: this.properties.data_url + "?nocache=" + $.now(),
            contentType: "application/json; charset=utf-8",
            success: function (b) {
                if (b.graphs)
                    for (var c in b.graphs) a.video.add_graph(b.graphs[c].title, b.graphs[c].data, b.graphs[c].color);
                if (b.events) {
                    for (c in b.events) a.video.add_event(b.events[c][0], b.events[c][1], b.events[c][2], b.events[c][3], b.events[c][4]);
                    a.video.draw_timeline()
                }
            }
        }).always(function () {
            a.properties.data_url =
                void 0
        })
    }
};
ControlPlayerJs.prototype.get_value = function () {
    return null
};
ControlPlayerJs.prototype.set_value = function (a) {
    this.video.open(a)
};
ControlPlayerJs.prototype.update_server = function () {
    return !1
};
ControlPlayerJs.prototype.deserialize = function (a) {
    ControlBase.prototype.deserialize.call(this, a);
    this.load_data()
};
var ControlProgress = function (a) {
    ControlBase.apply(this, arguments)
};
$jscomp.inherits(ControlProgress, ControlBase);
ControlProgress.prototype.init_control = function () {
    this.jquery_place().replaceWith("<div title='" + this.properties.help + "' id='" + this.control_id() + "' class='progressbar control' ></div>")
};
var ControlBoundingSlider = function (a) {
    ControlBase.apply(this, arguments)
};
$jscomp.inherits(ControlBoundingSlider, ControlBase);
ControlBoundingSlider.prototype.set_value = function (a) {
    this.jquery().slider({
        values: val
    });
    $("#value-" + this.control_id()).html(val)
};
ControlBoundingSlider.prototype.get_value = function () {
    return {
        value: this.jquery().slider("values"),
        max: this.properties.max,
        min: this.properties.min
    }
};
ControlBoundingSlider.prototype.init_control = function () {
    var a = "<div class='ControlSlider field control' id='" + this.place_id() + "' title='" + this.properties.help + "'   >";
    a += "<label style='margin-right: 20px;' for='" + this.control_id() + "'>" + this.properties.label + ": <small id='value-" + this.control_id() + "' style='color:red' >" + this.properties.value + "</small></label>";
    a += "<div style='width:100%;' class='slider' name='" + this.name + "' id='" + this.control_id() + "' ></div>";
    a += "</div>";
    this.jquery_place().replaceWith(a);
    var b = this;
    this.jquery().slider({
        range: !0,
        slide: function (a, d) {
            $("#value-" + b.control_id()).html(d.value)
        },
        stop: function () {
            b.basewidget.fire_event(b.name, "update_control_event")
        },
        min: this.properties.min,
        max: this.properties.max,
        values: this.properties.value
    })
};
var ControlVisVis = function (a) {
    ControlBase.apply(this, arguments)
};
$jscomp.inherits(ControlVisVis, ControlBase);
ControlVisVis.prototype.init_control = function () {
    this.update_it = !1;
    var a = "<div id='" + this.place_id() + "' class='field control ControlVisVis' >";
    a += "<div id='chart-container-" + this.control_id() + "' title='" + this.properties.help + "'   >";
    a += "<div id='" + this.control_id() + "' ></div>";
    a += "</div></div>";
    this.jquery_place().replaceWith(a);
    var b = this;
    a = b.properties.legend;
    var c = b.properties.value;
    if (0 == c.length || 0 == c[0].length) c = [
        [
            [0, 0]
        ]
    ];
    this.chart = $.jqplot(this.control_id(), c, {
        grid: {
            borderColor: "transparent",
            shadow: !1,
            drawBorder: !1,
            shadowColor: "transparent",
            background: "transparent"
        },
        title: b.label,
        seriesDefaults: {
            showMarker: !1,
            showLine: !0,
            lineWidth: 1,
            markerOptions: {
                size: 6
            }
        },
        legend: {
            show: 0 < a.length,
            labels: a,
            placement: "outside",
            location: "e"
        },
        axes: {},
        cursor: {
            style: "pointer",
            show: !0,
            zoom: !0,
            tooltipOffset: 10,
            showTooltip: !0,
            followMouse: !0,
            showTooltipDataPosition: !0,
            showVerticalLine: !0
        }
    });
    b = this;
    this.jquery().bind("jqplotDataClick", function (a, c, f, g) {
        b.properties.selected_series = c;
        b.properties.selected_data = g;
        b.update_it = !0;
        b.basewidget.fire_event(b.name, "remote_data_selected_event")
    })
};
ControlVisVis.prototype.set_value = function (a) {
    this.chart.replot({
        data: a,
        legend: {
            show: 0 < this.properties.legend.length,
            labels: this.properties.legend,
            showLabels: !0,
            showSwatch: !0
        }
    })
};
ControlVisVis.prototype.get_value = function () {
    return this.properties.value
};
ControlVisVis.prototype.update_server = function () {
    return this.get_value() != this.properties.value || this.update_it
};
ControlVisVis.prototype.deserialize = function (a) {
    this.properties = $.extend(this.properties, a);
    this.set_value(this.properties.value)
};
ControlVisVis.prototype.serialize = function () {
    this.properties.value = this.get_value();
    return this.properties
};
var ControlLabel = function (a) {
    ControlBase.apply(this, arguments)
};
$jscomp.inherits(ControlLabel, ControlBase);
ControlLabel.prototype.get_value = function () {
    return this.properties.value
};
ControlLabel.prototype.init_control = function () {
    var a = '<div class="ui field ' + this.properties.css + ' message control ControlLabel" id="' + this.place_id() + '"  >';
    a = a + '<div class="header">' + this.properties.label;
    a = a + "</div>" + ('<p id="' + this.control_id() + '" >');
    if (null != this.properties.value || void 0 != this.properties.value) a += this.properties.value;
    a += "</p></div>";
    this.jquery_place().replaceWith(a)
};
ControlLabel.prototype.set_value = function (a) {
    this.init_control()
};
var ControlSimpleLabel = function (a) {
    ControlBase.apply(this, arguments)
};
$jscomp.inherits(ControlSimpleLabel, ControlBase);
ControlSimpleLabel.prototype.get_value = function () {
    return this.properties.value
};
ControlSimpleLabel.prototype.init_control = function () {
    var a = '<div class="ui field ' + this.properties.css + ' control ControlSimpleLabel" id="' + this.place_id() + '"  >';
    this.properties.label && (a = a + '<div class="header">' + this.properties.label, a += "</div>");
    a += '<p id="' + this.control_id() + '" >';
    if (null != this.properties.value || void 0 != this.properties.value) a += this.properties.value;
    a += "</p></div>";
    this.jquery_place().replaceWith(a)
};
ControlSimpleLabel.prototype.set_value = function (a) {
    this.init_control()
};
var ControlTimeout = function (a, b) {
    ControlBase.call(this, a, b);
    this.timer = void 0
};
$jscomp.inherits(ControlTimeout, ControlBase);
ControlTimeout.prototype.init_control = function () {
    var a = "<div id='" + this.place_id() + "' class='field control ControlTimeout' ><label>" + this.properties.label + "</label>";
    a += "<div id='" + this.control_id() + "' data-percent='0' class='ui tiny progress'><div class='bar'></div></div>";
    a += "</div>";
    this.jquery_place().replaceWith(a);
    this.set_value(this.properties.value);
    "True" == this.properties.play && this.update_progress_bar(!0)
};
ControlTimeout.prototype.update_progress_bar = function (a) {
    a || this.jquery().progress("increment", this.properties.update_interval);
    if (100 > parseInt(this.jquery().attr("data-percent"))) {
        var b = this;
        this.timer = setTimeout(function () {
            b.update_progress_bar(!1)
        }, b.properties.update_interval)
    } else this.basewidget.fire_event(this.name, "trigger_event")
};
ControlTimeout.prototype.get_value = function () {
    return this.properties.value
};
ControlTimeout.prototype.set_value = function (a) {
    this.jquery().progress({
        total: a,
        value: 0
    })
};
ControlTimeout.prototype.deserialize = function (a) {
    a.play = "True" == a.play;
    last_play_value = this.properties.play;
    $.extend(this.properties, a);
    0 != this.properties.play && void 0 === a.value || void 0 == this.timer || (clearTimeout(this.timer), this.timer = void 0);
    void 0 !== a.value && (this.set_value(this.properties.value), this.properties.play && this.update_progress_bar(!1));
    0 == last_play_value && this.properties.play && this.update_progress_bar(!1)
};
var ControlEmptyWidget = function (a) {
    ControlBase.apply(this, arguments)
};
$jscomp.inherits(ControlEmptyWidget, ControlBase);
ControlEmptyWidget.prototype.init_control = function () {
    var a = "";
    void 0 !== this.properties.html && (a = Base64.decode(this.properties.html));
    a = "<div id='" + this.place_id() + "' class='field control ControlEmptyWidget " + this.properties.css + "' >" + a + "</div>";
    this.jquery_place().replaceWith(a);
    void 0 !== this.properties.child_widget_id && pyforms.find_app(this.properties.child_widget_id).deserialize(this.properties.widget_data);
    this.set_value(this.properties.value)
};
ControlEmptyWidget.prototype.serialize = function () {
    if (void 0 === this.properties.child_widget_id) return this.properties;
    var a = pyforms.find_app(this.properties.child_widget_id);
    this.properties.widget_data = a.serialize();
    0 < a.events_queue.length && (this.properties.widget_data.event = a.events_queue.pop(0));
    return this.properties
};
ControlEmptyWidget.prototype.deserialize = function (a) {
    1 == a.clear_widget && (pyforms.remove_app(this.properties.child_widget_id), this.jquery_place().html(""), void 0 === a.child_widget_id && delete this.properties.child_widget_id, delete this.properties.clear_widget, delete a.clear_widget);
    void 0 !== a.html && (this.jquery_place().html(Base64.decode(a.html)), delete a.html);
    $.extend(this.properties, a);
    void 0 !== this.properties.child_widget_id && pyforms.find_app(this.properties.child_widget_id).deserialize(this.properties.widget_data);
    this.set_value(this.properties.value)
};
ControlEmptyWidget.prototype.update_server = function () {
    return !0
};
var ControlMenu = function (a) {
    ControlBase.apply(this, arguments)
};
$jscomp.inherits(ControlMenu, ControlBase);
ControlMenu.prototype.get_value = function () {
    return this.properties.value
};
ControlMenu.prototype.init_control = function () {
    var a = '<div id="' + this.place_id() + '" class="field control ControlMenu">';
    this.properties.label && (a += "<label>" + this.properties.label + "</label>");
    a += '<div id="' + this.control_id() + '" class="ui vertical accordion menu">';
    menu = this.properties.value;
    for (var b = 0; b < menu.length; b++) {
        a += '<div class="item">';
        a += '<a class="active title"><i class="dropdown icon"></i> <b>' + menu[b][0] + "</b></a>";
        a += '<div class="active content menu">';
        for (var c = 0; c < menu[b][1].length; c++) a +=
            '<a class="item" href="javascript:pyforms.find_app(\'' + this.app_id() + "').fire_event('self', '" + menu[b][1][c][1] + "');\">" + menu[b][1][c][0] + "</a>";
        a += "</div>";
        a += "</div>"
    }
    a += "</div></div>";
    this.jquery_place().replaceWith(a);
    this.jquery_place().accordion({
        exclusive: !1
    })
};
ControlMenu.prototype.set_value = function (a) {
    this.init_control()
};
var ControlTree = function (a) {
    ControlBase.apply(this, arguments)
};
$jscomp.inherits(ControlTree, ControlBase);
ControlTree.prototype.init_control = function () {
    var a = "<div id='" + this.place_id() + "' class='field control ControlTree' >";
    a += "<ul class='tree' id='" + this.control_id() + "' >";
    for (var b = 0; b < this.properties.root.childs.length; b++) a += this.render_node(this.properties.root.childs[b]);
    a += "</ul></div>";
    this.jquery_place().replaceWith(a);
    this.set_value(this.properties.value);
    var c = this;
    $("#" + this.control_id() + " label").click(function () {
        c.set_value($(this).attr("node-id"));
        c.basewidget.fire_event(c.name, "update_control_event")
    });
    this.properties.error ? this.jquery_place().addClass("error") : this.jquery_place().removeClass("error")
};
ControlTree.prototype.render_node = function (a) {
    var b = "<li><label node-id='" + a.node_id + "' >" + a.name + "</label>";
    if (0 < a.childs.length) {
        b += "<ul>";
        for (var c = 0; c < a.childs.length; c++) b += this.render_node(a.childs[c]);
        b += "</ul>"
    }
    return b + "</li>"
};
ControlTree.prototype.set_value = function (a) {
    $("#" + this.control_id() + " label").removeClass("selected");
    $("#" + this.control_id() + " label[node-id=" + a + "]").addClass("selected")
};
ControlTree.prototype.get_value = function () {
    var a = $("#" + this.control_id() + " label.selected");
    return 0 < a.length ? a.attr("node-id") : null
};
ControlTree.prototype.set_label = function (a) {};
var ControlOrganogram = function (a) {
    ControlBase.apply(this, arguments)
};
$jscomp.inherits(ControlOrganogram, ControlBase);
ControlOrganogram.prototype.init_control = function () {
    var a = "\n            <div class='field control ControlOrganogram' id='" + this.place_id() + "' >\n            </div>";
    this.jquery_place().replaceWith(a);
    this.place_id();
    conf.concat(this.properties.value);
    this.graph = new Treant(chart_config)
};
var ControlWorkflow = function (a) {
    ControlBase.apply(this, arguments)
};
$jscomp.inherits(ControlWorkflow, ControlBase);
ControlWorkflow.prototype.init_control = function () {
    var a = "<div id='" + this.place_id() + "' class='field control ControlWorkflow ui segment' ><label>" + this.properties.label + "</label><div id='" + this.control_id() + "' ></div></div>";
    this.jquery_place().replaceWith(a);
    var b = this;
    this.jquery().change(function () {
        b.basewidget.fire_event(b.name, "update_control_event", !1)
    });
    $("#" + this.control_id()).flowchart({
        data: this.properties.value,
        multipleLinksOnOutput: !0
    });
    this.properties.operator_selected_evt && $("#" + this.control_id()).flowchart({
        onOperatorSelect: function (a) {
            $("#" +
                b.control_id()).flowchart("unselectLink");
            b.properties.selected_operator = a;
            b.properties.stop_operator_select_evt || (b.properties.no_selected_operator_update = 1, b.properties.no_selected_link_update = 1, b.properties.selected_operator = a, b.properties.selected_link = void 0, b.basewidget.fire_event(b.name, "operator_selected_evt", !1), b.properties.no_selected_operator_update = void 0);
            return !0
        }
    });
    this.properties.operator_unselected_evt && $("#" + this.control_id()).flowchart({
        onOperatorUnselect: function () {
            b.properties.selected_operator =
                void 0;
            b.properties.stop_operator_unselect_evt || (b.properties.no_selected_operator_update = 1, b.properties.no_selected_link_update = 1, b.basewidget.fire_event(b.name, "operator_unselected_evt", !1), b.properties.no_selected_operator_update = void 0);
            return !0
        }
    });
    this.properties.link_selected_evt && $("#" + this.control_id()).flowchart({
        onLinkSelect: function (a) {
            $("#" + b.control_id()).flowchart("unselectOperator");
            b.properties.selected_link = a;
            b.properties.stop_link_select_evt || (b.properties.no_selected_operator_update =
                1, b.properties.no_selected_link_update = 1, b.properties.selected_link = a, b.properties.selected_operator = void 0, b.basewidget.fire_event(b.name, "link_selected_evt", !1), b.properties.no_selected_link_update = void 0);
            return !0
        }
    });
    this.properties.link_unselected_evt && $("#" + this.control_id()).flowchart({
        onLinkUnselect: function () {
            b.properties.selected_link = void 0;
            b.properties.stop_link_unselect_evt || (b.properties.no_selected_operator_update = 1, b.properties.no_selected_link_update = 1, b.basewidget.fire_event(b.name,
                "link_unselected_evt", !1), b.properties.no_selected_link_update = void 0);
            return !0
        }
    })
};
ControlWorkflow.prototype.set_value = function (a) {
    $("#" + this.control_id()).flowchart("setData", a)
};
ControlWorkflow.prototype.get_value = function () {
    return $("#" + this.control_id()).flowchart("getData")
};
ControlWorkflow.prototype.serialize = function () {
    this.properties.value = this.get_value();
    if (!this.properties.no_selected_operator_update) {
        var a = $("#" + this.control_id()).flowchart("getSelectedOperatorId");
        a && (this.properties.selected_operator = a)
    }!this.properties.no_selected_link_update && (a = $("#" + this.control_id()).flowchart("getSelectedLinkId")) && (this.properties.selected_link = a);
    return this.properties
};
ControlWorkflow.prototype.deserialize = function (a) {
    $.extend(this.properties, a);
    this.set_value(this.properties.value);
    this.properties.selected_operator && (this.properties.stop_operator_select_evt = 1, $("#" + this.control_id()).flowchart("selectOperator", this.properties.selected_operator), this.properties.stop_operator_select_evt = void 0);
    0 <= this.properties.selected_link && (this.properties.stop_link_select_evt = 1, this.properties.stop_link_unselect_evt = 1, $("#" + this.control_id()).flowchart("selectLink", this.properties.selected_link),
        this.properties.stop_link_select_evt = void 0, this.properties.stop_link_unselect_evt = void 0);
    a.deleteSelected && (this.properties.stop_operator_unselect_evt = 1, this.properties.stop_link_unselect_evt = 1, $("#" + this.control_id()).flowchart("deleteSelected"), this.properties.stop_operator_unselect_evt = void 0, this.properties.stop_link_unselect_evt = void 0)
};
var BaseWidget = function (a, b, c, d, e) {
    this.name = b;
    this.widget_id = a;
    this.controls = c;
    this.events_queue = [];
    this.parent_id = d;
    this.layout_position = e.layout_position;
    this.loading_begin = void 0;
    for (a = this.loading_counter = 0; a < c.length; a++) b = c[a], b.basewidget = this, b.init_control();
    for (a = 0; a < c.length; a++) c[a].after_init_control();
    if (void 0 != e.messages)
        for (c = 0; c < e.messages.length; c++) {
            a = e.messages[c];
            "" != a.type && this.jquery().addClass(a.type);
            b = '<div class="ui ' + a.type + ' message">';
            b += '<i class="close icon"></i>';
            a.title && (b += '<div class="header">' + a.title + "</div>");
            if (1 == a.messages.length) b += "<p>" + a.messages[0] + "</p>";
            else {
                b += '<ul class="list">';
                for (c = 0; c < a.messages.length; c++) b += "<li>" + a.messages[c] + "</li>";
                b += "</ul>"
            }
            $(b).prependTo(this.jquery()).find(".close").on("click", function () {
                $(this).closest(".message").transition({
                    animation: "fade",
                    onComplete: function () {
                        $(this).remove()
                    }
                })
            })
        }
    if (e.refresh_timeout) {
        var f = this;
        this.refresh_timeout = e.refresh_timeout;
        this.timeout_loop = setInterval(function () {
                f.refresh_timeout_event()
            },
            e.refresh_timeout)
    }
};
BaseWidget.prototype.refresh_timeout_event = function () {
    this.fire_event("self", "refresh_event")
};
BaseWidget.prototype.parent_widget = function () {
    if (void 0 !== this.parent_id) return pyforms.find_app(this.parent_id)
};
BaseWidget.prototype.find_control = function (a) {
    for (var b = 0; b < this.controls.length; b++)
        if (this.controls[b].name == a) return this.controls[b]
};
BaseWidget.prototype.control_id = function (a) {
    return this.widget_id + "-" + a
};
BaseWidget.prototype.fire_event = function (a, b, c) {
    this.events_queue.push({
        event: {
            control: a,
            event: b
        }
    });
    void 0 === this.parent_id ? pyforms.query_server(this, this.events_queue.pop(0), c) : pyforms.query_server(this, void 0, c)
};
BaseWidget.prototype.update_controls = function () {
    pyforms.query_server(this, {})
};
BaseWidget.prototype.deserialize = function (a) {
    var b = a["js-code"];
    if (b && 0 < b.length)
        for (var c = 0; c < b.length; c++) eval(b[c]);
    for (c = 0; c < this.controls.length; c++) b = this.controls[c], a[b.name] && (b.deserialize(a[b.name]), b.apply_deserialization());
    if (void 0 != a.messages)
        for (c = 0; c < a.messages.length; c++) {
            b = a.messages[c];
            "" != b.type && this.jquery().addClass(b.type);
            var d = '<div class="ui ' + b.type + ' message">';
            d += '<i class="close icon"></i>';
            b.title && (d += '<div class="header">' + b.title + "</div>");
            if (1 == b.messages.length) d +=
                "<p>" + b.messages[0] + "</p>";
            else {
                d += '<ul class="list">';
                for (c = 0; c < b.messages.length; c++) d += "<li>" + b.messages[c] + "</li>";
                d += "</ul>"
            }
            $(d).prependTo(this.jquery()).find(".close").on("click", function () {
                $(this).closest(".message").transition({
                    animation: "fade",
                    onComplete: function () {
                        $(this).remove()
                    }
                })
            })
        }
    a.close_widget && (pyforms.close_layout_place(a), pyforms.remove_app(a.uid));
    if (null != a.refresh_timeout) {
        if (this.refresh_timeout != a.refresh_timeout) {
            var e = this;
            this.timeout_loop && clearInterval(this.timeout_loop);
            this.refresh_timeout = a.refresh_timeout;
            this.timeout_loop = setInterval(function () {
                e.refresh_timeout_event()
            }, a.refresh_timeout)
        }
    } else this.timeout_loop && (clearInterval(this.timeout_loop), this.timeout_loop = null)
};
BaseWidget.prototype.serialize = function () {
    var a = 0 < this.events_queue.length ? this.events_queue.pop(0) : {};
    for (var b = 0; b < this.controls.length; b++) a[this.controls[b].name] = this.controls[b].serialize();
    return a
};
BaseWidget.prototype.serialize_data = function (a) {
    for (var b = 0; b < this.controls.length; b++) {
        var c = this.controls[b];
        c.update_server() && (a[c.name] = c.serialize())
    }
    a.uid = this.widget_id;
    return a
};
BaseWidget.prototype.activate_load_event = function () {
    if (0 >= this.loading_counter) return this.jquery().removeClass("loading"), !1;
    void 0 != this.loading_begin && Date.now() - this.loading_begin > PYFORMS_CHECKER_LOOP_INTERVAL && !this.jquery().hasClass("loading") && this.jquery().addClass("loading");
    return !0
};
BaseWidget.prototype.loading = function () {
    void 0 == this.loading_begin && (this.loading_begin = Date.now());
    this.loading_counter++;
    if (1 == this.loading_counter) {
        var a = this;
        pyforms.register_checkloop(function () {
            return a.activate_load_event()
        })
    }
};
BaseWidget.prototype.not_loading = function () {
    this.loading_counter--;
    pyforms.checker_loop()
};
BaseWidget.prototype.close_sub_apps = function () {
    for (var a = 0; a < this.controls.length; a++) void 0 !== this.controls[a].properties.child_widget_id && pyforms.remove_app(this.controls[a].properties.child_widget_id)
};
BaseWidget.prototype.query_server = function (a) {
    pyforms.query_server(this, a)
};
BaseWidget.prototype.jquery = function () {
    return $("#app-" + this.widget_id)
};
BaseWidget.prototype.close = function () {
    clearTimeout(this.timeout_loop);
    this.close_sub_apps();
    this.jquery().remove()
};
var PYFORMS_CHECKER_LOOP_INTERVAL = 1E3;
(function (a) {
    a.getStylesheet = function (b) {
        var c = a.Deferred();
        b = a("<link/>", {
            rel: "stylesheet",
            type: "text/css",
            href: b
        }).appendTo("head");
        c.resolve(b);
        return c.promise()
    }
})(jQuery);
$.ajaxSetup({
    cache: !0
});
if ("function" != typeof loading) var loading = function () {};
if ("function" != typeof not_loading) var not_loading = function () {};
var PyformsManager = function () {
    this.loop_checks = [];
    this.loop = void 0;
    this.layout_places = [];
    this.applications = [];
    setInterval(this.garbage_collector, 5E3)
};
PyformsManager.prototype.add_app = function (a) {
    for (var b = 0; b < this.applications.length; b++)
        if (void 0 != this.applications[b] && this.applications[b].widget_id == a.widget_id) {
            this.applications[b].close_sub_apps();
            delete this.applications[b];
            this.applications.slice(b, 1);
            break
        } this.applications.push(a)
};
PyformsManager.prototype.remove_app = function (a, b) {
    var c = null;
    if (void 0 == b)
        for (var d = 0; d < this.applications.length; d++) void 0 != this.applications[d] && this.applications[d].widget_id == a && (b = d);
    c = this.applications[b];
    void 0 != c && null != c && $.ajax({
        method: "get",
        cache: !1,
        dataType: "json",
        url: "/pyforms/app/remove/" + c.widget_id + "/?nocache=" + $.now(),
        contentType: "application/json; charset=utf-8"
    }).always(function () {
        c.close();
        delete pyforms.applications[b];
        pyforms.applications.slice(b, 1)
    })
};
PyformsManager.prototype.find_app = function (a) {
    for (var b = 0; b < this.applications.length; b++)
        if (void 0 != this.applications[b] && this.applications[b].widget_id == a) return this.applications[b]
};
PyformsManager.prototype.find_control = function (a) {
    a = this.split_id(a);
    var b = a[1];
    return this.find_app(a[0]).find_control(b)
};
PyformsManager.prototype.split_id = function (a) {
    var b = a.lastIndexOf("-"),
        c = a.substring(0, b);
    a = a.substring(b + 1);
    return [c, a]
};
PyformsManager.prototype.query_server = function (a, b, c) {
    void 0 === b && (b = {});
    void 0 === c && (c = !0);
    if (void 0 !== a.parent_id) {
        var d = a.parent_widget();
        this.query_server(d, b)
    } else {
        c && a.loading();
        b = a.serialize_data(b);
        b = JSON.stringify(b);
        var e = this;
        $.ajaxSetup({
            async: !1,
            cache: !0
        });
        $.ajax({
            method: "post",
            cache: !1,
            dataType: "json",
            url: "/pyforms/app/update/" + a.widget_id + "/?nocache=" + $.now(),
            data: b,
            contentType: "application/json; charset=utf-8",
            success: function (a) {
                if ("error" == a.result) error_msg(a.msg);
                else
                    for (var b = 0; b <
                        a.length; b++) e.open_application(a[b])
            }
        }).fail(function (a) {
            error_msg(a.status + " " + a.statusText + ": " + a.responseText)
        }).always(function () {
            c && a.not_loading();
            $.ajaxSetup({
                async: !0,
                cache: !0
            })
        });
        0 < a.events_queue.length && this.query_server(a, a.events_queue.pop(0))
    }
};
PyformsManager.prototype.register_checkloop = function (a) {
    this.loop_checks.push(a);
    void 0 === this.loop && (this.loop = setInterval(pyforms.checker_loop, PYFORMS_CHECKER_LOOP_INTERVAL))
};
PyformsManager.prototype.checker_loop = function () {
    for (var a = pyforms.loop_checks.length - 1; 0 <= a; a--) pyforms.loop_checks[a]() || pyforms.loop_checks.splice(a, 1);
    0 == pyforms.loop_checks.length && (clearInterval(pyforms.loop), pyforms.loop = void 0)
};
PyformsManager.prototype.register_layout_place = function (a, b, c, d) {
    for (var e = !0, f = 0; f < this.layout_places.length; f++)
        if (this.layout_places[f].place_id == a) {
            this.layout_places[f].open_handler = b;
            this.layout_places[f].activate_handler = c;
            this.layout_places[f].close_handler = d;
            e = !1;
            break
        } e && this.layout_places.push({
        place: a,
        open_handler: b,
        activate_handler: c,
        close_handler: d
    })
};
PyformsManager.prototype.open_application = function (a) {
    var b = pyforms.find_app(a.uid),
        c = a.layout_position,
        d = a.uid;
    if (void 0 != b) {
        b.deserialize(a);
        if (!a.close_widget)
            for (a = 0; a < this.layout_places.length; a++)
                if (this.layout_places[a].place == c && this.layout_places[a].activate_handler) {
                    this.layout_places[a].activate_handler(d);
                    break
                } not_loading()
    } else {
        d = a.uid;
        b = "/pyforms/app/open/" + d + "/";
        var e = a.title,
            f = !1;
        for (a = 0; a < this.layout_places.length; a++)
            if (this.layout_places[a].place == c) {
                this.layout_places[a].open_handler(d,
                    e, b);
                f = !0;
                break
            } f || $.ajax({
            method: "get",
            cache: !1,
            dataType: "json",
            url: b,
            contentType: "application/json; charset=utf-8",
            success: function (a) {
                if ("error" == a.result) error_msg(a.msg);
                else {
                    var b = "<form onsubmit='return false;' class='ui form " + a.css + "' id='app-" + a.app_id + "' >";
                    b += a.code;
                    b += "</form>";
                    $("#" + c).html(b)
                }
            }
        }).fail(function (a) {
            error_msg(a.status + " " + a.statusText + ": " + a.responseText)
        }).always(function () {
            pyforms.garbage_collector()
        })
    }
};
PyformsManager.prototype.garbage_collector = function () {
    for (var a = pyforms.applications.length - 1; 0 <= a; a--) void 0 != pyforms.applications[a] && 0 == pyforms.applications[a].jquery().length && pyforms.remove_app(null, a)
};
PyformsManager.prototype.close_layout_place = function (a) {
    var b = pyforms.find_app(a.uid),
        c = a.layout_position;
    a = a.uid;
    if (void 0 != b)
        for (b = 0; b < this.layout_places.length; b++)
            if (this.layout_places[b].place == c && this.layout_places[b].close_handler) {
                this.layout_places[b].close_handler(a);
                break
            }
};
if (void 0 == pyforms) var pyforms = new PyformsManager;

function error_msg(a) {
    alert(a)
}

function run_application(a, b, c) {
    var d = {};
    c && (d.method = c);
    b && (d.constructor = b);
    d = JSON.stringify(d);
    $.ajaxSetup({
        async: !1,
        cache: !0
    });
    $.ajax({
        method: "post",
        cache: !1,
        dataType: "json",
        data: d,
        url: "/pyforms/app/register/" + a + "/?nocache=" + $.now(),
        contentType: "application/json; charset=utf-8",
        success: function (a) {
            if ("error" == a.result) error_msg(a.msg);
            else
                for (var b = 0; b < a.length; b++) pyforms.open_application(a[b])
        }
    }).fail(function (a) {
        error_msg(a.status + " " + a.statusText + ": " + a.responseText)
    }).always(function () {
        $.ajaxSetup({
            async: !0,
            cache: !0
        })
    })
}

function pyforms_checkhash() {
    var a = window.location.hash;
    if (0 != a.length && "#/" == a.slice(0, 2)) {
        var b = a.split("/"),
            c = b[1],
            d = 2 < b.length && "?" != b[2][0] ? b[2] : void 0;
        if (c) {
            var e = {};
            if (d)
                for (e.method = d, e.params = {}, d = 3; d < b.length; d += 2) e.params[b[d]] = b[d + 1];
            var f = {};
            b = a.split("?");
            d = "";
            2 <= b.length && (d = b[1]);
            d.replace(/([^=&]+)=([^&]*)/g, function (a, b, c) {
                f[decodeURIComponent(b)] = decodeURIComponent(c)
            });
            run_application(c, f, e);
            "&" != a.charAt(a.length - 1) && (window.location.hash = a + (1 < b.length ? "" : "?") + "&")
        }
    }
}
var pyforms_checkhash_flag = !0;

function pyforms_checkhash_wrapper() {
    pyforms_checkhash_flag && (pyforms_checkhash_flag = !1, pyforms_checkhash(), setTimeout("pyforms_checkhash_flag=true;", 500))
}
$(window).bind("hashchange", pyforms_checkhash_wrapper);