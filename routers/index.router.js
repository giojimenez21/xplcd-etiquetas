const pug = require("pug");
const pdf = require("html-pdf");

const { Router } = require("express");

const router = Router();

router.get("/", (req, res) => {
    res.render("home");
});

router.post("/pdf", (req, res) => {
    const labels = req.body;
    //Dvidimos el objeto de 4 en 4 por dimensiones de la hoja.
    const labelsFormatted = [];
    labels.forEach((label) => {
        
        if (label.quantity > 6) {
            const { quantity } = label;
            let auxQuantity = parseInt(quantity / 6);
            let auxResidual = quantity % 6;
            
            for (let i = 0; i < auxQuantity; i++) {
                labelsFormatted.push({
                    quantity: "6",
                    labelData: {
                        noSerie: label.labelData.noSerie,
                        brand: label.labelData.brand,
                        lote: label.labelData.lote,
                        model: label.labelData.model,
                        quality1: label.labelData.quality1,
                        quality2: label.labelData.quality2,
                    },
                });
            }
            labelsFormatted.push({
                quantity: auxResidual,
                labelData: {
                    noSerie: label.labelData.noSerie,
                    brand: label.labelData.brand,
                    lote: label.labelData.lote,
                    model: label.labelData.model,
                    quality1: label.labelData.quality1,
                    quality2: label.labelData.quality2,
                },
            });
        } else {
            labelsFormatted.push({ ...label });
        }
    });

    const html = pug.renderFile(`${__dirname}/../views/labels.pug`, {
        labels: labelsFormatted,
    });

    pdf.create(html, {
        format: "Letter",
        orientation: "portrait",
        border: {
            left: "0.5cm",
            top: "0.5cm",
        },
    }).toFile(`${__dirname}/../labels/labels.pdf`, (err) => {
        if (err) {
            return console.log(err);
        }
        return res.status(200).json({
            path: `${process.env.HOST}/labels/labels.pdf`
        });
    });
});

module.exports = {
    router,
};
