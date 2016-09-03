var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../definitions/svg.js.d.ts" />
var PieP;
(function (PieP) {
    /**
     * Event
     */
    var Event = (function () {
        function Event(sender) {
            this._sender = sender;
            this._listeners = [];
        }
        Event.prototype.attach = function (listener) {
            this._listeners.push(listener);
        };
        Event.prototype.notify = function () {
            for (var _i = 0, _a = this._listeners; _i < _a.length; _i++) {
                var listener = _a[_i];
                listener(this._sender);
            }
        };
        return Event;
    }());
    PieP.Event = Event;
    /**
     * PieProgressModel
     */
    var PieProgressModel = (function () {
        function PieProgressModel(radius, percentage) {
            this._change = new Event(this);
            this.setRadius(radius);
            this.setPercentage(percentage);
        }
        PieProgressModel.prototype.setRadius = function (radius) {
            this._radius = radius;
            this._change.notify();
        };
        PieProgressModel.prototype.getRadius = function () {
            return this._radius;
        };
        PieProgressModel.prototype.setPercentage = function (percentage) {
            // The percentage cannot be more than 100%
            this._percentage = Math.min(percentage, 100);
            this._change.notify();
        };
        PieProgressModel.prototype.getPercentage = function () {
            return this._percentage;
        };
        PieProgressModel.prototype.getAngle = function () {
            var angle = Math.ceil(360 * this.getPercentage() / 100);
            return angle;
        };
        PieProgressModel.prototype.getStartCoords = function () {
            var ax = this.getRadius() + this.getRadius();
            var ay = this.getRadius();
            return {
                x: ax,
                y: ay
            };
        };
        PieProgressModel.prototype.getEndCoords = function () {
            var ax = this.getRadius() + this.getRadius() * Math.cos(Math.PI * this.getAngle() / 180);
            var ay = this.getRadius() + this.getRadius() * Math.sin(Math.PI * this.getAngle() / 180);
            return {
                x: ax,
                y: ay
            };
        };
        PieProgressModel.prototype.onChange = function (changeCallback) {
            this._change.attach(changeCallback);
        };
        return PieProgressModel;
    }());
    /**
     * PieProgressView
     */
    var PieProgressView = (function () {
        function PieProgressView(model, container) {
            this._model = model;
            this._container = container;
            var pathArray = this.getPathArray();
            this._pieProgressPath = this._container.path(pathArray.toString());
            this._dataCircle = this._container.circle();
            this._dataText = this._container.text("");
            this.stylize();
            this.render();
        }
        PieProgressView.prototype.stylize = function () {
            this._pieProgressPath.attr({
                "fill": "#1b51aa"
            });
            this._dataCircle.attr({
                "fill": "#ffffff"
            });
            this._dataText.font({
                family: "'Oswald', sans-serif",
                size: this._model.getRadius() / 2,
                leading: "1.5em"
            }).attr({
                "fill": "#1b51aa"
            });
        };
        PieProgressView.prototype.render = function () {
            var pathArray = this.getPathArray();
            this._pieProgressPath.plot(pathArray.toString());
            this._dataCircle.radius(this._model.getRadius() - this._model.getRadius() / 4)
                .cx(this._model.getRadius())
                .cy(this._model.getRadius());
            this._dataText.text(this._model.getPercentage() + " %")
                .cx(this._model.getRadius())
                .cy(this._model.getRadius());
        };
        PieProgressView.prototype.getPathArray = function () {
            var pathArray = new SVG.PathArray([
                [
                    "M",
                    this._model.getRadius(),
                    this._model.getRadius()
                ],
                [
                    "L",
                    this._model.getStartCoords().x,
                    this._model.getStartCoords().y
                ],
                [
                    "A",
                    this._model.getRadius(),
                    this._model.getRadius(),
                    0,
                    this._model.getAngle() >= 180 ? 1 : 0,
                    1,
                    this._model.getEndCoords().x,
                    this._model.getEndCoords().y
                ],
                ["Z"]
            ]);
            return pathArray;
        };
        return PieProgressView;
    }());
    /**
     * PieProgressController
     */
    var PieProgressController = (function () {
        function PieProgressController(model, view) {
            var _this = this;
            this._model = model;
            this._view = view;
            this._model.onChange(function () {
                _this._view.render();
            });
        }
        return PieProgressController;
    }());
    /**
     * PieProgress
     */
    var PieProgress = (function (_super) {
        __extends(PieProgress, _super);
        function PieProgress(radius, percentage, container) {
            _super.call(this, radius, percentage);
            this._view = new PieProgressView(this, container);
            this._controller = new PieProgressController(this, this._view);
        }
        return PieProgress;
    }(PieProgressModel));
    PieP.PieProgress = PieProgress;
})(PieP || (PieP = {}));
