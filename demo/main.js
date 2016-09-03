var draw = SVG("drawing")

var m = new PieP.PieProgress(300, 0, draw)

function setPer(p) {
    setTimeout(function() {
        m.setPercentage(p)
        if (p < 99) {
            setPer(++p)
        }
    }, 100)
}

setPer(1)