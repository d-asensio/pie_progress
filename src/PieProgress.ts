/// <reference path="../definitions/svg.js.d.ts" />

namespace PieP {

    /**
     * Event
     */
    export class Event <Sender>{
        private _sender: Sender
        private _listeners: ((sender: Sender) => any) []

        constructor(sender: Sender) {
            this._sender = sender
            this._listeners = []
        }

        public attach(listener: (sender: Sender) => any): void {
                this._listeners.push(listener)
        }

        public notify(): void {
            for (let listener of this._listeners) {
                listener(this._sender)
            }
        }
    }

    /**
     * Coordinates
     */
    interface Coords {
        x: number
        y: number
    }

    /**
     * PieProgressModel
     */
    class PieProgressModel {
        private _radius: number
        private _percentage: number
        private _color: string

        private _change: Event <PieProgressModel>

        constructor(radius: number, percentage: number) {
            this._change = new Event <PieProgressModel>(this)

            this.setRadius(radius)
            this.setPercentage(percentage)
            this.setColor("#1b51aa")
        }

        public setRadius(radius: number): void {
            this._radius = radius
            this._change.notify()
        }

        public getRadius(): number {
            return this._radius
        }

        public setPercentage(percentage: number): void {
            // The percentage cannot be more than 100%
            this._percentage = Math.min(percentage, 100)
            this._change.notify()
        }

        public getPercentage(): number {
            return this._percentage
        }

        public getAngle(): number {
            const angle = Math.ceil(360 * this.getPercentage() / 100)
            return angle
        }

        public getStartCoords(): Coords {
            const ax = this.getRadius() + this.getRadius()
            const ay = this.getRadius()

            return {
                x: ax,
                y: ay
            }
        }

        public getEndCoords(): Coords {
            const ax = this.getRadius() + this.getRadius() * Math.cos(Math.PI * this.getAngle() / 180)
            const ay = this.getRadius() + this.getRadius() * Math.sin(Math.PI * this.getAngle() / 180)

            return {
                x: ax,
                y: ay
            }
        }

        public setColor(color: string): void {
            this._color = color
            this._change.notify()
        }

        public getColor(): string {
            return this._color
        }

        public onChange(changeCallback: (sender: PieProgressModel) => any): void {
            this._change.attach(changeCallback)
        }
    }

    /**
     * PieProgressView
     */
    class PieProgressView {
        private _model: PieProgressModel
        private _container: svgjs.Container

        private _pieProgressPath: svgjs.Path
        private _dataCircle: svgjs.Circle
        private _dataText: svgjs.Text

        constructor(model: PieProgressModel, container: svgjs.Container) {
            this._model = model
            this._container = container

            const pathArray = this.getPathArray()
            this._pieProgressPath = this._container.path(pathArray.toString())

            this._dataCircle = this._container.circle()

            this._dataText = this._container.text("")

            this.render()
        }

        private stylize(): void {
            this._pieProgressPath.attr({
                  "fill": this._model.getColor()
            })

            this._dataCircle.attr({
                  "fill": "#ffffff"
            })

            this._dataText.font({
                family: "'Oswald', sans-serif"
                , size: this._model.getRadius() / 2
                , leading: "1.5em"
            }).attr({
                  "fill": this._model.getColor()
            })
        }

        public render(): void {
            this.stylize()

            const pathArray = this.getPathArray()
            this._pieProgressPath.plot(pathArray.toString())

            this._dataCircle.radius(this._model.getRadius() - this._model.getRadius() / 4)
                    .cx(this._model.getRadius())
                    .cy(this._model.getRadius())

            this._dataText.text(this._model.getPercentage() + " %")
                    .cx(this._model.getRadius())
                    .cy(this._model.getRadius())
        }

        private getPathArray(): svgjs.PathArray {
            const pathArray = new SVG.PathArray([
                  [
                      "M"
                    , this._model.getRadius()
                    , this._model.getRadius()
                  ]
                , [
                      "L"
                    , this._model.getStartCoords().x
                    , this._model.getStartCoords().y
                  ]
                , [
                      "A"
                    , this._model.getRadius()
                    , this._model.getRadius()
                    , 0
                    , this._model.getAngle() >= 180 ? 1 : 0
                    , 1
                    , this._model.getEndCoords().x
                    , this._model.getEndCoords().y
                  ]
                , ["Z"]
            ])

            return pathArray
        }
    }

    /**
     * PieProgressController
     */
    class PieProgressController {
        private _model: PieProgressModel
        private _view: PieProgressView

        constructor(model: PieProgressModel, view: PieProgressView) {
            this._model = model
            this._view = view

            this._model.onChange(() => {
                this._view.render()
            })
        }
    }

    /**
     * PieProgress
     */
    export class PieProgress extends PieProgressModel {
        private _view: PieProgressView
        private _controller: PieProgressController

        constructor(radius: number, percentage: number, container: svgjs.Container) {
            super(radius, percentage)
            this._view = new PieProgressView(this, container)
            this._controller = new PieProgressController(this, this._view)
        }
    }
}