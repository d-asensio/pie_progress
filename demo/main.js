var draw = SVG("drawing")

var m = new PieP.PieProgress(300, 0, draw)

function setPer(p) {
    setTimeout(function() {
        m.setPercentage(p)
        if (p < 99) {
            if (p < 33) {
                m.setColor("#5cb85c")
            } else if( p < 66) {
                m.setColor("#f0ad4e")
            } else {
                m.setColor("#c9302c")
            }

            setPer(++p)
        }
    }, 100)
}

setPer(1)